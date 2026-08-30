import { describe, it, expect, beforeEach } from 'vitest';
import { CredShieldSimulator } from './credshield-simulator.js';
import { CredentialState } from '../managed/credshield/contract/index.js';
import { randomBytes } from './utils.js';

// ─────────────────────────────────────────────────────────────
// Test helpers
// ─────────────────────────────────────────────────────────────
const toHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

// ─────────────────────────────────────────────────────────────
// Test Suite
// ─────────────────────────────────────────────────────────────
describe('CredShield ZK Circuit Tests', () => {
  let secretKey: Uint8Array;
  let sim: CredShieldSimulator;

  beforeEach(() => {
    secretKey = randomBytes(32);
    sim = new CredShieldSimulator(secretKey);
  });

  // ──────────────────────────────────────────
  // Test 1: Circuit Logic — issueCredential
  // ──────────────────────────────────────────
  it('issueCredential: circuit computes correct ledger state', () => {
    const credId = randomBytes(32);
    const metadata = 'CredShield University Diploma 2025';

    const ledger = sim.issueCredential(credId, metadata);

    // State must be ACTIVE after issuance
    expect(ledger.credentialState).toBe(CredentialState.ACTIVE);
    // totalIssued counter must increment to 1
    expect(ledger.totalIssued).toBe(1n);
    // totalVerified stays 0 (not verified yet)
    expect(ledger.totalVerified).toBe(0n);
    // credentialId on ledger must match the provided id
    expect(toHex(ledger.credentialId)).toBe(toHex(credId));
    // metadata stored on ledger
    expect(ledger.credentialMetadata).toBe(metadata);
    // issuerAuthority must be set (non-zero)
    expect(ledger.issuerAuthority).toBeTruthy();
    expect(ledger.issuerAuthority.length).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────
  // Test 2: State Transitions — full lifecycle
  // ──────────────────────────────────────────
  it('state transitions: UNINITIALIZED → ACTIVE → VERIFIED → REVOKED', () => {
    const credId = randomBytes(32);
    const metadata = 'CredShield Professional Certificate';

    // Initial state must be UNINITIALIZED
    const initialLedger = sim.getLedger();
    expect(initialLedger.credentialState).toBe(CredentialState.UNINITIALIZED);
    expect(initialLedger.totalIssued).toBe(0n);
    expect(initialLedger.totalVerified).toBe(0n);

    // Issue → ACTIVE
    const afterIssue = sim.issueCredential(credId, metadata);
    expect(afterIssue.credentialState).toBe(CredentialState.ACTIVE);
    expect(afterIssue.totalIssued).toBe(1n);

    // Verify → counter increments, state stays ACTIVE
    const afterVerify = sim.verifyCredential(credId);
    expect(afterVerify.credentialState).toBe(CredentialState.ACTIVE);
    expect(afterVerify.totalVerified).toBe(1n);

    // Verify again → counter increments again
    const afterVerify2 = sim.verifyCredential(credId);
    expect(afterVerify2.totalVerified).toBe(2n);

    // Revoke → REVOKED
    const afterRevoke = sim.revokeCredential();
    expect(afterRevoke.credentialState).toBe(CredentialState.REVOKED);
    // Counters preserved after revocation
    expect(afterRevoke.totalIssued).toBe(1n);
    expect(afterRevoke.totalVerified).toBe(2n);
  });

  // ──────────────────────────────────────────
  // Test 3: Privacy — secretKey never in ledger
  // ──────────────────────────────────────────
  it('privacy: secretKey is never exposed in any ledger output', () => {
    const credId = randomBytes(32);
    const metadata = 'Private Medical Record Certificate';

    const secretKeyHex = toHex(secretKey);

    // Issue credential
    const afterIssue = sim.issueCredential(credId, metadata);

    // Serialize all ledger fields to check no secretKey leakage
    const ledgerJson = JSON.stringify({
      credentialState: afterIssue.credentialState,
      credentialId: toHex(afterIssue.credentialId),
      credentialMetadata: afterIssue.credentialMetadata,
      issuerAuthority: toHex(afterIssue.issuerAuthority),
      totalIssued: afterIssue.totalIssued.toString(),
      totalVerified: afterIssue.totalVerified.toString(),
    });

    // The raw secretKey bytes must NEVER appear in ledger output
    expect(ledgerJson).not.toContain(secretKeyHex);

    // The issuerAuthority IS derived from secretKey but is a one-way hash —
    // verify it is NOT the same as the raw secretKey
    const issuerAuthorityHex = toHex(afterIssue.issuerAuthority);
    expect(issuerAuthorityHex).not.toBe(secretKeyHex);

    // Verify also must not expose secretKey
    const afterVerify = sim.verifyCredential(credId);
    const ledgerJsonAfterVerify = JSON.stringify({
      credentialState: afterVerify.credentialState,
      totalVerified: afterVerify.totalVerified.toString(),
    });
    expect(ledgerJsonAfterVerify).not.toContain(secretKeyHex);

    // Private state holds secretKey locally but it must not leak to ledger
    const privateState = sim.getPrivateState();
    expect(toHex(privateState.secretKey)).toBe(secretKeyHex); // correct: in local private state
    // But issuerAuthority on-chain is a hash — not equal to raw key
    expect(issuerAuthorityHex).not.toBe(toHex(privateState.secretKey));
  });

  // ──────────────────────────────────────────
  // Test 4: Negative — wrong ID rejected
  // ──────────────────────────────────────────
  it('verifyCredential: rejects credential ID mismatch', () => {
    const credId = randomBytes(32);
    const wrongId = randomBytes(32);
    const metadata = 'CredShield Test Certificate';

    sim.issueCredential(credId, metadata);

    // Attempting to verify with wrong ID must throw an assertion error
    expect(() => sim.verifyCredential(wrongId)).toThrow();
  });

  // ──────────────────────────────────────────
  // Test 5: Authority — authorityPublicKey is deterministic
  // ──────────────────────────────────────────
  it('authorityPublicKey: is deterministic for same secretKey', () => {
    const sim2 = new CredShieldSimulator(secretKey);

    const pk1 = sim.authorityPublicKey();
    const pk2 = sim2.authorityPublicKey();

    // Same secretKey → same authority public key (deterministic ZK hash)
    expect(toHex(pk1)).toBe(toHex(pk2));

    // Different secretKey → different authority public key
    const differentKey = randomBytes(32);
    const sim3 = new CredShieldSimulator(differentKey);
    const pk3 = sim3.authorityPublicKey();
    expect(toHex(pk1)).not.toBe(toHex(pk3));
  });
});
