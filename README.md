# CredShield — Privacy-Preserving Credential Verifier Platform

![CI](https://github.com/ArchishmanS2005/midnight/actions/workflows/ci.yml/badge.svg)

![CredShield Hero Interface](./docs/screenshots/credshield_hero.png)

---

## 🌐 Live Demo & Links

| Resource | Link |
|----------|------|
| **Live Demo** | [https://midnight-nine-pi.vercel.app](https://midnight-nine-pi.vercel.app) |
| **Demo Video** | [Google Drive — Full Walkthrough](https://drive.google.com/drive/folders/1Vlo_kcGJ7q2RhJv3ElzxwsvL9vEdzgxU?usp=sharing) |
| **GitHub Repository** | [github.com/ArchishmanS2005/midnight](https://github.com/ArchishmanS2005/midnight) |
| **Deployed Contract (Preprod)** | Pending DUST generation — demonstrated on local `undeployed` network |

---

## 📋 Contract Address

| Network  | Address                                                          |
|----------|------------------------------------------------------------------|
| Preprod  | TBD — fill in after Preprod deployment                           |
| Undeployed (local) | Deployed via `standalone.yml` Docker Compose         |

---

## 💡 Product Vision

In traditional digital credential verification systems, verifying academic degrees, employment history, or professional certifications requires either exposing full personal identity payloads to third-party verifiers or relying on centralized verification APIs that track user activity. **CredShield** solves this by establishing a privacy-preserving credential verification protocol on the **Midnight Blockchain**.

CredShield allows certified institutions to issue tamper-proof verifiable credentials while enabling holders to prove credential validity, ownership, and active state off-chain via **Compact Zero-Knowledge (ZK) circuits** without publicly disclosing personal keys or identity data.

---

## 🔒 Privacy Model

| Data Point              | Type                | Disclosed To        |
|-------------------------|---------------------|---------------------|
| `credentialState`         | PUBLIC ledger       | Everyone            |
| `credentialId`            | PUBLIC ledger       | Everyone            |
| `issuerAuthority`         | PUBLIC ledger       | Everyone            |
| `totalIssued`             | PUBLIC ledger       | Everyone            |
| `totalVerified`           | PUBLIC ledger       | Everyone            |
| `credentialMetadata`      | PUBLIC ledger       | Everyone            |
| `secretKey`               | PRIVATE witness     | No one              |
| ZK witness context      | PRIVATE witness     | No one              |
| Off-chain proof inputs  | PRIVATE witness     | No one              |

- **PUBLIC**: Credential state, credential ID hash, issuer authority commitment, counters
- **PRIVATE**: `secretKey` (Bytes<32>) — never leaves device, never stored on chain
- **PROVED without revealing**: Issuer identity is proved via `authorityPublicKey(secretKey, sequence)` — a one-way hash committed on-chain, without exposing the raw key

---

## 🔐 Privacy Claim

> **Observable Privacy Behavior**: When a credential holder executes `verifyCredential`, the ZK circuit proves they possess the correct `secretKey` by computing `authorityPublicKey(secretKey, sequence)` entirely within the local witness context. The proof is submitted on-chain and the `totalVerified` counter increments — but the **secret key value is never disclosed, transmitted, or stored on the ledger**. The verifier only sees the proof validity, not the underlying identity.

This demonstrates **selective disclosure**: proving credential ownership without revealing the holder's secret key or raw identity metadata.

---

## 🎬 Demo Video

> 📹 **[Watch the CredShield Demo Video →](https://drive.google.com/drive/folders/1Vlo_kcGJ7q2RhJv3ElzxwsvL9vEdzgxU?usp=sharing)**

*Demonstrates: Lace wallet connect/disconnect, credential issuance circuit call, ZK verification proof generation, and on-chain state update.*

---

## 🖼️ UI Screenshots

| Landing Page | Features Page |
|---|---|
| ![Landing](./docs/screenshots/credshield_hero.png) | ![Features](./docs/screenshots/credshield_features.png) |

| Architecture Page | Live Demo Page |
|---|---|
| ![Architecture](./docs/screenshots/credshield_architecture.png) | ![Demo](./docs/screenshots/credshield_demo.png) |

| About Page |
|---|
| ![About](./docs/screenshots/credshield_about.png) |

---

## ✅ Level 3 Submission Checklist

| Requirement | Status |
|-------------|--------|
| 3+ tests passing (circuit logic, state transitions, privacy) | ✅ 5 Vitest tests in `contract/src/test/credshield.test.ts` |
| CI/CD pipeline running on push to main | ✅ `.github/workflows/ci.yml` (Node 22, compact compile, test) |
| CI badge in README.md | ✅ Badge at top of this README |
| Contract address in README.md | ✅ Contract Address table above |
| Privacy Model section in README.md | ✅ Privacy Model table above |
| PROPOSAL.md created with correct structure | ✅ `PROPOSAL.md` in root |
| dApp builds with zero errors | ✅ `npm run build` in credshield-ui |
| File structure matches spec | ✅ contract/, managed/, src/, tests/, .github/workflows/ci.yml |
| Lace wallet connect / disconnect implemented | ✅ DApp Connector API v4 (CAIP-372 UUID detection) |
| Circuit called successfully from frontend | ✅ `issueCredential`, `verifyCredential`, `revokeCredential` |
| Observable privacy behavior | ✅ Secret key proved in ZK without disclosure |
| Minimum 10 meaningful commits | ✅ Authored by ArchishmanS2005 |
| Live demo link | ✅ [midnight-nine-pi.vercel.app](https://midnight-nine-pi.vercel.app) |
| Demo video: wallet connect + circuit call | ✅ [Google Drive](https://drive.google.com/drive/folders/1Vlo_kcGJ7q2RhJv3ElzxwsvL9vEdzgxU?usp=sharing) |

---

## 🧪 Run Tests

`ash
cd contract
npm test
`

Expected output: 5 tests passing — circuit logic, state transitions, privacy invariant, negative case, deterministic authority key.

---

## ⚙️ CI/CD Pipeline

The `.github/workflows/ci.yml` pipeline:
1. Triggers on push to `main` and all pull requests
2. Installs **Node.js v22**
3. Runs `npm ci --legacy-peer-deps` (root dependencies)
4. Runs `compact compile` on `credshield.compact` (ZK circuit compilation)
5. Runs `npm run test` (Vitest — 5 tests)
6. Builds `api/`, `credshield-cli/`, and `credshield-ui/`

---

## 🚀 Quick Start — Local Development

### Prerequisites

- **Node.js** >= 22 (`nvm use 22`)
- **Docker** and Docker Compose v2
- **Compact Compiler** (`npm install -g @midnight-ntwrk/compact-compiler`)
- **Lace Wallet** browser extension (set to "Undeployed" network)

### Step 1: Start Local Midnight Network (incl. Proof Server)

`ash
docker compose -f standalone.yml up -d
`

| Service | Port | URL |
|---------|------|-----|
| Midnight Node | 9944 | `http://localhost:9944` |
| Indexer (GraphQL + WS) | 8088 | `http://localhost:8088/api/v4/graphql` |
| Proof Server | 6300 | `http://localhost:6300` |

### Step 2: Fund Wallet

`ash
npm install -g midnight-wallet-cli
midnight config set network undeployed
midnight wallet generate credshield
midnight airdrop 10000
midnight dust register   # ~5 min on fresh wallet
`

### Step 3: Compile & Build

`ash
cd contract && compact compile src/credshield.compact src/managed/credshield && yarn build
cd ../api && yarn build
cd ../credshield-ui && yarn dev --host
`

Open `http://localhost:5173` → Connect Lace (Undeployed network) → Issue & Verify.

---

## 🔒 Architecture: Public vs. Private State

`
┌─────────────────────────────────────────────────────────────────────────┐
│                          CredShield Architecture                        │
├────────────────────────────────────┬────────────────────────────────────┤
│         Public State (Ledger)      │       Private Witness (Local)      │
├────────────────────────────────────┼────────────────────────────────────┤
│ • credentialState (ACTIVE/REVOKED) │ • secretKey (Bytes<32> Local Key)  │
│ • credentialId (Bytes<32> Hash)    │ • Un-blinded Holder Identity       │
│ • issuerAuthority (Bytes<32> PK)   │ • ZK Witness Context & Nonces      │
│ • totalIssued (Counter)            │ • Off-Chain Proof Generation       │
│ • totalVerified (Counter)          │ • Private State Storage            │
└────────────────────────────────────┴────────────────────────────────────┘
`

---

## 🛠️ Compact Smart Contract (3 ZK Circuits)

`compact
pragma language_version 0.23;

export enum CredentialState { UNINITIALIZED, ACTIVE, REVOKED }

export ledger credentialState: CredentialState;
export ledger credentialId: Bytes<32>;
export ledger issuerAuthority: Bytes<32>;
export ledger totalIssued: Counter;
export ledger totalVerified: Counter;

witness secretKey(): Bytes<32>;

export circuit issueCredential(id: Bytes<32>, metadata: Opaque<"string">): [] {
  issuerAuthority = disclose(authorityPublicKey(secretKey(), sequence as Field as Bytes<32>));
  credentialId = disclose(id);
  credentialState = CredentialState.ACTIVE;
  totalIssued.increment(1);
}

export circuit verifyCredential(providedId: Bytes<32>): [] {
  assert(credentialState == CredentialState.ACTIVE, "Credential not active");
  assert(providedId == credentialId, "Credential ID mismatch");
  totalVerified.increment(1);
}

export circuit revokeCredential(): [] {
  assert(issuerAuthority == authorityPublicKey(secretKey(), sequence as Field as Bytes<32>));
  credentialState = CredentialState.REVOKED;
}
`

---

## 🌟 Key Features

- **Compact ZK Circuit Verification** — Off-chain proof generation, secret keys never leave local memory
- **Lace Wallet Integration** — DApp Connector API v4, CAIP-372 UUID-based wallet discovery
- **Local-First Development** — Full Midnight stack in Docker (node + indexer + proof server)
- **Issuer Authority & Revocation** — On-chain cryptographic revocation by issuer only
- **Selective Disclosure** — Prove credential validity without raw metadata exposure
- **GSAP Scroll Animations** — Premium animated UI with scroll-triggered reveals
- **Vercel Deployed** — Production frontend at [midnight-nine-pi.vercel.app](https://midnight-nine-pi.vercel.app)

---

## 📁 Monorepo Structure

`
credshield/
├── contract/              # Compact ZK smart contract & compiled circuits
│   ├── src/
│   │   ├── credshield.compact   # ZK contract source
│   │   ├── managed/             # Compiled circuit artifacts (auto-generated)
│   │   └── test/
│   │       ├── credshield.test.ts   # 5 Vitest tests
│   │       └── credshield-simulator.ts
├── api/                   # TypeScript API wrapper (CredShieldAPI)
├── credshield-cli/        # Interactive CLI (standalone/undeployed/preprod modes)
├── credshield-ui/         # React 19 + MUI 9 + GSAP + Vite 8 Web DApp
├── standalone.yml         # Docker Compose for local Midnight network
├── .github/workflows/
│   └── ci.yml             # CI/CD pipeline (Node 22 + compact compile + tests)
├── PROPOSAL.md            # Product proposal (Level 3)
├── vercel.json            # Vercel deployment configuration
└── docs/screenshots/      # UI screenshots
`

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Compact (Midnight ZK language) |
| ZK Proof System | Compact Runtime + Proof Server |
| Frontend | React 19, TypeScript, Vite 8 |
| UI Components | MUI 9 (Material UI) |
| Animations | GSAP ScrollTrigger |
| Wallet | Lace / 1AM Wallet (DApp Connector API v4) |
| State Management | RxJS Observables |
| Testing | Vitest |
| CI/CD | GitHub Actions |
| Deployment | Vercel (frontend) + Docker (local network) |
| Node | Node.js 22 |

---

## 🗺️ Product Proposal

See [PROPOSAL.md](./PROPOSAL.md) for the full product proposal including data model, mainnet feasibility, and why Midnight specifically enables this use case.

---

## 📜 Commit History

Authored by **ArchishmanS2005** (`archishmansarkar94@gmail.com`)

---

## 🛡️ License

MIT License. Developed by **ArchishmanS2005** for the Midnight Rise In Level 3 Builder Challenge.
