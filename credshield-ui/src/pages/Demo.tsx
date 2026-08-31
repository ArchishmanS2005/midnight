import React, { useEffect, useState, useRef } from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Lock, Shield, EyeOff, Plus, AlertTriangle, X } from 'lucide-react';
import { CredShieldCard, CredShieldHero } from '../components';
import { useDeployedCredShieldContext } from '../contexts';
import { useWallet } from '../contexts/WalletContext';
import { type CredShieldDeployment } from '../contexts';
import { type Observable } from 'rxjs';

export default function Demo() {
  const credShieldManager = useDeployedCredShieldContext();
  const wallet = useWallet();
  const [deployments, setDeployments] = useState<Array<Observable<CredShieldDeployment>>>([]);
  const [walletErrDismissed, setWalletErrDismissed] = useState(false);

  const activeCardsRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sub = credShieldManager.deployments$.subscribe(setDeployments);
    return () => sub.unsubscribe();
  }, [credShieldManager]);

  // Reset dismiss when error changes
  useEffect(() => {
    setWalletErrDismissed(false);
  }, [wallet.errorMessage]);

  const handleDeployNew = () => {
    credShieldManager.resolve();
    scrollToActiveCard();
  };

  const handleJoinContract = (contractAddress: string) => {
    credShieldManager.resolve(contractAddress);
    scrollToActiveCard();
  };

  const handleRetryConnect = async () => {
    await wallet.connect();
    setTimeout(() => {
      credShieldManager.retry();
    }, 500);
  };

  const scrollToActiveCard = () => {
    setTimeout(() => {
      activeCardsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const scrollToGuide = () => {
    guideRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const guideSteps = [
    {
      title: '1. How Compact Contracts Are Compiled',
      content: (
        <>
          <p className="text-black/55 text-[13px] leading-relaxed mb-3">
            The contract is written in Compact (
            <code className="text-[#2B2644] font-mono">contract/src/credshield.compact</code>). It defines the{' '}
            <code className="text-[#2B2644] font-mono">CredentialState</code> enum, ledger counters, and zero-knowledge
            circuit methods:
          </p>
          <pre className="bg-[#2B2644] rounded-xl p-4 text-[#AFDDFF] font-mono text-[12px] overflow-x-auto">{`cd contract
yarn compact # Compiles Compact contract into ZK proving keys & TypeScript bindings
yarn build   # Builds @midnight-ntwrk/credshield-contract`}</pre>
        </>
      ),
    },
    {
      title: '2. Running the Interactive CLI Runner',
      content: (
        <>
          <p className="text-black/55 text-[13px] leading-relaxed mb-3">
            Credential issuance and verification can be performed directly via the Web UI (using{' '}
            <strong>Lace / 1AM Wallet</strong>) or via CLI:
          </p>
          <pre className="bg-[#2B2644] rounded-xl p-4 text-[#AFDDFF] font-mono text-[12px] overflow-x-auto">{`cd credshield-cli
yarn build
npm run preprod-remote # Connects to Midnight Preprod Testnet & launches CLI menu`}</pre>
        </>
      ),
    },
    {
      title: '3. Contract Address Format & Testnet Verification',
      content: (
        <p className="text-black/55 text-[13px] leading-relaxed">
          Midnight contract addresses are 32 bytes long (64 hex characters). Example:
          <br />
          <code className="text-[#2B2644] font-mono break-all">
            0200dbf964f541e1950883f5b2f539b66fd6111e46ce8e6e9551fbdd180114d5
          </code>
        </p>
      ),
    },
    {
      title: '4. Starting the Proof Server',
      content: (
        <>
          <p className="text-black/55 text-[13px] leading-relaxed mb-3">
            The Proof Server handles ZK proof generation. It starts automatically with Docker Compose:
          </p>
          <pre className="bg-[#2B2644] rounded-xl p-4 text-[#AFDDFF] font-mono text-[12px] overflow-x-auto">{`# Start all services (node + indexer + proof server)
docker compose -f standalone.yml up -d

# Verify proof server is running
curl http://localhost:6300`}</pre>
          <p className="text-[#2B2644] text-[13px] mt-3 font-medium">
            ⚡ Note: ZK proof generation takes 30–60 seconds per circuit call. A loading indicator is shown during proof
            generation.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="py-2">
      <CredShieldHero onIssueClick={handleDeployNew} onVerifyClick={scrollToActiveCard} onGuideClick={scrollToGuide} />

      {/* Privacy Model Banner */}
      <div className="mb-6 bg-[#2B2644]/6 border border-[#2B2644]/15 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <Lock className="w-4 h-4 text-[#2B2644]" strokeWidth={2} />
            <span className="text-[#2B2644] text-[12px] font-medium tracking-wider uppercase">Privacy Model</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/5 border border-black/8 text-black/55 text-[11px]">
              <EyeOff className="w-3 h-3" strokeWidth={2} />
              secretKey: PRIVATE WITNESS — never disclosed on-chain
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/5 border border-black/8 text-black/55 text-[11px]">
              <Shield className="w-3 h-3" strokeWidth={2} />
              issuerAuthority: PUBLIC commitment (one-way hash)
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/5 border border-black/8 text-black/55 text-[11px]">
              <Lock className="w-3 h-3" strokeWidth={2} />
              ZK proof: generated locally, never raw key
            </span>
          </div>
        </div>
      </div>

      {/* Wallet Warning */}
      {wallet.status === 'error' && wallet.errorMessage && !walletErrDismissed && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" strokeWidth={2} />
          <div className="flex-1 text-amber-800 text-[13px] leading-relaxed">
            {wallet.errorMessage} Please install the Lace or 1AM Wallet browser extension and connect.
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRetryConnect}
              className="text-amber-700 text-[12px] font-medium hover:text-amber-900 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => setWalletErrDismissed(true)}
              className="text-amber-400 hover:text-amber-600 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {/* Active Credential Instances */}
      <div className="mb-10" ref={activeCardsRef}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h2 className="text-black text-[1.4rem] font-medium tracking-[-0.02em]">
            Active Credential Instances ({deployments.length})
          </h2>
          <button
            onClick={handleDeployNew}
            className="flex items-center gap-1.5 border border-black/15 text-black/70 rounded-xl px-4 py-2 text-[13px] font-medium hover:border-[#2B2644]/30 hover:text-[#2B2644] transition-all duration-200 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Deploy Credential Contract
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {deployments.map((deployment$, idx) => (
            <div key={`deployment-${idx}`} data-testid={`credshield-card-${idx}`}>
              <CredShieldCard
                deployment$={deployment$}
                onQuickJoinPreprod={handleJoinContract}
                onRetryConnect={handleRetryConnect}
              />
            </div>
          ))}
          {deployments.length === 0 && (
            <div data-testid="default-credshield-card">
              <CredShieldCard onQuickJoinPreprod={handleJoinContract} onRetryConnect={handleRetryConnect} />
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black/[0.06] mb-10" />

      {/* Guide Section */}
      <div ref={guideRef} className="mb-6">
        <h2 className="text-black text-[1.4rem] font-medium tracking-[-0.02em] mb-6">
          Smart Contract & CLI Execution Guide
        </h2>

        <div className="flex flex-col gap-3">
          {guideSteps.map((step) => (
            <Accordion
              key={step.title}
              sx={{
                bgcolor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '16px !important',
                boxShadow: 'none',
                color: '#000',
                mb: 0,
                '&:before': { display: 'none' },
                '&.Mui-expanded': { borderColor: 'rgba(43,38,68,0.2)' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'rgba(0,0,0,0.4)' }} />} sx={{ px: 3, py: 1 }}>
                <span style={{ fontWeight: 500, fontSize: '14px', color: '#000' }}>{step.title}</span>
              </AccordionSummary>
              <AccordionDetails sx={{ borderTop: '1px solid rgba(0,0,0,0.06)', px: 3, pt: 2.5, pb: 3 }}>
                {step.content}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
}
