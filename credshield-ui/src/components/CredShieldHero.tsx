import React from 'react';
import { Shield, Lock, Key, CheckCircle, Zap } from 'lucide-react';

export type CredShieldHeroProps = {
  onIssueClick: () => void;
  onVerifyClick: () => void;
  onGuideClick: () => void;
};

export const CredShieldHero: React.FC<CredShieldHeroProps> = ({ onIssueClick, onVerifyClick, onGuideClick }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#2B2644] px-6 md:px-14 pt-10 md:pt-14 pb-10 md:pb-12 mb-10">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(175,221,255,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Status badges */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 relative">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 border border-white/15 text-white/70 text-[11px] font-medium tracking-wider uppercase">
          <Zap className="w-3 h-3" strokeWidth={2} />
          Midnight Network · Preprod Testnet
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 border border-white/15 text-white/70 text-[11px] font-medium tracking-wider uppercase">
          <Lock className="w-3 h-3" strokeWidth={2} />
          Compact ZK Circuit Prover Ready
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-white text-center text-[2.4rem] sm:text-[3.6rem] md:text-[4.4rem] font-medium tracking-[-0.03em] leading-[1.05] mb-2 relative">
        CredShield
      </h1>
      <h2 className="text-[#AFDDFF] text-center text-[1.1rem] sm:text-[1.5rem] md:text-[1.8rem] font-medium tracking-wide uppercase leading-snug mb-4 relative opacity-90">
        Privacy-Preserving Credential Verifier
      </h2>

      {/* Subtitle */}
      <p className="text-white/55 text-center max-w-2xl mx-auto text-[14px] md:text-[15px] leading-relaxed mb-8 relative">
        Issue and verify tamper-proof credentials on Midnight Blockchain. Credential holders prove ownership off-chain
        via Compact zero-knowledge circuits without exposing secret keys or identity payloads to verifiers.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center mb-10 relative">
        {/* Primary — Issue */}
        <button
          onClick={onIssueClick}
          className="flex items-center gap-2 bg-white text-[#2B2644] rounded-full pl-4 pr-2 py-2 text-[14px] font-medium hover:bg-white/90 transition-all duration-200"
        >
          <Shield className="w-4 h-4" strokeWidth={1.5} />
          <span>Issue Credential Instance →</span>
        </button>

        {/* Secondary — Verify */}
        <button
          onClick={onVerifyClick}
          className="flex items-center gap-2 border border-white/25 text-white rounded-full px-5 py-2 text-[14px] font-medium hover:border-[#AFDDFF]/60 hover:bg-white/5 transition-all duration-200"
        >
          <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
          Verify Credential (ZK Proof)
        </button>

        {/* Ghost — Guide */}
        <button
          onClick={onGuideClick}
          className="text-white/50 px-4 py-2 text-[14px] font-medium hover:text-white/80 transition-colors duration-200"
        >
          Deployment Guide ↓
        </button>
      </div>

      {/* 3 feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
        {[
          {
            icon: Key,
            title: 'Off-Chain Proving',
            desc: 'Secret witness keys stay strictly in local browser memory. Compact ZK circuit prover executes client-side.',
          },
          {
            icon: CheckCircle,
            title: 'Selective Disclosure',
            desc: 'Prove active credential state without exposing raw identity, degree payload, or unblinded commitments.',
          },
          {
            icon: Shield,
            title: 'Authority Revocation',
            desc: 'Issuers hold on-chain authority commitments to revoke compromised credentials while keeping holder history private.',
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white/8 border border-white/10 rounded-2xl p-5 hover:bg-white/12 hover:border-white/20 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-[#AFDDFF]" strokeWidth={1.5} />
              </div>
              <div className="text-white text-[14px] font-medium mb-1.5">{card.title}</div>
              <p className="text-white/50 text-[12px] leading-relaxed">{card.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
