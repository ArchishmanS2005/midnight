import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Menu, X, Wallet, Shield, Lock, Zap } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

// ─── Helpers ────────────────────────────────────────────────────────────────

function shortAddr(addr: string | null): string {
  if (!addr) return '';
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Desktop nav item */
function NavLink({
  to,
  children,
  delay,
}: {
  to: string;
  children: React.ReactNode;
  delay: string;
}) {
  return (
    <Link
      to={to}
      className="px-4 py-2 rounded-full text-black font-semibold text-[14px] tracking-wide transition-all duration-200 anim-fade-up no-underline hover:scale-[1.04]"
      style={{
        animationDelay: delay,
        border: '1.5px solid rgba(255,255,255,0.75)',
        boxShadow: '0 0 12px rgba(255,255,255,0.55), 0 0 4px rgba(255,255,255,0.4)',
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {children}
    </Link>
  );
}

/** Black pill CTA button — glowing, larger */
function PillButton({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2.5 bg-black text-white rounded-full pl-5 pr-1.5 py-1.5 text-[14px] font-semibold transition-all duration-300 hover:bg-black/85 hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ boxShadow: '0 0 18px rgba(0,0,0,0.55), 0 0 6px rgba(0,0,0,0.35)' }}
    >
      <span className="leading-none">{children}</span>
      <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0">
        <ArrowRight className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
      </span>
    </button>
  );
}

// ─── Grid decorations ────────────────────────────────────────────────────────

function GridLines() {
  const verticalPositions = ['12.6%', '37.5%', '61.9%', '86.2%'];
  const horizontalPositions = ['32.7%', '71.4%'];

  return (
    <>
      {verticalPositions.map((left, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 h-full w-px bg-black/[0.05] anim-grid-v pointer-events-none"
          style={{ left, animationDelay: `${600 + i * 100}ms` }}
        />
      ))}
      {horizontalPositions.map((top, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 w-full h-px bg-black/[0.05] anim-grid-h pointer-events-none"
          style={{ top, animationDelay: `${800 + i * 150}ms` }}
        />
      ))}
      {horizontalPositions.map((top, hi) =>
        verticalPositions.map((left, vi) => (
          <div
            key={`plus-${hi}-${vi}`}
            className="absolute anim-scale-in pointer-events-none"
            style={{ top, left, animationDelay: `${1000 + (hi * 4 + vi) * 80}ms` }}
          >
            <div className="absolute w-[10px] h-px bg-black/60 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute w-px h-[10px] bg-black/60 -translate-x-1/2 -translate-y-1/2" />
          </div>
        ))
      )}
    </>
  );
}

// ─── SVG connector line ───────────────────────────────────────────────────────

function ConnectorLine({
  x1, y1, x2, y2, delay,
}: {
  x1: string; y1: string; x2: string; y2: string; delay: number;
}) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none anim-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// ─── Halo-style node card ─────────────────────────────────────────────────────

function NodeCard({
  top, left, delay, label, description, slideDir, labelTop, labelLeft,
}: {
  top: string; left: string; delay: number;
  label: string; description: string;
  slideDir: 'left' | 'right';
  labelTop: string; labelLeft: string;
}) {
  return (
    <>
      {/* Square node card */}
      <div
        className="absolute w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-2xl bg-[#2B2644] shadow-lg anim-scale-in flex items-center justify-center"
        style={{ top, left, animationDelay: `${delay}ms` }}
      >
        <Shield className="w-5 h-5 text-white/60" strokeWidth={1.5} />
      </div>
      {/* Label group */}
      <div
        className={`absolute ${slideDir === 'left' ? 'anim-slide-left' : 'anim-slide-right'}`}
        style={{ top: labelTop, left: labelLeft, animationDelay: `${delay - 400}ms` }}
      >
        <span className="text-black text-[13px] font-medium leading-[15.6px] whitespace-nowrap">
          {label}
        </span>
        <p className="text-black/50 text-[11px] leading-[14px] mt-[4px] max-w-[160px]">
          {description}
        </p>
      </div>
    </>
  );
}

// ─── Main Landing component ───────────────────────────────────────────────────

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const wallet = useWallet();

  const isConnected = wallet.status === 'connected';
  const isConnecting = wallet.status === 'detecting' || wallet.status === 'connecting';
  const hasError = wallet.status === 'error';

  const walletLabel = isConnecting
    ? 'Connecting…'
    : isConnected
    ? shortAddr(wallet.shieldedAddress) || 'Connected'
    : hasError
    ? 'Retry Connect'
    : 'Connect Wallet';

  const handleWalletAction = () => {
    if (isConnected) wallet.disconnect();
    else if (!isConnecting) wallet.connect();
  };

  // Nav items mapped to existing routes
  const navItems = [
    { label: 'Features',    to: '/features' },
    { label: 'About',  to: '/about' },
  ];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#F5F5F5]">

      {/* ── Layer 0: Background Video ──────────────────────────── */}
      <video
        className="absolute inset-0 w-full h-full object-cover anim-fade-in"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_115057_94c3699b-0fd1-4124-bcf3-3626bb8c1f77.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Left-side brightness glow — makes text readable, center glow untouched */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 80% at 18% 45%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.30) 45%, transparent 75%)',
        }}
      />

      {/* ── Content Layer ─────────────────────────────────────── */}
      <div className="relative z-10 w-full h-full">

        {/* ── Navigation ──────────────────────────────────────── */}
        <nav className="absolute top-0 left-0 w-full flex items-center px-5 md:px-[35px] py-5 md:py-[27px]">

          {/* Left: wordmark + desktop links */}
          <div className="flex items-center gap-[40px]">
            <Link
              to="/"
              className="flex items-center gap-2.5 no-underline anim-fade-up"
              style={{ animationDelay: '200ms' }}
            >
              <div className="w-8 h-8 rounded-xl bg-[#2B2644] flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-black text-[15px] font-medium leading-tight tracking-tight">
                  CredShield
                </div>
                <div className="text-black/45 text-[10px] leading-none tracking-widest uppercase">
                  Midnight ZK · Preprod
                </div>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-[40px]">
              {navItems.map((item, i) => (
                <NavLink key={item.to} to={item.to} delay={`${350 + i * 100}ms`}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right: wallet pill + hamburger */}
          <div className="ml-auto flex items-center gap-3">
            {/* Desktop wallet */}
            <div
              className="hidden lg:block anim-slide-right"
              style={{ animationDelay: '600ms' }}
            >
              <button
                onClick={handleWalletAction}
                disabled={isConnecting}
                className={`flex items-center gap-2 rounded-full pl-3 pr-1 py-1.5 text-[13px] font-medium transition-all duration-300 hover:scale-[1.03] ${
                  isConnected
                    ? 'bg-[#2B2644] text-white hover:bg-[#3d3560]'
                    : hasError
                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                    : 'bg-black text-white hover:bg-black/80'
                } disabled:opacity-50`}
                style={{ boxShadow: isConnected ? '0 0 14px rgba(43,38,68,0.5)' : '0 0 14px rgba(0,0,0,0.45)' }}
              >
                <Wallet className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="leading-none">{walletLabel}</span>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  isConnected ? 'bg-white/20' : 'bg-white'
                }`}>
                  {isConnected
                    ? <Lock className="w-3 h-3 text-white" strokeWidth={2} />
                    : hasError
                    ? <Zap className="w-3 h-3 text-red-600" strokeWidth={2} />
                    : <ArrowRight className="w-3 h-3 text-black" strokeWidth={2} />
                  }
                </span>
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden relative w-[40px] h-[40px] flex items-center justify-center anim-fade-in"
              style={{ animationDelay: '400ms' }}
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(v => !v)}
            >
              <span className={`absolute transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                menuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
              }`}>
                <Menu className="w-[22px] h-[22px] text-black" strokeWidth={1.5} />
              </span>
              <span className={`absolute transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
              }`}>
                <X className="w-[22px] h-[22px] text-black" strokeWidth={1.5} />
              </span>
            </button>
          </div>
        </nav>

        {/* ── Mobile Menu Overlay ──────────────────────────────── */}
        <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          menuOpen ? 'visible' : 'invisible'
        }`}>
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-[#F5F5F5]/95 backdrop-blur-md transition-opacity duration-500 ${
              menuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setMenuOpen(false)}
          />

          {/* Panel */}
          <div className={`relative h-full flex flex-col px-5 pt-24 pb-10 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            {/* Close */}
            <button
              className="absolute top-5 right-5 w-[40px] h-[40px] flex items-center justify-center"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <X className="w-[22px] h-[22px] text-black" strokeWidth={1.5} />
            </button>

            {/* Nav list */}
            <div className="flex flex-col gap-8">
              {navItems.map((item, i) => (
                <div
                  key={item.to}
                  className="transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                  style={{
                    transitionDelay: menuOpen ? `${150 + i * 75}ms` : '0ms',
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'translateX(0)' : 'translateX(-24px)',
                  }}
                >
                  <Link
                    to={item.to}
                    className="text-black text-[28px] font-medium leading-[1.2] tracking-tight hover:text-[#2B2644] transition-colors no-underline"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* Wallet block — pinned bottom */}
            <div
              className="mt-auto pt-10 border-t border-black/10 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
              style={{
                transitionDelay: menuOpen ? '450ms' : '0ms',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-[15px] h-[15px] text-black/60" strokeWidth={1.5} />
                <span className="text-black/60 text-[13px]">
                  {shortAddr(wallet.shieldedAddress) || '—'}
                </span>
                <span className={`text-[13px] font-medium ${isConnected ? 'text-[#2B2644]' : 'text-black/40'}`}>
                  {isConnected ? '[ CONNECTED ]' : hasError ? '[ ERROR ]' : '[ DISCONNECTED ]'}
                </span>
              </div>
              <PillButton onClick={handleWalletAction} disabled={isConnecting}>
                {walletLabel}
              </PillButton>
            </div>
          </div>
        </div>

        {/* ── H1 Heading ───────────────────────────────────────── */}
        <div
          className="absolute anim-fade-up flex items-center gap-4
                     top-[140px] sm:top-[160px] md:top-[178px]
                     left-5 md:left-[35px]"
          style={{ animationDelay: '400ms' }}
        >
          {/* Shield logo icon */}
          <div
            className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-[#2B2644] flex items-center justify-center shrink-0"
            style={{ boxShadow: '0 0 32px rgba(43,38,68,0.8), 0 0 12px rgba(255,255,255,0.25)' }}
          >
            <Shield className="w-7 h-7 md:w-10 md:h-10 text-white" strokeWidth={1.5} />
          </div>
          {/* Glowing heading */}
          <h1
            className="font-bold text-black leading-[1em]
                       text-[32px] sm:text-[48px] md:text-[72px]
                       max-w-[240px] sm:max-w-[360px] md:max-w-[500px]"
            style={{
              letterSpacing: '-0.03em',
              textShadow: '0 0 40px rgba(255,255,255,0.95), 0 0 80px rgba(255,255,255,0.7), 0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            CredShield
          </h1>
        </div>

        {/* ── Status badges (mapped from original hero badges) ─── */}
        <div
          className="absolute anim-fade-up flex flex-wrap gap-2
                     top-[calc(140px+120px)] sm:top-[calc(160px+160px)] md:top-[calc(178px+210px)]
                     left-5 md:left-[35px]"
          style={{ animationDelay: '500ms' }}
        >
          <span className="flex items-center gap-1.5 bg-black/5 border border-black/10 rounded-full px-3 py-1 text-[11px] font-medium text-black/70">
            <Lock className="w-3 h-3" strokeWidth={2} />
            ZK CIRCUIT PROVER READY
          </span>
          <span className="flex items-center gap-1.5 bg-[#2B2644]/10 border border-[#2B2644]/20 rounded-full px-3 py-1 text-[11px] font-medium text-[#2B2644]">
            <Zap className="w-3 h-3" strokeWidth={2} />
            MIDNIGHT NETWORK
          </span>
        </div>

        {/* ── Grid lines + plus marks ───────────────────────────── */}
        <GridLines />

        {/* ── Central Nodes (md+ only) ─────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          {/* Node 1 — CORE_ENTITY */}
          <NodeCard
            top="27%" left="60%" delay={1500}
            label="[ CORE_ENTITY ]"
            description="Neural node processing real-time credential streams."
            slideDir="left" labelTop="11%" labelLeft="26%"
          />
          {/* Node 2 — LUMINOUS_INSIGHT */}
          <NodeCard
            top="58%" left="32%" delay={1800}
            label="[ LUMINOUS_INSIGHT ]"
            description="ZK-engine synthesizing proof payloads off-chain."
            slideDir="left" labelTop="76%" labelLeft="3%"
          />
          {/* Node 3 — CONNECTIVITY */}
          <NodeCard
            top="63%" left="50%" delay={2100}
            label="[ CONNECTIVITY ]"
            description="Latency-free verification across Midnight network."
            slideDir="right" labelTop="50%" labelLeft="78%"
          />

          {/* Connector lines — CORE_ENTITY elbow */}
          <ConnectorLine x1="38%" y1="14%" x2="52%" y2="14%" delay={1200} />
          <ConnectorLine x1="52%" y1="14%" x2="60%" y2="27%" delay={1400} />
          {/* LUMINOUS_INSIGHT elbow */}
          <ConnectorLine x1="32%" y1="58%" x2="20%" y2="74%" delay={1500} />
          <ConnectorLine x1="20%" y1="74%" x2="6%"  y2="74%" delay={1700} />
          {/* CONNECTIVITY elbow */}
          <ConnectorLine x1="78%" y1="53%" x2="63%" y2="53%" delay={1800} />
          <ConnectorLine x1="63%" y1="53%" x2="50%" y2="63%" delay={2000} />
        </div>

        {/* ── Bottom Row ───────────────────────────────────────── */}
        <div className="absolute bottom-5 md:bottom-[35px] left-5 md:left-[35px] right-5 md:right-[35px]
                        flex flex-col md:flex-row items-start md:items-end justify-between gap-5 md:gap-0">

          {/* Left: primary CTA — Launch Live Demo */}
          <div
            className="flex flex-col sm:flex-row gap-3 anim-fade-up"
            style={{ animationDelay: '900ms' }}
          >
            <Link to="/demo" className="no-underline">
              <PillButton>Launch Live Demo</PillButton>
            </Link>
            <Link to="/architecture" className="no-underline">
              <button
                className="flex items-center gap-2 rounded-full pl-5 pr-4 py-2 text-[14px] font-semibold text-black transition-all duration-300 hover:scale-[1.04]"
                style={{
                  border: '1.5px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 0 18px rgba(255,255,255,0.6), 0 0 6px rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.22)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                Explore Architecture
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </Link>
          </div>

          {/* Right: info card — hidden below sm */}
          <div
            className="relative max-w-[280px] hidden sm:block anim-slide-right"
            style={{ animationDelay: '1100ms' }}
          >
            {/* Halo card: rounded-2xl, #2B2644 bg, white text */}
            <div className="rounded-2xl bg-[#2B2644] p-5 shadow-xl">
              {/* Badge */}
              <span className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1 text-white/70 text-[11px] font-medium mb-3">
                <Shield className="w-3 h-3" strokeWidth={2} />
                CREDSHIELD — A ZK ECOSYSTEM
              </span>

              {/* Copy */}
              <p className="text-white/80 text-[13px] leading-[18px] mb-4">
                Issue, verify, and revoke tamper-proof credentials on the
                Midnight Blockchain. Prove ownership off-chain via Compact ZK
                circuits — secret keys never leave your browser.
              </p>

              {/* Link to Architecture */}
              <Link
                to="/architecture"
                className="flex items-center gap-1.5 text-[#AFDDFF] text-[13px] font-medium leading-[15.6px] hover:underline no-underline"
              >
                VIEW_ARCHITECTURE
                <ArrowRight className="w-3 h-3" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
