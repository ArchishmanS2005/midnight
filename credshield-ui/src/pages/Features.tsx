import React, { useEffect, useRef } from 'react';
import { Shield, Lock, Key, EyeOff, Network, Terminal, Cpu, Database, Zap, Settings, Wrench } from 'lucide-react';

const primaryFeatures = [
  {
    icon: Key,
    title: 'Off-Chain ZK Proving',
    subtitle: 'Client-Side Privacy',
    desc: 'Compact ZK circuit provers execute entirely within local browser or CLI memory. The 32-byte secret key witness never leaves the client — zero network hops, zero exposure, zero trust assumptions.',
    highlight: 'secretKey stays in WitnessContext',
  },
  {
    icon: Shield,
    title: 'Selective Disclosure',
    subtitle: 'Prove Without Revealing',
    desc: 'Holders can prove credential validity, ownership, and active status without exposing the underlying raw metadata, identity payloads, or un-blinded commitment values to the verifier.',
    highlight: 'Zero raw identity exposure',
  },
  {
    icon: Lock,
    title: 'Issuer Authority & Revocation',
    subtitle: 'Cryptographic Control',
    desc: 'The issuer authority is a persistent hash of (secretKey, sequence). Revocation requires re-computing this commitment, ensuring only the original issuer can disable a credential.',
    highlight: 'authorityPublicKey(sk, seq)',
  },
  {
    icon: EyeOff,
    title: 'Unlinkable Verifications',
    subtitle: 'Privacy-Preserving History',
    desc: 'Each verification increments the on-chain counter but reveals no correlation between verification requests. Historical holder activity is completely unlinkable.',
    highlight: 'totalVerified: Counter (no logs)',
  },
  {
    icon: Network,
    title: 'Local-First Development',
    subtitle: 'Docker Standalone Network',
    desc: 'Run a full Midnight network locally — node on port 9944, indexer on 8088, proof server on 6300. Deploy and iterate without testnets, faucets, or wallet extensions.',
    highlight: 'docker compose -f standalone.yml up',
  },
  {
    icon: Terminal,
    title: 'Dual Interface',
    subtitle: 'CLI + React Web DApp',
    desc: 'Issue credentials via the interactive terminal CLI or the React Web DApp. Both share the same CredShieldAPI TypeScript wrapper and ZK circuit execution path.',
    highlight: 'npm run standalone',
  },
];

const technicalSpecs = [
  {
    icon: Cpu,
    label: 'Circuits',
    value: '3 ZK circuits',
    detail: 'issueCredential, verifyCredential, revokeCredential',
  },
  {
    icon: Database,
    label: 'Ledger State',
    value: '7 fields',
    detail: 'credentialState, credentialId, issuerAuthority, metadata, counters, sequence',
  },
  { icon: Lock, label: 'Key Size', value: '32 bytes', detail: 'Bytes<32> secret key in local witness context' },
  { icon: Zap, label: 'Proof Server', value: 'v8.0.3', detail: 'midnightntwrk/proof-server Docker image' },
  { icon: Settings, label: 'Compact', value: 'v0.23', detail: 'Latest Compact language specification' },
  { icon: Wrench, label: 'Network Mode', value: 'Undeployed', detail: 'Local dev node with genesis wallet pre-funded' },
];

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initAnimations = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (containerRef.current) {
          const cards = containerRef.current.querySelectorAll('[data-feature]');
          gsap.fromTo(
            cards,
            { opacity: 0, y: 60, rotateX: 8 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power3.out',
              scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
            },
          );

          const specs = containerRef.current.querySelectorAll('[data-spec]');
          gsap.fromTo(
            specs,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: 'back.out(1.4)',
              scrollTrigger: { trigger: specs[0]?.parentElement, start: 'top 80%' },
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
      {/* Page Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <div className="px-3 py-1 rounded-full bg-[#2B2644]/8 border border-[#2B2644]/15 text-[#2B2644] text-[11px] font-medium tracking-widest uppercase">
            Platform Features
          </div>
        </div>
        <h1 className="text-black text-[2.2rem] md:text-[2.8rem] font-medium tracking-[-0.03em] leading-tight mb-3">
          Features & Capabilities
        </h1>
        <p className="text-black/55 text-[15px] leading-relaxed max-w-2xl">
          CredShield leverages Midnight&apos;s Compact ZK circuits and hybrid ledger architecture to deliver verifiable
          credentials that are genuinely private, locally provable, and cryptographically revocable.
        </p>
      </div>

      {/* Primary Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
        {primaryFeatures.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              data-feature
              className="group bg-white rounded-2xl border border-black/[0.07] p-6 hover:border-[#2B2644]/20 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#2B2644] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-black text-[15px] font-medium leading-tight mb-0.5">{f.title}</div>
                  <div className="text-[#2B2644] text-[11px] font-medium tracking-wide uppercase">{f.subtitle}</div>
                </div>
              </div>
              <p className="text-black/55 text-[13px] leading-relaxed mb-4">{f.desc}</p>
              <code className="inline-block px-2.5 py-1 bg-[#F5F5F5] rounded-lg text-black/50 text-[11px] font-mono border border-black/[0.06]">
                {f.highlight}
              </code>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-black/[0.06] mb-12" />

      {/* Technical Specifications */}
      <div>
        <h2 className="text-black text-[1.6rem] font-medium tracking-[-0.03em] mb-2">Technical Specifications</h2>
        <p className="text-black/50 text-[14px] mb-8">
          The core building blocks that power CredShield&apos;s privacy guarantees.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {technicalSpecs.map((spec) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.label}
                data-spec
                className="bg-white rounded-2xl border border-black/[0.07] p-5 hover:border-[#2B2644]/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-[#2B2644]" strokeWidth={2} />
                  <span className="text-black/40 text-[10px] font-medium tracking-widest uppercase">{spec.label}</span>
                </div>
                <div className="text-black text-[18px] font-medium mb-1">{spec.value}</div>
                <div className="text-black/45 text-[12px] leading-snug">{spec.detail}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
