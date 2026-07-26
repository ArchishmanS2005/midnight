import {
  type CircuitContext,
  QueryContext,
  sampleContractAddress,
  convertFieldToBytes,
  createConstructorContext,
  CostModel,
} from "@midnight-ntwrk/compact-runtime";
import {
  Contract,
  type Ledger,
  ledger,
} from "../managed/credshield/contract/index.js";
import { type CredShieldPrivateState, witnesses } from "../witnesses.js";

export class CredShieldSimulator {
  readonly contract: Contract<CredShieldPrivateState>;
  circuitContext: CircuitContext<CredShieldPrivateState>;

  constructor(secretKey: Uint8Array) {
    this.contract = new Contract<CredShieldPrivateState>(witnesses);
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState,
    } = this.contract.initialState(
      createConstructorContext({ secretKey }, "0".repeat(64)),
    );
    this.circuitContext = {
      currentPrivateState,
      currentZswapLocalState,
      costModel: CostModel.initialCostModel(),
      currentQueryContext: new QueryContext(
        currentContractState.data,
        sampleContractAddress(),
      ),
    };
  }

  public switchUser(secretKey: Uint8Array) {
    this.circuitContext.currentPrivateState = {
      secretKey,
    };
  }

  public getLedger(): Ledger {
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  public getPrivateState(): CredShieldPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  public issueCredential(id: Uint8Array, metadata: string): Ledger {
    this.circuitContext = this.contract.impureCircuits.issueCredential(
      this.circuitContext,
      id,
      metadata,
    ).context;
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  public verifyCredential(providedId: Uint8Array): Ledger {
    this.circuitContext = this.contract.impureCircuits.verifyCredential(
      this.circuitContext,
      providedId,
    ).context;
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  public revokeCredential(): Ledger {
    this.circuitContext = this.contract.impureCircuits.revokeCredential(
      this.circuitContext,
    ).context;
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  public authorityPublicKey(): Uint8Array {
    const sequence = convertFieldToBytes(
      32,
      this.getLedger().sequence,
      "credshield-simulator.ts",
    );
    return this.contract.circuits.authorityPublicKey(
      this.circuitContext,
      this.getPrivateState().secretKey,
      sequence,
    ).result;
  }
}
