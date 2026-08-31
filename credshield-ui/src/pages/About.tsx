import React, { useEffect, useRef } from 'react';
import { Info, Rocket, FolderOpen, Layers } from 'lucide-react';

// Inline GitHub SVG (lucide-react v1 does not export Github)
const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
import { Link as MuiLink } from '@mui/material'; // keep MUI Link for href support

const workspaces = [
  {
    name: 'contract/',
    desc: 'Compact smart contract, ZK circuits, generated TypeScript bindings & ZKIR/WASM proving keys',
    files: ['src/credshield.compact', 'src/witnesses.ts', 'src/managed/credshield/'],
    accent: '#2B2644',
  },
  {
    name: 'api/',
    desc: 'High-level TypeScript API wrapper (CredShieldAPI) — deploy, join, issueCredential, verifyCredential, revokeCredential',
    files: ['src/index.ts', 'src/common-types.ts', 'src/utils/'],
    accent: '#4A7C59',
  },
  {
    name: 'credshield-cli/',
    desc: 'Interactive command-line launcher with standalone/preview/preprod modes, Docker proof-server configs',
    files: ['src/index.ts', 'src/config.ts', 'src/launcher/', 'compose.yml'],
    accent: '#2B5F8A',
  },
  {
    name: 'credshield-ui/',
    desc: 'React 19 + MUI 9 + Vite 8 Web DApp — GSAP animations, Lace/1AM wallet connector, ZK credential management',
    files: ['src/App.tsx', 'src/contexts/', 'src/pages/', 'src/components/'],
    accent: '#6B4A8A',
  },
];

const techStack = [
  { label: 'Compact',    version: 'v0.23',       desc: 'ZK smart contract language' },
  { label: 'React',      version: '19.2',        desc: 'UI framework' },
  { label: 'MUI',        version: '9.1',         desc: 'Material UI components' },
  { label: 'Vite',       version: '8.0',         desc: 'Build tool' },
  { label: 'TypeScript', version: '5.9',         desc: 'Type safety' },
  { label: 'GSAP',       version: '3.12',        desc: 'Scroll animations' },
  { label: 'Node.js',    version: '24.11',       desc: 'Runtime' },
  { label: 'Docker',     version: 'Compose v2',  desc: 'Container orchestration' },
];

