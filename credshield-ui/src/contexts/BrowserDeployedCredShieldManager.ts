import { type ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { type UnboundTransaction } from '@midnight-ntwrk/midnight-js-types';
import {
  type CredShieldCircuitKeys,
  type CredShieldDerivedState,
  type CredShieldProviders,
  CredShieldAPI,
} from '@midnight-ntwrk/credshield-api';
import { type CredShieldPrivateState } from '@midnight-ntwrk/credshield-contract';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { BehaviorSubject, type Observable } from 'rxjs';
import { type Logger } from 'pino';
import { inMemoryPrivateStateProvider } from '../in-memory-private-state-provider';
import {
  type Binding,
  type FinalizedTransaction,
  type Proof,
  type SignatureEnabled,
  type TransactionId,
  Transaction,
} from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { fromHex, toHex } from '@midnight-ntwrk/midnight-js-utils';
import { formatContractAddress } from '../globals';

export type CredShieldDeployment =
  | {
      readonly status: 'in-progress';
    }
  | {
      readonly status: 'deployed';
      readonly api: CredShieldAPI;
    }
  | {
      readonly status: 'failed';
      readonly error: Error;
    };

export interface DeployedCredShieldAPIProvider {
  readonly deployments$: Observable<Array<Observable<CredShieldDeployment>>>;
  readonly resolve: (contractAddress?: ContractAddress) => Observable<CredShieldDeployment>;
  readonly retry: (contractAddress?: ContractAddress) => Observable<CredShieldDeployment>;
  readonly setConnectedAPI: (api: ConnectedAPI) => void;
}

export class BrowserDeployedCredShieldManager implements DeployedCredShieldAPIProvider {
  readonly #deploymentsSubject: BehaviorSubject<Array<BehaviorSubject<CredShieldDeployment>>>;
  #initializedProviders: Promise<CredShieldProviders> | undefined;
  #connectedAPI: ConnectedAPI | undefined;

  constructor(private readonly logger: Logger) {
    this.#deploymentsSubject = new BehaviorSubject<Array<BehaviorSubject<CredShieldDeployment>>>([]);
    this.deployments$ = this.#deploymentsSubject;
  }

  readonly deployments$: Observable<Array<Observable<CredShieldDeployment>>>;

  setConnectedAPI(api: ConnectedAPI): void {
    this.#connectedAPI = api;
    this.#initializedProviders = undefined;
  }

  retry(contractAddress?: ContractAddress): Observable<CredShieldDeployment> {
    this.#initializedProviders = undefined;
    const normalizedAddr = contractAddress
      ? (formatContractAddress(contractAddress) as ContractAddress)
      : undefined;
    const deployments = this.#deploymentsSubject.value;

    // Find any existing deployment (deployed OR failed) to retry in-place
    const existing = deployments.find((d) => {
      if (d.value.status === 'deployed' && d.value.api.deployedContractAddress === normalizedAddr) return true;
      if (d.value.status === 'failed') return true;
      if (d.value.status === 'in-progress') return true;
      return false;
    });

    if (existing) {
      // If it's already deployed and matches, just return it
      if (existing.value.status === 'deployed') return existing;

      // Re-attempt the failed/in-progress deployment in-place
      existing.next({ status: 'in-progress' });
      if (normalizedAddr) {
        void this.joinDeployment(existing, normalizedAddr);
      } else {
        void this.deployDeployment(existing);
      }
      return existing;
    }

    // Nothing to retry — fall through to resolve() which creates a new one
    return this.resolve(contractAddress);
  }

  resolve(contractAddress?: ContractAddress): Observable<CredShieldDeployment> {
    const normalizedAddr = contractAddress
      ? (formatContractAddress(contractAddress) as ContractAddress)
      : undefined;
    const deployments = this.#deploymentsSubject.value;

    // Check for any existing deployment matching this address (any status)
    const existing = deployments.find((d) => {
      if (d.value.status === 'deployed' && d.value.api.deployedContractAddress === normalizedAddr) return true;
      // For non-addressed deploys (new contract), match any in-progress
      if (!normalizedAddr && (d.value.status === 'in-progress')) return true;
      return false;
    });

    if (existing) {
      return existing;
    }

    const deployment = new BehaviorSubject<CredShieldDeployment>({
      status: 'in-progress',
    });

    if (normalizedAddr) {
      void this.joinDeployment(deployment, normalizedAddr);
    } else {
      void this.deployDeployment(deployment);
    }

    this.#deploymentsSubject.next([...deployments, deployment]);

    return deployment;
  }

  private getProviders(): Promise<CredShieldProviders> {
    if (!this.#connectedAPI) {
      return Promise.reject(
        new Error(
          'Wallet not connected. Please click "Connect Wallet" and approve authorization in Lace or 1AM Wallet.',
        ),
      );
    }
    const api = this.#connectedAPI;
    return (this.#initializedProviders ??= initializeProviders(this.logger, api));
  }

  private async deployDeployment(deployment: BehaviorSubject<CredShieldDeployment>): Promise<void> {
    try {
      const providers = await this.getProviders();
      const api = await CredShieldAPI.deploy(providers, this.logger);

      deployment.next({
        status: 'deployed',
        api,
      });
    } catch (error: unknown) {
      console.error('CREDSHIELD DEPLOYMENT ERROR:', error);
      deployment.next({
        status: 'failed',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  private async joinDeployment(
    deployment: BehaviorSubject<CredShieldDeployment>,
    contractAddress: ContractAddress,
  ): Promise<void> {
    try {
      const providers = await this.getProviders();
      const api = await CredShieldAPI.join(providers, contractAddress, this.logger);

      deployment.next({
        status: 'deployed',
        api,
      });
    } catch (error: unknown) {
      console.error('CREDSHIELD DEPLOYMENT ERROR:', error);
      deployment.next({
        status: 'failed',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }
}

import { setNetworkId, type NetworkId } from '@midnight-ntwrk/midnight-js-network-id';

const initializeProviders = async (
  logger: Logger,
  connectedAPI: ConnectedAPI,
): Promise<CredShieldProviders> => {
  const zkConfigPath = window.location.origin;
  const keyMaterialProvider = new FetchZkConfigProvider<CredShieldCircuitKeys>(
    zkConfigPath,
    fetch.bind(window),
  );

  const [config, shieldedAddresses] = await Promise.all([
    connectedAPI.getConfiguration(),
    connectedAPI.getShieldedAddresses(),
  ]);

  logger.info({ config }, 'Wallet configuration retrieved');

  const targetNetworkId = (config.networkId || import.meta.env.VITE_NETWORK_ID || 'preprod') as NetworkId;
  setNetworkId(targetNetworkId);

  if (!config.proverServerUri) {
    throw new Error(
      'Prover server URI not configured in your wallet settings. Please configure prover server URI and reconnect.',
    );
  }

  const inMemoryStateProvider = inMemoryPrivateStateProvider<string, CredShieldPrivateState>();

  return {
    privateStateProvider: inMemoryStateProvider,
    zkConfigProvider: keyMaterialProvider,
    proofProvider: httpClientProofProvider(config.proverServerUri, keyMaterialProvider),
    publicDataProvider: indexerPublicDataProvider(config.indexerUri, config.indexerWsUri),
    walletProvider: {
      getCoinPublicKey(): string {
        return shieldedAddresses.shieldedCoinPublicKey;
      },
      getEncryptionPublicKey(): string {
        return shieldedAddresses.shieldedEncryptionPublicKey;
      },
      balanceTx: async (tx: UnboundTransaction, ttl?: Date): Promise<FinalizedTransaction> => {
        try {
          logger.info({ ttl }, 'Balancing transaction via connected wallet');
          const serializedTx = toHex(tx.serialize());
          const received = await connectedAPI.balanceUnsealedTransaction(serializedTx);
          return Transaction.deserialize<SignatureEnabled, Proof, Binding>(
            'signature',
            'proof',
            'binding',
            fromHex(received.tx),
          );
        } catch (e) {
          logger.error({ error: e }, 'Error balancing transaction via wallet');
          throw e;
        }
      },
    },
    midnightProvider: {
      submitTx: async (tx: FinalizedTransaction): Promise<TransactionId> => {
        await connectedAPI.submitTransaction(toHex(tx.serialize()));
        const txIdentifiers = tx.identifiers();
        const txId = txIdentifiers[0];
        logger.info({ txIdentifiers }, 'Submitted transaction via connected wallet');
        return txId;
      },
    },
  };
};
