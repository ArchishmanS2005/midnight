# CredShield — Product Proposal

**Category**: Confidential Credentials — *Prove a credential is valid without disclosing it*
**Challenge**: Midnight Rise In — Level 3 Builder Challenge
**Author**: ArchishmanS2005 (`archishmansarkar94@gmail.com`)

---

## What is the product, and who uses it?

**CredShield** is a privacy-preserving verifiable credential platform built on the Midnight Blockchain. It allows certified institutions (universities, employers, governments, licensing bodies) to issue tamper-proof credentials on-chain, and allows credential holders to prove those credentials are valid — **without revealing their identity, secret key, or raw credential data** to the verifier.

### Target Users

| Role | Who | What they do |
|---|---|---|
| **Issuer** | University, employer, certifying body | Calls `issueCredential()` to anchor a credential on-chain |
| **Holder** | Graduate, employee, licensed professional | Calls `verifyCredential()` to prove their credential is valid |
| **Verifier** | Background check service, employer, regulator | Observes on-chain proof validity without seeing private data |

### Real-World Use Cases

- **Academic degrees** — prove you hold a degree without sharing your student record
- **Professional licences** — prove a licence is active without disclosing the licence number
- **KYC credentials** — prove you've passed KYC without sending identity data to every service
- **Medical certifications** — prove a doctor's licence is valid without exposing patient data
- **Employment verification** — prove employment status without exposing salary or personal details

---

## Why Midnight specifically?

Traditional blockchains make this impossible to solve cleanly:

| Problem | Transparent Chain | Midnight (CredShield) |
|---|---|---|
| Secret key exposure | Stored on-chain or in plaintext API calls | 🔒 Never leaves WitnessContext — proved via ZK |
| Verifier learns identity | Full payload sent to verifier | 🔒 Only aggregate counter increments on-chain |
| Correlation of verifications | Every verification linked to user address | 🔒 Unlinkable — no address connection |
| Revocation tracking | Revocation reveals issuer/holder | 🔒 Issuer proved via one-way hash commitment |

Midnight's **Compact ZK circuits** allow the credential holder to generate a proof locally (in-browser or CLI) that:
1. They know the `secretKey` that was used to issue the credential
2. The credential is currently `ACTIVE` on-chain
3. The provided credential ID matches the on-chain record

All of this is proved **without transmitting or disclosing the secret key**. This is fundamentally impossible on a transparent blockchain like Ethereum or Cardano without a trusted intermediary.

---

## Data Model

### Public Ledger (Observable by anyone)

| Field | Type | What it reveals |
|---|---|---|
| `credentialState` | `UNINITIALIZED / ACTIVE / REVOKED` | Whether the credential exists and is valid |
| `credentialId` | `Bytes<32>` | The credential identifier (set by issuer) |
| `issuerAuthority` | `Bytes<32>` | One-way hash of `(secretKey, sequence)` — NOT the raw key |
| `credentialMetadata` | `Maybe<Opaque<"string">>` | Optional metadata string |
| `totalIssued` | `Counter` | How many credentials have been issued (max 1 per contract) |
| `totalVerified` | `Counter` | How many times the credential has been verified |
| `sequence` | `Counter` | Increments on revocation — prevents key reuse attacks |

### Private Witness (Local only — never on-chain)

| Field | Type | Who sees it |
|---|---|---|
| `secretKey` | `Bytes<32>` | **Only the credential holder** — stays in WitnessContext |
| ZK witness inputs | — | Generated and consumed locally during proof |
| Off-chain proof randomness | — | Discarded after proof generation |

### Privacy Invariants

- `issuerAuthority = persistentHash([pad(32,"credshield:pk:"), sequence, secretKey])` — a one-way function. Knowing `issuerAuthority` does **not** allow recovery of `secretKey`.
- `totalVerified` increments do not reveal *who* called `verifyCredential` — only that *someone* did.
- After revocation, `sequence` increments — so a new credential issued with the same `secretKey` produces a **different** `issuerAuthority`, preventing cross-credential correlation.

---

## Privacy Claim Summary

**What an on-chain observer sees:**
- The credential exists and is `ACTIVE` (or `REVOKED`)
- An issuer authority commitment (hash — not the key)
- `totalVerified` increments when someone verifies
- The credential was revoked (state changes to `REVOKED`)

**What an on-chain observer CANNOT see:**
- The issuer's or holder's secret key
- The real identity of who issued or verified the credential
- Which specific user called `verifyCredential` at any point
- Any connection between a holder's activity across different credentials

---

## Mainnet Feasibility

CredShield is realistic for Mainnet by Level 6 for the following reasons:

### Technical Readiness
- ✅ Contract compiles and runs on Compact v0.23 (current stable)
- ✅ All three circuits tested locally via compact-runtime (no network required)
- ✅ Deployed on Preprod with full DApp Connector API v4 integration
- ✅ Proof server integration working (Docker standalone + remote Preprod)

### Remaining Work for Mainnet
1. **Multi-credential support** — extend ledger to support a `Map<credentialId, CredentialRecord>` allowing one contract to manage multiple credentials
2. **Revocation registry** — on-chain revocation list accessible to verifiers without holder involvement
3. **Issuer registry** — allowlist of certified issuer authority public keys
4. **DUST economics** — define fee model for credential issuance and verification
5. **Key rotation** — support `sequence`-based key rotation without credential invalidation

### Business Case
The global digital identity market is projected to reach $70B+ by 2030. Privacy-preserving credentials are a regulatory requirement in jurisdictions implementing GDPR Article 25 (privacy by design). CredShield's approach — ZK-proved credentials without identity disclosure — directly addresses this gap and is only feasible on a hybrid-ledger blockchain like Midnight.

---

## Competitive Differentiation

| Feature | CredShield (Midnight) | Ethereum (ERC-725) | Cardano AID |
|---|---|---|---|
| Secret key privacy | ✅ ZK-proved, never on-chain | ❌ Exposed in tx or API | ❌ Relies on off-chain |
| Verifier learns identity | ❌ Never | ✅ Always | Depends |
| Decentralized revocation | ✅ On-chain, issuer-only | Partial | Partial |
| Local proof generation | ✅ In-browser/CLI | ❌ | ❌ |
| Trusted intermediary needed | ❌ None | Often | Often |