export default function About() {
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
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0,
              duration: 0.8, stagger: 0.12, ease: 'power2.out',
              scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
            }
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
            About The Project
          </div>
        </div>
        <h1 className="text-black text-[2.2rem] md:text-[2.8rem] font-medium tracking-[-0.03em] leading-tight mb-3">
          About CredShield
        </h1>
        <p className="text-black/55 text-[15px] leading-relaxed max-w-2xl">
          CredShield is a privacy-preserving credential verification platform built on the Midnight Blockchain.
          It enables institutions to issue tamper-proof verifiable credentials while allowing holders to prove
          credential validity via zero-knowledge proofs — without exposing identity data.
        </p>
      </div>

      {/* Vision Section */}
      <div className="mb-10" data-section>
        <div className="bg-[#2B2644] rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="w-5 h-5 text-white" strokeWidth={1.5} />
            <h2 className="text-white text-[18px] font-medium">Vision & Motivation</h2>
          </div>
          <p className="text-white/60 text-[14px] leading-relaxed mb-3">
            Traditional digital credential verification systems require either exposing full personal identity
            payloads to third-party verifiers or relying on centralized verification APIs that track user activity.
          </p>
          <p className="text-white/85 text-[14px] leading-relaxed font-medium">
            CredShield establishes a privacy-preserving credential verification protocol where certified institutions
            issue tamper-proof verifiable credentials. Holders prove credential validity, ownership, and active state
            off-chain via Compact Zero-Knowledge circuits — without publicly disclosing personal keys or identity data.
          </p>
        </div>
      </div>

      {/* Author & Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12" data-section>
        {/* Developer */}
        <div className="bg-white rounded-2xl border border-black/[0.07] p-6">
          <div className="flex items-center gap-2 mb-5">
            <GithubIcon />
            <h3 className="text-black text-[16px] font-medium">Developer</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-black/40 text-[10px] font-medium tracking-widest uppercase mb-1">Author</div>
              <div className="text-black text-[20px] font-medium">ArchishmanS2005</div>
            </div>
            <div>
              <div className="text-black/40 text-[10px] font-medium tracking-widest uppercase mb-1">Email</div>
              <div className="text-black/60 text-[13px] font-mono">archishmansarkar94@gmail.com</div>
            </div>
            <div>
              <div className="text-black/40 text-[10px] font-medium tracking-widest uppercase mb-1">Repository</div>
              <a
                href="https://github.com/ArchishmanS2005/midnight"
                target="_blank"
                rel="noreferrer"
                className="text-[#2B2644] text-[13px] font-medium hover:underline"
              >
                github.com/ArchishmanS2005/midnight
              </a>
            </div>
          </div>
        </div>

        {/* Challenge */}
        <div className="bg-white rounded-2xl border border-black/[0.07] p-6">
          <div className="flex items-center gap-2 mb-5">
            <Info className="w-5 h-5 text-[#2B2644]" strokeWidth={1.5} />
            <h3 className="text-black text-[16px] font-medium">Challenge</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-black/40 text-[10px] font-medium tracking-widest uppercase mb-1">Program</div>
              <div className="text-black text-[16px] font-medium">Midnight Rise In Level 1</div>
            </div>
            <div>
              <div className="text-black/40 text-[10px] font-medium tracking-widest uppercase mb-1">Category</div>
              <div className="text-black/60 text-[13px]">Builder Challenge — Privacy-Preserving DApp</div>
            </div>
            <div>
              <div className="text-black/40 text-[10px] font-medium tracking-widest uppercase mb-1">License</div>
              <div className="text-black/60 text-[13px]">MIT License</div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black/[0.06] mb-12" />

      {/* Monorepo Structure */}
      <div className="mb-12" data-section>
        <div className="flex items-center gap-2 mb-6">
          <FolderOpen className="w-5 h-5 text-[#2B2644]" strokeWidth={1.5} />
          <h2 className="text-black text-[1.6rem] font-medium tracking-[-0.03em]">Monorepo Structure</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workspaces.map((ws) => (
            <div
              key={ws.name}
              className="bg-white rounded-2xl border border-black/[0.07] p-5 overflow-hidden"
              style={{ borderLeftWidth: 3, borderLeftColor: ws.accent }}
            >
              <code className="text-[15px] font-mono font-medium mb-2 block" style={{ color: ws.accent }}>{ws.name}</code>
              <p className="text-black/55 text-[13px] leading-relaxed mb-4">{ws.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {ws.files.map((f) => (
                  <span key={f} className="px-2 py-0.5 bg-[#F5F5F5] rounded-lg text-black/40 text-[10px] font-mono border border-black/[0.06]">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black/[0.06] mb-12" />

      {/* Tech Stack */}
      <div data-section>
        <div className="flex items-center gap-2 mb-6">
          <Layers className="w-5 h-5 text-[#2B2644]" strokeWidth={1.5} />
          <h2 className="text-black text-[1.6rem] font-medium tracking-[-0.03em]">Technology Stack</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3">
          {techStack.map((t) => (
            <div
              key={t.label}
              className="bg-white rounded-2xl border border-black/[0.07] p-4 text-center hover:border-[#2B2644]/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="text-black text-[15px] font-medium mb-1">{t.label}</div>
              <span className="inline-block px-2 py-0.5 rounded-full bg-[#2B2644]/8 border border-[#2B2644]/15 text-[#2B2644] text-[11px] font-mono mb-2">
                {t.version}
              </span>
              <div className="text-black/40 text-[11px]">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
