import React, { useEffect, useRef } from 'react';
import { Database, Lock, CloudOff, Network, Server, GitBranch } from 'lucide-react';

const publicState = [
  { field: 'credentialState', type: 'CredentialState', desc: 'UNINITIALIZED → ACTIVE → REVOKED enum lifecycle' },
  { field: 'credentialId', type: 'Bytes<32>', desc: 'Cryptographic 32-byte identifier hash of the credential' },
  {
    field: 'credentialMetadata',
    type: 'Maybe<Opaque<"string">>',
    desc: 'Optional human-readable metadata (degree title, badge name)',
  },
  {
    field: 'issuerAuthority',
    type: 'Bytes<32>',
    desc: 'persistentHash of (pad, sequence, secretKey) — issuer commitment',
  },
  { field: 'totalIssued', type: 'Counter', desc: 'Global on-chain counter of successful credential issuances' },
  { field: 'totalVerified', type: 'Counter', desc: 'Global counter of successful ZK verification proofs' },
  { field: 'sequence', type: 'Counter', desc: 'Internal sequence number for key derivation rotation' },
];

const privateWitness = [
  { field: 'secretKey', type: 'Bytes<32>', desc: 'Held strictly in local client memory (WitnessContext)' },
  {
    field: 'ZK Circuit Execution',
    type: 'Off-Chain',
    desc: 'Proof generation runs entirely client-side, never on-chain',
  },
  {
    field: 'Authority Derivation',
    type: 'persistentHash',
    desc: 'authorityPublicKey(sk, sequence) computed in zero-knowledge',
  },
  {
    field: 'Private State',
    type: 'In-Memory Provider',
    desc: 'Scoped per contract address, never persisted to network',
  },
];

const pipeline = [
  {
    step: '1',
    title: 'Compile Compact Contract',
    detail: 'compact compile src/credshield.compact → ZKIR, WASM proving keys, TypeScript bindings',
    accent: '#2B2644',
  },
  {
    step: '2',
    title: 'Start Local Network',
    detail: 'docker compose -f standalone.yml up -d → node:9944, indexer:8088, proof-server:6300',
    accent: '#4A7C59',
  },
  {
    step: '3',
    title: 'Build API + CLI + UI',
    detail: 'yarn build across all workspace packages (contract → api → cli → ui)',
    accent: '#2B5F8A',
  },
  {
    step: '4',
    title: 'Deploy Contract Instance',
    detail: 'CLI standalone mode or Web DApp — uses genesis wallet on undeployed network',
    accent: '#6B4A8A',
  },
  {
    step: '5',
    title: 'Issue & Verify Credentials',
    detail: 'Execute ZK circuits via CredShieldAPI — proofs generated locally, verified on-chain',
    accent: '#8A4A6B',
  },
];

const services = [
  {
    name: 'Midnight Node',
    port: '9944',
    image: 'midnightntwrk/midnight-node:0.22.3',
    desc: 'Local blockchain node with dev preset',
  },
  {
    name: 'Indexer',
    port: '8088',
    image: 'midnightntwrk/indexer-standalone:4.0.1',
    desc: 'GraphQL + WebSocket indexer API',
  },
  {
    name: 'Proof Server',
    port: '6300',
    image: 'midnightntwrk/proof-server:8.0.3',
    desc: 'ZK proof generation service',
  },
];

