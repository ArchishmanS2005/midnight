// Quick deploy script for CredShield contract on Preprod
// Uses the midnight wallet CLI's funded wallet (already has DUST)

import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { nodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { randomBytes } from 'crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

setNetworkId('preprod');

const PROOF_SERVER = 'http://localhost:6300';
const INDEXER = 'https://indexer.preprod.midnight.network/api/v4/graphql';
const INDEXER_WS = 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws';
const ZK_CONFIG_PATH = path.resolve(__dirname, 'contract/src/managed/credshield');

console.log('Loading contract...');

// Import compiled contract
const contractModule = await import('./contract/dist/index.js');
const { CompiledCredShieldContract, createCredShieldPrivateState } = contractModule;

console.log('Contract loaded. Setting up providers...');
console.log('ZK Config Path:', ZK_CONFIG_PATH);
console.log('Proof Server:', PROOF_SERVER);
console.log('Indexer:', INDEXER);

// Use the midnight wallet CLI's serve connector
// The wallet serve should be running: midnight serve --network preprod --approve-all
import { createWalletClient } from 'midnight-wallet-connector';

console.log('Connecting to wallet connector at ws://localhost:9932...');
const wallet = await createWalletClient({ url: 'ws://localhost:9932', networkId: 'Preprod' });
console.log('Wallet connected!');

const balances = await wallet.getUnshieldedBalances();
console.log('Wallet balances:', balances);
