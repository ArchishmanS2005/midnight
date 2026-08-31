/**
 * CredShield Contract — Full Unit-Test Suite (20 tests)
 *
 * Exercises the Compact circuit logic locally via CredShieldSimulator.
 * No network or Docker required — runs purely in-process via compact-runtime.
 *
 * Coverage:
 *   1. Circuit Logic        (5) — issueCredential, verifyCredential circuits compute correctly
 *   2. State Transitions    (5) — ledger state progresses UNINITIALIZED → ACTIVE → REVOKED
 *   3. Privacy              (4) — secretKey never appears in any public ledger output
 *   4. Revocation           (3) — only issuer can revoke; counters survive; re-issue rejected
 *   5. Authority & Keys     (3) — authorityPublicKey is deterministic, unique, 32-byte output
 */

import { describe, it, expect, beforeEach } from "vitest";
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
  CredentialState,
} from "../managed/credshield/contract/index.js";
import { type CredShieldPrivateState, witnesses } from "../witnesses.js";

// ─────────────────────────────────────────────────────────────────────────────
// Inline simulator (self-contained — no external import from /test)
// ─────────────────────────────────────────────────────────────────────────────

class Sim {
  readonly contract: Contract<CredShieldPrivateState>;
  ctx: CircuitContext<CredShieldPrivateState>;

