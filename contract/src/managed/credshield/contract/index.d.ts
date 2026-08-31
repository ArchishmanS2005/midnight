import type * as __compactRuntime from "@midnight-ntwrk/compact-runtime";

export enum CredentialState {
  UNINITIALIZED = 0,
  ACTIVE = 1,
  REVOKED = 2,
}

export type Witnesses<PS> = {
  secretKey(
    context: __compactRuntime.WitnessContext<Ledger, PS>,
  ): [PS, Uint8Array];
};

export type ImpureCircuits<PS> = {
  issueCredential(
    context: __compactRuntime.CircuitContext<PS>,
    id_0: Uint8Array,
    metadata_0: string,
  ): __compactRuntime.CircuitResults<PS, []>;
  verifyCredential(
    context: __compactRuntime.CircuitContext<PS>,
    providedId_0: Uint8Array,
  ): __compactRuntime.CircuitResults<PS, []>;
  revokeCredential(
    context: __compactRuntime.CircuitContext<PS>,
  ): __compactRuntime.CircuitResults<PS, []>;
};

export type ProvableCircuits<PS> = {
  issueCredential(
    context: __compactRuntime.CircuitContext<PS>,
    id_0: Uint8Array,
    metadata_0: string,
  ): __compactRuntime.CircuitResults<PS, []>;
  verifyCredential(
    context: __compactRuntime.CircuitContext<PS>,
    providedId_0: Uint8Array,
  ): __compactRuntime.CircuitResults<PS, []>;
  revokeCredential(
    context: __compactRuntime.CircuitContext<PS>,
  ): __compactRuntime.CircuitResults<PS, []>;
};

export type PureCircuits = {
  authorityPublicKey(sk_0: Uint8Array, sequence_0: Uint8Array): Uint8Array;
};

export type Circuits<PS> = {
  issueCredential(
    context: __compactRuntime.CircuitContext<PS>,
    id_0: Uint8Array,
    metadata_0: string,
  ): __compactRuntime.CircuitResults<PS, []>;
  verifyCredential(
    context: __compactRuntime.CircuitContext<PS>,
    providedId_0: Uint8Array,
  ): __compactRuntime.CircuitResults<PS, []>;
  revokeCredential(
    context: __compactRuntime.CircuitContext<PS>,
  ): __compactRuntime.CircuitResults<PS, []>;
  authorityPublicKey(
    context: __compactRuntime.CircuitContext<PS>,
    sk_0: Uint8Array,
    sequence_0: Uint8Array,
  ): __compactRuntime.CircuitResults<PS, Uint8Array>;
};

export type Ledger = {
  readonly credentialState: CredentialState;
  readonly credentialId: Uint8Array;
  readonly credentialMetadata: { is_some: boolean; value: string };
  readonly issuerAuthority: Uint8Array;
  readonly totalIssued: bigint;
  readonly totalVerified: bigint;
  readonly sequence: bigint;
};

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations: ContractReferenceLocations;

export declare class Contract<
  PS = any,
  W extends Witnesses<PS> = Witnesses<PS>,
> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(
    context: __compactRuntime.ConstructorContext<PS>,
  ): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(
  state: __compactRuntime.StateValue | __compactRuntime.ChargedState,
): Ledger;
export declare const pureCircuits: PureCircuits;