export default function Architecture() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initAnimations = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (containerRef.current) {
          const sections = containerRef.current.querySelectorAll('[data-section]');
          gsap.fromTo(
            sections,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
            },
          );
        }
      } catch {
        // graceful fallback
      }
    };
    initAnimations();
  }, []);

  return (
    <div className="text-black pb-10 pt-2" ref={containerRef}>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <div className="px-3 py-1 rounded-full bg-[#2B2644]/8 border border-[#2B2644]/15 text-[#2B2644] text-[11px] font-medium tracking-widest uppercase">
            System Architecture
          </div>
        </div>
        <h1 className="text-black text-[2.2rem] md:text-[2.8rem] font-medium tracking-[-0.03em] leading-tight mb-3">
          Architecture & State Model
        </h1>
        <p className="text-black/55 text-[15px] leading-relaxed max-w-2xl">
          CredShield uses Midnight&apos;s hybrid ledger model — public state lives on-chain for verifiability while
          secret keys and witness computations remain strictly in local memory. The architecture guarantees complete
          privacy with zero trust assumptions.
        </p>
      </div>

      {/* Public vs Private State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12" data-section>
        {/* Public State */}
        <div className="bg-white rounded-2xl border border-black/[0.07] p-6">
          <div className="flex items-center gap-2 mb-5">
            <Database className="w-5 h-5 text-[#2B2644]" strokeWidth={1.5} />
            <span className="text-black text-[15px] font-medium">Public State (On-Chain Ledger)</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {publicState.map((item) => (
              <div key={item.field} className="p-3 bg-[#F5F5F5] rounded-xl border border-black/[0.05]">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <code className="text-[#2B2644] text-[12px] font-mono font-medium">{item.field}</code>
                  <span className="px-1.5 py-0.5 bg-black/5 rounded text-black/40 text-[10px] font-mono">
                    {item.type}
                  </span>
                </div>
                <p className="text-black/50 text-[11px] leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Private Witness */}
        <div className="bg-[#2B2644] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-white" strokeWidth={1.5} />
            <span className="text-white text-[15px] font-medium">Private Witness (Local Memory)</span>
          </div>
          <span className="inline-block px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-[10px] font-medium tracking-widest uppercase mb-4">
            Never On-Chain
          </span>
          <div className="flex flex-col gap-2.5 mb-5">
            {privateWitness.map((item) => (
              <div key={item.field} className="p-3 bg-white/8 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <code className="text-[#AFDDFF] text-[12px] font-mono font-medium">{item.field}</code>
                  <span className="px-1.5 py-0.5 bg-white/10 rounded text-white/40 text-[10px] font-mono">
                    {item.type}
                  </span>
                </div>
                <p className="text-white/55 text-[11px] leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
          {/* Zero Network Exposure */}
          <div className="p-3.5 bg-white/5 rounded-xl border border-dashed border-white/15">
            <div className="flex items-center gap-2 mb-1.5">
              <CloudOff className="w-4 h-4 text-white/70" strokeWidth={1.5} />
              <span className="text-white text-[13px] font-medium">Zero Network Exposure</span>
            </div>
            <p className="text-white/50 text-[11px] leading-relaxed">
              The secret key generates an authority commitment via persistentHash inside the ZK circuit. The raw key
              value is never serialized, transmitted, or stored anywhere outside the client process.
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black/[0.06] mb-12" />

      {/* Deployment Pipeline */}
      <div className="mb-12" data-section>
        <h2 className="text-black text-[1.6rem] font-medium tracking-[-0.03em] mb-2">Deployment Pipeline</h2>
        <p className="text-black/50 text-[14px] mb-8">
          From contract compilation to live ZK credential verification — all running locally.
        </p>

        <div className="flex flex-col gap-3">
          {pipeline.map((p) => (
            <div
              key={p.step}
              className="group bg-white rounded-2xl border border-black/[0.07] p-4 flex items-center gap-4 hover:border-black/15 hover:translate-x-1 transition-all duration-200"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-medium shrink-0"
                style={{ backgroundColor: p.accent }}
              >
                {p.step}
              </div>
              <div>
                <div className="text-black text-[14px] font-medium mb-0.5">{p.title}</div>
                <code className="text-black/40 text-[11px] font-mono">{p.detail}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black/[0.06] mb-12" />

      {/* Local Services */}
      <div data-section>
        <div className="flex items-center gap-2 mb-3">
          <Server className="w-5 h-5 text-[#2B2644]" strokeWidth={1.5} />
          <h2 className="text-black text-[1.6rem] font-medium tracking-[-0.03em]">Local Network Services</h2>
        </div>
        <p className="text-black/50 text-[14px] mb-8">
          All services use the <code className="text-[#2B2644] font-mono">undeployed</code> network ID with the{' '}
          <code className="text-[#2B2644] font-mono">dev</code> node preset. Lace Wallet auto-connects to these ports
          when set to &quot;Undeployed&quot; mode.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {services.map((svc) => (
            <div
              key={svc.name}
              className="bg-white rounded-2xl border border-black/[0.07] p-5 hover:border-[#2B2644]/20 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Network className="w-4 h-4 text-[#2B2644]" strokeWidth={1.5} />
                <span className="text-black text-[14px] font-medium">{svc.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#2B2644]/8 border border-[#2B2644]/15 text-[#2B2644] text-[11px] font-mono">
                  :{svc.port}
                </span>
              </div>
              <code className="block text-black/35 text-[11px] font-mono mb-2 leading-snug">{svc.image}</code>
              <p className="text-black/55 text-[12px]">{svc.desc}</p>
            </div>
          ))}
        </div>

        {/* Docker Quick Start */}
        <div className="bg-[#2B2644] rounded-2xl p-5">
          <div className="text-white/40 text-[10px] font-medium tracking-widest uppercase mb-3 flex items-center gap-1.5">
            <GitBranch className="w-3 h-3" strokeWidth={2} />
            Quick Start
          </div>
          <pre className="font-mono text-[13px] text-white/80 leading-relaxed whitespace-pre overflow-x-auto">
            {`# Start the full local Midnight network
docker compose -f standalone.yml up -d

# Check health of all services
docker compose -f standalone.yml ps

# View live logs
docker compose -f standalone.yml logs -f`}
          </pre>
        </div>
      </div>
    </div>
  );
}