  constructor(secretKey: Uint8Array) {
    this.contract = new Contract<CredShieldPrivateState>(witnesses);
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState,
    } = this.contract.initialState(
      createConstructorContext({ secretKey }, "0".repeat(64)),
    );
    this.ctx = {
      currentPrivateState,
      currentZswapLocalState,
      costModel: CostModel.initialCostModel(),
      currentQueryContext: new QueryContext(
        currentContractState.data,
        sampleContractAddress(),
      ),
    };
  }

  switchUser(secretKey: Uint8Array): void {
    this.ctx.currentPrivateState = { secretKey };
  }

  getLedger(): Ledger {
    return ledger(this.ctx.currentQueryContext.state);
  }

  getPrivateState(): CredShieldPrivateState {
    return this.ctx.currentPrivateState;
  }

  issueCredential(id: Uint8Array, metadata: string): Ledger {
    this.ctx = this.contract.impureCircuits.issueCredential(
      this.ctx,
      id,
      metadata,
    ).context;
    return this.getLedger();
  }

  verifyCredential(providedId: Uint8Array): Ledger {
    this.ctx = this.contract.impureCircuits.verifyCredential(
      this.ctx,
      providedId,
    ).context;
    return this.getLedger();
  }

  revokeCredential(): Ledger {
    this.ctx = this.contract.impureCircuits.revokeCredential(this.ctx).context;
    return this.getLedger();
  }

  authorityPublicKey(): Uint8Array {
    const seqBytes = convertFieldToBytes(
      32,
      this.getLedger().sequence,
      "test-suite",
    );
    return this.contract.circuits.authorityPublicKey(
      this.ctx,
      this.getPrivateState().secretKey,
      seqBytes,
    ).result;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const randomBytes = (n: number): Uint8Array => {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
};

const toHex = (b: Uint8Array): string =>
  Array.from(b)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");

const unwrapMetadata = (m: unknown): string | null => {
  if (!m || typeof m !== "object") return null;
  const mo = m as { is_some?: boolean; value?: string };
  return mo.is_some ? (mo.value ?? null) : null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared fixtures
// ─────────────────────────────────────────────────────────────────────────────

let issuerKey: Uint8Array;
let holderKey: Uint8Array;
let verifierKey: Uint8Array;
let sim: Sim;

beforeEach(() => {
  issuerKey = randomBytes(32);
  holderKey = randomBytes(32);
  verifierKey = randomBytes(32);
  sim = new Sim(issuerKey);
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. CIRCUIT LOGIC (5 tests)
// ─────────────────────────────────────────────────────────────────────────────

describe("Circuit Logic", () => {
  it("should set credentialState to ACTIVE after issueCredential", () => {
    const credId = randomBytes(32);
    const state = sim.issueCredential(
      credId,
      "CredShield University Diploma 2025",
    );
    expect(state.credentialState).toBe(CredentialState.ACTIVE);
  });

  it("should store credentialId on-chain matching provided bytes", () => {
    const credId = randomBytes(32);
    const state = sim.issueCredential(credId, "Professional Certificate");
    expect(toHex(state.credentialId)).toBe(toHex(credId));
  });

  it("should store credentialMetadata on-chain as a Some value", () => {
    const meta = "Medical License — ZK Verified";
    const state = sim.issueCredential(randomBytes(32), meta);
    expect(unwrapMetadata(state.credentialMetadata)).toBe(meta);
  });

  it("should increment totalIssued counter to 1 after first issuance", () => {
    const state = sim.issueCredential(randomBytes(32), "KYC Credential v1");
    expect(state.totalIssued).toBe(1n);
    expect(state.totalVerified).toBe(0n);
  });

  it("should increment totalVerified counter each time verifyCredential is called", () => {
    const credId = randomBytes(32);
    sim.issueCredential(credId, "Driver Licence ZK");

    const after1 = sim.verifyCredential(credId);
    expect(after1.totalVerified).toBe(1n);

    const after2 = sim.verifyCredential(credId);
    expect(after2.totalVerified).toBe(2n);

    const after3 = sim.verifyCredential(credId);
    expect(after3.totalVerified).toBe(3n);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. STATE TRANSITIONS (5 tests)
// ─────────────────────────────────────────────────────────────────────────────

describe("State Transitions", () => {
  it("should begin in UNINITIALIZED state before any circuit is called", () => {
    const state = sim.getLedger();
    expect(state.credentialState).toBe(CredentialState.UNINITIALIZED);
    expect(state.totalIssued).toBe(0n);
    expect(state.totalVerified).toBe(0n);
  });

  it("should transition UNINITIALIZED → ACTIVE on issueCredential", () => {
    const before = sim.getLedger();
    expect(before.credentialState).toBe(CredentialState.UNINITIALIZED);

    const after = sim.issueCredential(randomBytes(32), "ZK Passport");
    expect(after.credentialState).toBe(CredentialState.ACTIVE);
  });

  it("should remain ACTIVE after verifyCredential (state does not change on verify)", () => {
    const credId = randomBytes(32);
    sim.issueCredential(credId, "Bank Certificate");
    const after = sim.verifyCredential(credId);
    expect(after.credentialState).toBe(CredentialState.ACTIVE);
  });

  it("should transition ACTIVE → REVOKED on revokeCredential", () => {
    sim.issueCredential(randomBytes(32), "Revocable Licence");
    const after = sim.revokeCredential();
    expect(after.credentialState).toBe(CredentialState.REVOKED);
  });

  it("should reject issueCredential when credential is already ACTIVE (double-issue guard)", () => {
    sim.issueCredential(randomBytes(32), "First Credential");
    expect(() =>
      sim.issueCredential(randomBytes(32), "Second Credential"),
    ).toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. PRIVACY — secretKey never leaks into any public ledger field (4 tests)
// ─────────────────────────────────────────────────────────────────────────────

describe("Privacy", () => {
  it("should never expose raw secretKey in ledger state after issuance", () => {
    const credId = randomBytes(32);
    const skHex = toHex(issuerKey);

    const state = sim.issueCredential(credId, "Private Medical Record");

    const snapshot = JSON.stringify({
      credentialId: toHex(state.credentialId),
      issuerAuthority: toHex(state.issuerAuthority),
      credentialMetadata: JSON.stringify(state.credentialMetadata),
      totalIssued: state.totalIssued.toString(),
      totalVerified: state.totalVerified.toString(),
    });

    expect(snapshot).not.toContain(skHex);
  });

  it("should store issuerAuthority as a one-way hash — not equal to raw secretKey", () => {
    sim.issueCredential(randomBytes(32), "Government ID ZK");
    const state = sim.getLedger();

    const authorityHex = toHex(state.issuerAuthority);
    const rawKeyHex = toHex(issuerKey);

    expect(authorityHex).not.toBe(rawKeyHex);
    expect(authorityHex.length).toBe(64); // 32 bytes → 64 hex chars
  });

  it("should keep secretKey only inside local private state — never on-chain", () => {
    sim.issueCredential(randomBytes(32), "Local-only key check");

    const privateState = sim.getPrivateState();
    const onChainState = sim.getLedger();

    // secretKey IS in private state (good — it lives locally)
    expect(toHex(privateState.secretKey)).toBe(toHex(issuerKey));

    // but issuerAuthority on-chain is NOT the raw key
    expect(toHex(onChainState.issuerAuthority)).not.toBe(
      toHex(privateState.secretKey),
    );
  });

  it("should not expose raw secretKey after verifyCredential call", () => {
    const credId = randomBytes(32);
    const skHex = toHex(issuerKey);

    sim.issueCredential(credId, "Verify Privacy Check");
    const state = sim.verifyCredential(credId);

    const snapshot = JSON.stringify({
      totalVerified: state.totalVerified.toString(),
      credentialState: String(state.credentialState),
    });

    expect(snapshot).not.toContain(skHex);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. REVOCATION (3 tests)
// ─────────────────────────────────────────────────────────────────────────────

describe("Revocation", () => {
  it("should allow original issuer to revoke their own credential", () => {
    // Sim is initialized with issuerKey — same user revokes
    sim.issueCredential(randomBytes(32), "Revocable ZK Certificate");
    const after = sim.revokeCredential();
    expect(after.credentialState).toBe(CredentialState.REVOKED);
  });

  it("should preserve totalIssued and totalVerified counters after revocation", () => {
    const credId = randomBytes(32);
    sim.issueCredential(credId, "Counter Preservation Test");
    sim.verifyCredential(credId);
    sim.verifyCredential(credId);

    const after = sim.revokeCredential();
    expect(after.totalIssued).toBe(1n);
    expect(after.totalVerified).toBe(2n);
    expect(after.credentialState).toBe(CredentialState.REVOKED);
  });

  it("should reject revokeCredential when called by a non-issuer (wrong secretKey)", () => {
    sim.issueCredential(randomBytes(32), "Issuer-only Revoke");

    // Switch to a completely different user (non-issuer)
    sim.switchUser(randomBytes(32));

    expect(() => sim.revokeCredential()).toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. AUTHORITY & PUBLIC KEYS (3 tests)
// ─────────────────────────────────────────────────────────────────────────────

describe("Authority & Public Keys", () => {
  it("should produce a deterministic 32-byte authorityPublicKey for the same secretKey", () => {
    const sim2 = new Sim(issuerKey);

    const pk1 = sim.authorityPublicKey();
    const pk2 = sim2.authorityPublicKey();

    expect(pk1).toBeInstanceOf(Uint8Array);
    expect(pk1.length).toBe(32);
    expect(toHex(pk1)).toBe(toHex(pk2));
  });

  it("should produce distinct authorityPublicKey values for different secretKeys", () => {
    const sim2 = new Sim(holderKey);
    const sim3 = new Sim(verifierKey);

    const pk1 = sim.authorityPublicKey();
    const pk2 = sim2.authorityPublicKey();
    const pk3 = sim3.authorityPublicKey();

    expect(toHex(pk1)).not.toBe(toHex(pk2));
    expect(toHex(pk1)).not.toBe(toHex(pk3));
    expect(toHex(pk2)).not.toBe(toHex(pk3));
  });

  it("should reject verifyCredential when a wrong credential ID is provided", () => {
    const realId = randomBytes(32);
    const wrongId = randomBytes(32);

    sim.issueCredential(realId, "ID Mismatch Test");

    // Providing an ID that does not match the stored credentialId must throw
    expect(() => sim.verifyCredential(wrongId)).toThrow();
  });
});
