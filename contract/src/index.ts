import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";

export * from "./managed/credshield/contract/index.js";
export * from "./witnesses.js";

import * as CompiledCredShieldContractModule from "./managed/credshield/contract/index.js";
import * as Witnesses from "./witnesses.js";

export const CompiledCredShieldContract = CompiledContract.make<
  CompiledCredShieldContractModule.Contract<Witnesses.CredShieldPrivateState>
>(
  "CredShield",
  CompiledCredShieldContractModule.Contract<Witnesses.CredShieldPrivateState>,
).pipe(
  CompiledContract.withWitnesses(Witnesses.witnesses),
  CompiledContract.withCompiledFileAssets("./managed/credshield"),
);
