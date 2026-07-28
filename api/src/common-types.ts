import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { type FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { CredentialState, CredShieldPrivateState, Contract, Witnesses } from '@midnight-ntwrk/credshield-contract';

export const credShieldPrivateStateKey = 'credShieldPrivateState';
export type PrivateStateId = typeof credShieldPrivateStateKey;

export type PrivateStates = {
  readonly credShieldPrivateState: CredShieldPrivateState;
};

export type CredShieldContract = Contract<CredShieldPrivateState, Witnesses<CredShieldPrivateState>>;

export type CredShieldCircuitKeys = Exclude<keyof CredShieldContract['impureCircuits'], number | symbol>;

export type CredShieldProviders = MidnightProviders<CredShieldCircuitKeys, PrivateStateId, CredShieldPrivateState>;

export type DeployedCredShieldContract = FoundContract<CredShieldContract>;

export type CredShieldDerivedState = {
  readonly credentialState: CredentialState;
  readonly credentialId: string;
  readonly credentialMetadata: string | undefined;
  readonly issuerAuthority: string;
  readonly totalIssued: bigint;
  readonly totalVerified: bigint;
  readonly sequence: bigint;
  readonly isIssuer: boolean;
};
