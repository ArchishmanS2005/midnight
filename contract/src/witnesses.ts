import { type Ledger } from "./managed/credshield/contract/index.js";
import { type WitnessContext } from "@midnight-ntwrk/compact-runtime";

export type CredShieldPrivateState = {
  readonly secretKey: Uint8Array;
};

export const createCredShieldPrivateState = (secretKey: Uint8Array): CredShieldPrivateState => ({
  secretKey,
});

export const witnesses = {
  secretKey: ({
    privateState,
  }: WitnessContext<Ledger, CredShieldPrivateState>): [
    CredShieldPrivateState,
    Uint8Array,
  ] => [privateState, privateState.secretKey],
};
