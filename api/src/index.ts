import { type ContractAddress, convertFieldToBytes } from '@midnight-ntwrk/compact-runtime';
import type { Logger } from 'pino';
import {
  type CredShieldProviders,
  type CredShieldDerivedState,
  type DeployedCredShieldContract,
  type CredShieldContract,
  credShieldPrivateStateKey,
} from './common-types.js';
import * as CredShield from '@midnight-ntwrk/credshield-contract';
import { CompiledCredShieldContract, CredShieldPrivateState, createCredShieldPrivateState } from '@midnight-ntwrk/credshield-contract';
import * as utils from './utils/index.js';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { combineLatest, map, tap, from, type Observable } from 'rxjs';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';

export interface DeployedCredShieldAPI {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<CredShieldDerivedState>;

  issueCredential: (id: Uint8Array, metadata: string) => Promise<void>;
  verifyCredential: (providedId: Uint8Array) => Promise<void>;
  revokeCredential: () => Promise<void>;
}

export class CredShieldAPI implements DeployedCredShieldAPI {
  private constructor(
    public readonly deployedContract: DeployedCredShieldContract,
    providers: CredShieldProviders,
    private readonly logger?: Logger,
  ) {
    this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;
    providers.privateStateProvider.setContractAddress(this.deployedContractAddress);
    this.state$ = combineLatest(
      [
        providers.publicDataProvider.contractStateObservable(this.deployedContractAddress, { type: 'latest' }).pipe(
          map((contractState) => CredShield.ledger(contractState.data)),
          tap((ledgerState) =>
            logger?.trace({
              ledgerStateChanged: {
                ledgerState: {
                  ...ledgerState,
                  issuerAuthority: toHex(ledgerState.issuerAuthority),
                  credentialId: toHex(ledgerState.credentialId),
                },
              },
            }),
          ),
        ),
        from(providers.privateStateProvider.get(credShieldPrivateStateKey) as Promise<CredShieldPrivateState>),
      ],
      (ledgerState, privateState) => {
        const hashedSecretKey = CredShield.pureCircuits.authorityPublicKey(
          privateState.secretKey,
          convertFieldToBytes(32, ledgerState.sequence, 'api/src/index.ts'),
        );

        return {
          credentialState: ledgerState.credentialState,
          credentialId: toHex(ledgerState.credentialId),
          credentialMetadata: ledgerState.credentialMetadata.is_some ? ledgerState.credentialMetadata.value : undefined,
          issuerAuthority: toHex(ledgerState.issuerAuthority),
          totalIssued: ledgerState.totalIssued,
          totalVerified: ledgerState.totalVerified,
          sequence: ledgerState.sequence,
          isIssuer: toHex(ledgerState.issuerAuthority) === toHex(hashedSecretKey),
        };
      },
    );
  }

  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<CredShieldDerivedState>;

  async issueCredential(id: Uint8Array, metadata: string): Promise<void> {
    this.logger?.info(`issueCredential: metadata=${metadata}`);

    const txData = await this.deployedContract.callTx.issueCredential(id, metadata);

    this.logger?.trace({
      transactionAdded: {
        circuit: 'issueCredential',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  async verifyCredential(providedId: Uint8Array): Promise<void> {
    this.logger?.info('verifyCredential');

    const txData = await this.deployedContract.callTx.verifyCredential(providedId);

    this.logger?.trace({
      transactionAdded: {
        circuit: 'verifyCredential',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  async revokeCredential(): Promise<void> {
    this.logger?.info('revokeCredential');

    const txData = await this.deployedContract.callTx.revokeCredential();

    this.logger?.trace({
      transactionAdded: {
        circuit: 'revokeCredential',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  static async deploy(providers: CredShieldProviders, logger?: Logger): Promise<CredShieldAPI> {
    logger?.info('deployCredShieldContract');

    const deployedContract = await deployContract(providers, {
      compiledContract: CompiledCredShieldContract,
      privateStateId: credShieldPrivateStateKey,
      initialPrivateState: createCredShieldPrivateState(utils.randomBytes(32)),
      args: [],
    });

    logger?.trace({
      contractDeployed: {
        finalizedDeployTxData: deployedContract.deployTxData.public,
      },
    });

    return new CredShieldAPI(deployedContract, providers, logger);
  }

  static async join(providers: CredShieldProviders, contractAddress: ContractAddress, logger?: Logger): Promise<CredShieldAPI> {
    logger?.info({
      joinContract: {
        contractAddress,
      },
    });

    const deployedContract = await findDeployedContract<CredShieldContract>(providers, {
      contractAddress,
      compiledContract: CompiledCredShieldContract,
      privateStateId: credShieldPrivateStateKey,
      initialPrivateState: await CredShieldAPI.getPrivateState(providers, contractAddress),
    });

    logger?.trace({
      contractJoined: {
        finalizedDeployTxData: deployedContract.deployTxData.public,
      },
    });

    return new CredShieldAPI(deployedContract, providers, logger);
  }

  private static async getPrivateState(
    providers: CredShieldProviders,
    contractAddress: ContractAddress,
  ): Promise<CredShieldPrivateState> {
    providers.privateStateProvider.setContractAddress(contractAddress);
    const existingPrivateState = await providers.privateStateProvider.get(credShieldPrivateStateKey);
    return existingPrivateState ?? createCredShieldPrivateState(utils.randomBytes(32));
  }
}

export { randomBytes } from './utils/index.js';
export * as utils from './utils/index.js';
export * from './common-types.js';
