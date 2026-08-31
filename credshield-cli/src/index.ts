import { createInterface, type Interface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { type Config, StandaloneConfig } from './config.js';
import { type Logger } from 'pino';
import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { type TestEnvironment } from '@midnight-ntwrk/testkit-js';
import {
  CredShieldAPI,
  type CredShieldDerivedState,
  type CredShieldProviders,
  credShieldPrivateStateKey,
} from '@midnight-ntwrk/credshield-api';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { type WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import { MidnightWalletProvider } from './midnight-wallet-provider.js';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';
import { randomBytes } from '@midnight-ntwrk/credshield-api';
import { CredentialState, ledger, type CredShieldPrivateState } from '@midnight-ntwrk/credshield-contract';
import { unshieldedToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { syncWallet, waitForUnshieldedFunds } from './wallet-utils.js';
import { generateDust } from './generate-dust.js';

const DEPLOY_OR_JOIN_QUESTION = `
You can do one of the following:
  1. Deploy a new CredShield Verifiable Credential Contract
  2. Join an existing CredShield Contract
  3. Exit
Which would you like to do? `;

const deployOrJoin = async (
  providers: CredShieldProviders,
  rli: Interface,
  logger: Logger,
): Promise<CredShieldAPI | null> => {
  while (true) {
    const choice = await rli.question(DEPLOY_OR_JOIN_QUESTION);
    switch (choice) {
      case '1':
        return await CredShieldAPI.deploy(providers, logger);
      case '2': {
        const contractAddress = await rli.question(`Enter the 32-byte CredShield contract address: `);
        return await CredShieldAPI.join(providers, contractAddress.trim(), logger);
      }
      case '3':
        return null;
      default:
        logger.error(`Invalid choice: ${choice}`);
    }
  }
};

const displayLedgerState = async (providers: CredShieldProviders, contractAddress: ContractAddress, logger: Logger) => {
  const contractState = await providers.publicDataProvider.queryContractState(contractAddress);
  if (contractState === null) {
    logger.info(`Contract state not found`);
    return;
  }
  const currentLedger = ledger(contractState.data);
  const stateStr =
    currentLedger.credentialState === CredentialState.ACTIVE
      ? 'ACTIVE'
      : currentLedger.credentialState === CredentialState.REVOKED
        ? 'REVOKED'
        : 'UNINITIALIZED';

  logger.info(`Ledger Credential State: ${stateStr}`);
  logger.info(`Ledger Credential ID: ${toHex(currentLedger.credentialId)}`);
  logger.info(
    `Ledger Metadata: ${currentLedger.credentialMetadata.is_some ? currentLedger.credentialMetadata.value : 'none'}`,
  );
  logger.info(`Ledger Issuer Authority: ${toHex(currentLedger.issuerAuthority)}`);
  logger.info(`Ledger Total Issued: ${currentLedger.totalIssued}`);
  logger.info(`Ledger Total Verified: ${currentLedger.totalVerified}`);
  logger.info(`Ledger Sequence: ${currentLedger.sequence}`);
};

const displayPrivateState = async (providers: CredShieldProviders, logger: Logger) => {
  const privateState = await providers.privateStateProvider.get(credShieldPrivateStateKey);
  if (privateState === null) {
    logger.info(`No existing CredShield private state found`);
  } else {
    logger.info(`Current private secret key: ${toHex(privateState.secretKey)}`);
  }
};

const displayDerivedState = (derivedState: CredShieldDerivedState | undefined, logger: Logger) => {
  if (derivedState === undefined) {
    logger.info(`No derived state currently available`);
  } else {
    const stateStr =
      derivedState.credentialState === CredentialState.ACTIVE
        ? 'ACTIVE'
        : derivedState.credentialState === CredentialState.REVOKED
          ? 'REVOKED'
          : 'UNINITIALIZED';

    logger.info(`Credential Status: ${stateStr}`);
    logger.info(`Credential ID: ${derivedState.credentialId}`);
    logger.info(`Metadata: ${derivedState.credentialMetadata ?? 'none'}`);
    logger.info(`Issuer Authority: ${derivedState.issuerAuthority}`);
    logger.info(`Total Issued: ${derivedState.totalIssued}`);
    logger.info(`Total Verified: ${derivedState.totalVerified}`);
    logger.info(`Is Issuer: ${derivedState.isIssuer ? 'YES (You are authority)' : 'NO'}`);
  }
};

const MAIN_LOOP_QUESTION = `
CredShield Verifiable Credential Platform:
  1. Issue a Verifiable Credential
  2. Verify a Credential Privately (Generate ZK Proof)
  3. Revoke a Credential (Issuer Only)
  4. Display Ledger State (Public On-Chain)
  5. Display Private State (Local Client Only)
  6. Display Derived State (Private + Public)
  7. Exit
Which action would you like to perform? `;

const mainLoop = async (providers: CredShieldProviders, rli: Interface, logger: Logger): Promise<void> => {
  const credShieldApi = await deployOrJoin(providers, rli, logger);
  if (credShieldApi === null) {
    return;
  }
  let currentState: CredShieldDerivedState | undefined;
  const subscription = credShieldApi.state$.subscribe((state: CredShieldDerivedState) => (currentState = state));

  try {
    while (true) {
      const choice = await rli.question(MAIN_LOOP_QUESTION);
      try {
        switch (choice) {
          case '1': {
            const title = await rli.question(
              `Enter Credential Title / Metadata (e.g. "BSc Computer Science - Grade A"): `,
            );
            const rawId = randomBytes(32);
            logger.info(`Issuing credential with ID ${toHex(rawId)}...`);
            await credShieldApi.issueCredential(rawId, title);
            logger.info(`Credential successfully issued on Midnight!`);
            break;
          }
          case '2': {
            if (
              !currentState?.credentialId ||
              currentState.credentialId === '0000000000000000000000000000000000000000000000000000000000000000'
            ) {
              logger.error('No active credential found to verify.');
              break;
            }
            logger.info(`Generating off-chain ZK proof to verify credential ${currentState.credentialId}...`);
            const targetId = Uint8Array.from(Buffer.from(currentState.credentialId, 'hex'));
            await credShieldApi.verifyCredential(targetId);
            logger.info(`Credential verified off-chain via ZK Proof! Total verified counter updated.`);
            break;
          }
          case '3': {
            logger.info(`Revoking credential...`);
            await credShieldApi.revokeCredential();
            logger.info(`Credential revoked on-chain by issuer authority.`);
            break;
          }
          case '4':
            await displayLedgerState(providers, credShieldApi.deployedContractAddress, logger);
            break;
          case '5':
            await displayPrivateState(providers, logger);
            break;
          case '6':
            displayDerivedState(currentState, logger);
            break;
          case '7':
            logger.info('Exiting CredShield CLI...');
            return;
          default:
            logger.error(`Invalid choice: ${choice}`);
        }
      } catch (e) {
        logError(logger, e);
        logger.info('Returning to main menu...');
      }
    }
  } finally {
    subscription.unsubscribe();
  }
};

const GENESIS_MINT_WALLET_SEED = '0000000000000000000000000000000000000000000000000000000000000001';

const WALLET_LOOP_QUESTION = `
Wallet Configuration:
  1. Build a fresh wallet
  2. Build wallet from a seed
  3. Exit
Which would you like to do? `;

const buildWallet = async (config: Config, rli: Interface, logger: Logger): Promise<string | undefined> => {
  if (config instanceof StandaloneConfig) {
    return GENESIS_MINT_WALLET_SEED;
  }
  while (true) {
    const choice = await rli.question(WALLET_LOOP_QUESTION);
    switch (choice) {
      case '1':
        return toHex(randomBytes(32));
      case '2':
        return await rli.question('Enter your wallet seed: ');
      case '3':
        logger.info('Exiting...');
        return undefined;
      default:
        logger.error(`Invalid choice: ${choice}`);
    }
  }
};

export const run = async (config: Config, testEnv: TestEnvironment, logger: Logger): Promise<void> => {
  const rli = createInterface({ input, output, terminal: true });
  const providersToBeStopped: MidnightWalletProvider[] = [];
  try {
    const envConfiguration = await testEnv.start();
    logger.info(`Environment started with configuration: ${JSON.stringify(envConfiguration)}`);
    const seed = await buildWallet(config, rli, logger);
    if (seed === undefined) {
      return;
    }
    const walletProvider = await MidnightWalletProvider.build(logger, envConfiguration, seed);
    providersToBeStopped.push(walletProvider);
    const walletFacade: WalletFacade = walletProvider.wallet;

    await walletProvider.start();

    const unshieldedState = await waitForUnshieldedFunds(logger, walletFacade, envConfiguration, unshieldedToken());
    const nightBalance = unshieldedState.balances[unshieldedToken().raw];
    if (nightBalance === undefined) {
      logger.info('No funds received, exiting...');
      return;
    }
    logger.info(`Your NIGHT wallet balance is: ${nightBalance}`);

    if (config.generateDust) {
      const dustGeneration = await generateDust(logger, seed, unshieldedState, walletFacade);
      if (dustGeneration) {
        logger.info(`Submitted dust generation registration transaction: ${dustGeneration}`);
        await syncWallet(logger, walletFacade);
      }
    }

    const zkConfigProvider = new NodeZkConfigProvider<'issueCredential' | 'verifyCredential' | 'revokeCredential'>(
      config.zkConfigPath,
    );
    const providers: CredShieldProviders = {
      privateStateProvider: levelPrivateStateProvider<typeof credShieldPrivateStateKey, CredShieldPrivateState>({
        privateStateStoreName: config.privateStateStoreName,
        signingKeyStoreName: `${config.privateStateStoreName}-signing-keys`,
        privateStoragePasswordProvider: () => {
          return 'CredShield-Test-2026!';
        },
        accountId: seed,
      }),
      publicDataProvider: indexerPublicDataProvider(envConfiguration.indexer, envConfiguration.indexerWS),
      zkConfigProvider: zkConfigProvider,
      proofProvider: httpClientProofProvider(envConfiguration.proofServer, zkConfigProvider),
      walletProvider: walletProvider,
      midnightProvider: walletProvider,
    };
    await mainLoop(providers, rli, logger);
  } catch (e) {
    logError(logger, e);
    logger.info('Exiting...');
  } finally {
    try {
      rli.close();
      rli.removeAllListeners();
    } catch (e) {
      logError(logger, e);
    } finally {
      try {
        for (const wallet of providersToBeStopped) {
          logger.info('Stopping wallet...');
          await wallet.stop();
        }
        if (testEnv) {
          logger.info('Stopping test environment...');
          await testEnv.shutdown();
        }
      } catch (e) {
        logError(logger, e);
      }
    }
  }
};

function logError(logger: Logger, e: unknown) {
  if (e instanceof Error) {
    logger.error(`Found error '${e.message}'`);
    logger.debug(`${e.stack}`);
  } else {
    logger.error(`Found error (unknown type)`);
  }
}
