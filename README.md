# CredShield — Privacy-Preserving Credential Verifier Platform

![CredShield Hero Interface](./docs/screenshots/credshield_hero.png)

---

## 💡 Product Vision

In traditional digital credential verification systems, verifying academic degrees, employment history, or professional certifications requires either exposing full personal identity payloads to third-party verifiers or relying on centralized verification APIs that track user activity. **CredShield** solves this by establishing a privacy-preserving credential verification protocol on the **Midnight Blockchain**. CredShield allows certified institutions to issue tamper-proof verifiable credentials while enabling holders to prove credential validity, ownership, and active state off-chain via **Compact Zero-Knowledge (ZK) circuits** without publicly disclosing personal keys or identity data.

---

## 🎬 Demo Video

> � **[Watch the CredShield Demo Video →](./docs/demo-video.mp4)**

*Full end-to-end walkthrough: local network setup, contract deployment, credential issuance, ZK verification, and revocation.*

---

## 🖼️ UI Screenshots

| Landing Page | Features Page |
|---|---|
| ![Landing](./docs/screenshots/credshield_landing.png) | ![Features](./docs/screenshots/credshield_features.png) |

| Architecture Page | Live Demo Page |
|---|---|
| ![Architecture](./docs/screenshots/credshield_architecture.png) | ![Demo](./docs/screenshots/credshield_demo.png) |

| Wallet Connection | Credential Issued |
|---|---|
| ![Wallet](./docs/screenshots/credshield_wallet_connect.png) | ![Issued](./docs/screenshots/credshield_issued.png) |

---

## �🚀 Quick Start — Local Development (Undeployed Network)

CredShield runs on a fully local Midnight network with no external testnet dependencies. All services run in Docker.

### Prerequisites

- **Node.js** >= 24.11.1 (use `nvm use 24`)
- **Docker** and Docker Compose v2
- **Compact Compiler** v0.5.1 (`compact --version`)
- **Lace Wallet** browser extension (set to "Undeployed" network)
- Access to Midnight npm registry (configured in `.npmrc`)

### Step 1: Start the Local Midnight Network

```bash
docker compose -f standalone.yml up -d
```

This starts three services on fixed ports:
| Service | Port | URL |
|---------|------|-----|
| Midnight Node | 9944 | `http://localhost:9944` |
| Indexer (GraphQL + WS) | 8088 | `http://localhost:8088/api/v4/graphql` |
| Proof Server | 6300 | `http://localhost:6300` |

All services use the `undeployed` network ID with the `dev` node preset.

### Step 2: Fund Wallet with NIGHT & DUST

```bash
# Install midnight wallet CLI
npm install -g midnight-wallet-cli

# Configure for undeployed network
midnight config set network undeployed

# Generate wallet and fund it
midnight wallet generate credshield
midnight airdrop 10000

# Fund your Lace wallet address directly
midnight airdrop 10000 <your_lace_address>

# Register DUST (required for tx fees — takes ~5 min on fresh wallet)
midnight dust register
```

### Step 3: Compile the Compact Contract

```bash
cd contract
compact compile src/credshield.compact src/managed/credshield
yarn build
```

### Step 4: Build API & CLI

```bash
cd ../api && yarn build
cd ../credshield-cli && yarn build
```

### Step 5: Launch the Web DApp

```bash
cd credshield-ui
yarn dev --host
```

Open `http://localhost:5173` → Connect Lace Wallet (set to "Undeployed") → Issue & Verify Credentials.

---

## 🔒 Public State vs. Private Witness Architecture

```
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
```

### Public State (On-Chain Ledger)
- **`credentialState`**: Enum lifecycle (`UNINITIALIZED` → `ACTIVE` → `REVOKED`)
- **`credentialId`**: 32-byte cryptographic identifier hash
- **`issuerAuthority`**: `persistentHash(pad, sequence, secretKey)` commitment
- **`totalIssued` & `totalVerified`**: On-chain counters

### Private Witness (Local Client Memory)
- **`secretKey`**: 32-byte secret key held strictly in local client memory
- **ZK Circuit Computation**: `authorityPublicKey(sk, sequence)` computed within zero-knowledge — never exposed on-chain

---

## 🛠️ Compact Smart Contract (3 ZK Circuits)

```compact
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
```

---

## 🌐 Local Network Services (Docker)

| Service | Image | Port |
|---------|-------|------|
| Node | `midnightntwrk/midnight-node:0.22.3` | 9944 |
| Indexer | `midnightntwrk/indexer-standalone:4.0.1` | 8088 |
| Proof Server | `midnightntwrk/proof-server:8.0.3` | 6300 |

Network ID: `undeployed` — genesis wallet pre-funded, no faucet needed.

---

## 🌟 Key Features

- **Compact ZK Circuit Verification** — Off-chain proof generation, secret keys never leave local memory
- **Local-First Development** — Full Midnight stack in Docker, no testnet dependency
- **Lace Wallet Integration** — DApp Connector API v4 (CAIP-372 compatible, UUID-based wallet discovery)
- **Issuer Authority & Revocation** — Cryptographic on-chain revocation by issuer only
- **Selective Disclosure** — Prove credential validity without raw metadata exposure
- **GSAP Scroll Animations** — Premium animated UI with scroll-triggered reveals
- **Vercel Deployable** — Production build with static ZK key serving

---

## 📁 Monorepo Structure

```
credshield/
├── contract/              # Compact ZK smart contract & compiled circuits
├── api/                   # TypeScript API wrapper (CredShieldAPI)
├── credshield-cli/        # Interactive CLI with standalone/undeployed modes
├── credshield-ui/         # React 19 + MUI 9 + GSAP + Vite 8 Web DApp
├── standalone.yml         # Docker Compose for local Midnight network
├── vercel.json            # Vercel deployment configuration
└── docs/                  # Screenshots, video, documentation
```

---

## 📖 CLI Execution Guide

```bash
cd credshield-cli && yarn build

# Local undeployed network (connects to Docker services)
npm run undeployed

# Or use standalone mode (spins up own containers)
npm run standalone
```

---

## 🚢 Deployment

### Vercel (Frontend Only)
```bash
vercel --prod
```
The `vercel.json` in root handles build commands, SPA routing, and static ZK key headers.

### Full Stack (Local)
```bash
docker compose -f standalone.yml up -d   # Network
cd credshield-ui && yarn dev --host       # Frontend
midnight serve --network undeployed --approve-all  # Wallet connector
```

---

## 📜 Commit History

Authored by **ArchishmanS2005** (`archishmansarkar94@gmail.com`)

---

## 🛡️ License

MIT License. Developed by **ArchishmanS2005** for the Midnight Rise In Level 2 Builder Challenge.
