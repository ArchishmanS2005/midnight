import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Lock, ArrowRight, ExternalLink } from 'lucide-react';

// Inline GitHub SVG (lucide-react v1 does not export Github)
const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
import { useWallet } from '../contexts/WalletContext';

export default function AppLayout() {
  const { pathname } = useLocation();
  const wallet = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/',             label: 'Home' },
    { to: '/features',     label: 'Features' },
    { to: '/architecture', label: 'Architecture' },
    { to: '/demo',         label: 'Live Demo' },
    { to: '/about',        label: 'About' },
  ];

  const isConnected = wallet.status === 'connected';
  const isConnecting = wallet.status === 'detecting' || wallet.status === 'connecting';
  const hasError = wallet.status === 'error';

  const shortAddr = (addr: string | null): string => {
    if (!addr) return '';
    if (addr.length <= 16) return addr;
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  };

  const walletLabel = isConnecting
    ? 'Connecting…'
    : isConnected
    ? shortAddr(wallet.shieldedAddress) || 'Connected'
    : hasError
    ? 'Retry'
    : 'Connect Wallet';

  const handleWallet = () => {
    if (isConnected) wallet.disconnect();
    else if (!isConnecting) wallet.connect();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#F5F5F5]/90 backdrop-blur-md border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-[35px] py-4 flex items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#2B2644] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-black text-[15px] font-medium leading-tight tracking-tight">
                CredShield
              </div>
              <div className="text-black/40 text-[10px] leading-none tracking-widest uppercase">
                Midnight ZK · Preprod
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1 ml-10">
            {links.map((l) => {
              const isActive = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 no-underline ${
                    isActive
                      ? 'bg-[#2B2644] text-white'
                      : 'text-black/60 hover:text-black hover:bg-black/5'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: ZK chip + wallet + hamburger */}
          <div className="ml-auto flex items-center gap-3">
            {/* ZK Privacy chip — desktop */}
            <span className="hidden sm:flex items-center gap-1.5 bg-[#2B2644]/8 border border-[#2B2644]/15 rounded-full px-2.5 py-1 text-[11px] font-medium text-[#2B2644]">
              <Lock className="w-3 h-3" strokeWidth={2} />
              ZK Privacy
            </span>

            {/* Wallet button */}
            <button
              onClick={handleWallet}
              disabled={isConnecting}
              className={`flex items-center gap-2 rounded-full pl-3 pr-1 py-1 text-[13px] font-medium transition-all duration-200 disabled:opacity-50 ${
                isConnected
                  ? 'bg-[#2B2644] text-white hover:bg-[#3d3560]'
                  : hasError
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-black text-white hover:bg-black/80'
              }`}
            >
              <span className="leading-none">{walletLabel}</span>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                isConnected ? 'bg-white/20' : 'bg-white'
              }`}>
                <ArrowRight className={`w-3 h-3 ${isConnected ? 'text-white' : 'text-black'}`} strokeWidth={2} />
              </span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-black" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ────────────────────────────────────────── */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${mobileOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <div className={`absolute right-0 top-0 h-full w-72 bg-[#F5F5F5] shadow-2xl flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Panel header */}
          <div className="flex items-center justify-between p-5 border-b border-black/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2B2644] flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-black text-[15px] font-medium">CredShield</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5 text-black" strokeWidth={1.5} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col p-4 gap-1 flex-1">
            {links.map((l) => {
              const isActive = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 no-underline flex items-center ${
                    isActive
                      ? 'bg-[#2B2644] text-white'
                      : 'text-black/70 hover:bg-black/5 hover:text-black'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Wallet at bottom */}
          <div className="p-4 border-t border-black/[0.06]">
            <span className="flex items-center gap-1.5 mb-3 text-[11px] text-black/40 font-medium">
              <Lock className="w-3 h-3" strokeWidth={2} />
              ZK Privacy — secretKey never exposed
            </span>
            <button
              onClick={() => { handleWallet(); setMobileOpen(false); }}
              disabled={isConnecting}
              className={`w-full flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-200 disabled:opacity-50 ${
                isConnected ? 'bg-[#2B2644] text-white' : 'bg-black text-white hover:bg-black/80'
              }`}
            >
              <span>{walletLabel}</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 md:px-[35px] pt-8 pb-16">
        <Outlet />
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-black/[0.06] bg-[#F5F5F5] py-8 px-5 md:px-[35px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#2B2644] flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-black text-[14px] font-medium">CredShield Protocol</span>
            <span className="text-black/30 text-[13px]">· Midnight Blockchain · ZK Privacy</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="https://docs.midnight.network"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-black/50 hover:text-black text-[13px] transition-colors no-underline"
            >
              Midnight Docs <ExternalLink className="w-3 h-3" strokeWidth={2} />
            </a>
            <a
              href="https://midnight.network"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-black/50 hover:text-black text-[13px] transition-colors no-underline"
            >
              Midnight Network <ExternalLink className="w-3 h-3" strokeWidth={2} />
            </a>
            <a
              href="https://github.com/ArchishmanS2005/midnight"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-black/50 hover:text-black text-[13px] transition-colors no-underline"
            >
              <GithubIcon />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
