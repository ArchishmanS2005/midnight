import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Container,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MainLayout, CredShieldCard, CredShieldHero } from './components';
import { useDeployedCredShieldContext } from './contexts';
import { useWallet } from './contexts/WalletContext';
import { type CredShieldDeployment } from './contexts';
import { type Observable } from 'rxjs';

const App: React.FC = () => {
  const credShieldManager = useDeployedCredShieldContext();
  const wallet = useWallet();
  const [deployments, setDeployments] = useState<Array<Observable<CredShieldDeployment>>>([]);

  const activeCardsRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  useEffect(() => {
    const sub = credShieldManager.deployments$.subscribe(setDeployments);
    return () => sub.unsubscribe();
  }, [credShieldManager]);

  const handleDeployNew = () => {
    credShieldManager.resolve();
    scrollToActiveCard();
  };

  const handleJoinContract = (contractAddress: string) => {
    credShieldManager.resolve(contractAddress as any);
    scrollToActiveCard();
  };

  const handleRetryConnect = () => {
    if (wallet.status !== 'connected') {
      void wallet.connect();
    } else {
      credShieldManager.retry();
    }
  };

  const scrollToActiveCard = () => {
    setTimeout(() => {
      activeCardsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const scrollToGuide = () => {
    guideRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <MainLayout onDeployContract={handleDeployNew} onJoinContract={handleJoinContract}>
      {/* Enhanced Hero Header */}
      <CredShieldHero
        onIssueClick={handleDeployNew}
        onVerifyClick={scrollToActiveCard}
        onGuideClick={scrollToGuide}
      />

      {/* Credential Workspaces Section */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 6 }} ref={activeCardsRef}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
            Active Credential Instances ({deployments.length})
          </Typography>

          <Button
            variant="outlined"
            size="small"
            onClick={handleDeployNew}
            sx={{ borderColor: '#27272a', color: '#ffffff', borderRadius: '8px', px: 2, '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.05)' } }}
          >
            + Deploy Credential Contract
          </Button>
        </Stack>

        <Stack spacing={4}>
          {deployments.map((deployment$, idx) => (
            <Box key={`deployment-${idx}`} data-testid={`credshield-card-${idx}`}>
              <CredShieldCard
                deployment$={deployment$}
                onQuickJoinPreprod={handleJoinContract}
                onRetryConnect={handleRetryConnect}
              />
            </Box>
          ))}

          {deployments.length === 0 && (
            <Box data-testid="default-credshield-card">
              <CredShieldCard
                onQuickJoinPreprod={handleJoinContract}
                onRetryConnect={handleRetryConnect}
              />
            </Box>
          )}
        </Stack>
      </Container>

      <Divider sx={{ my: 6, borderColor: '#18181b' }} />

      {/* Contract & CLI Guide Section */}
      <Box ref={guideRef} sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, letterSpacing: '-0.02em', color: '#ffffff' }}>
          Smart Contract & CLI Execution Guide
        </Typography>

        <Accordion sx={{ bgcolor: '#09090c', border: '1px solid #18181b', color: '#fff', borderRadius: '14px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>1. How Compact Contracts Are Compiled</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ color: '#a1a1aa', borderTop: '1px solid #18181b', p: 3 }}>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>
              The contract is written in Compact (<code>contract/src/credshield.compact</code>).
              It defines the <code>CredentialState</code> enum, ledger counters, and zero-knowledge circuit methods:
            </Typography>
            <Box component="pre" sx={{ bgcolor: '#030304', p: 2, borderRadius: '8px', overflowX: 'auto', border: '1px solid #18181b', fontFamily: 'monospace', fontSize: '0.85rem' }}>
{`cd contract
yarn compact # Compiles Compact contract into ZK proving keys & TypeScript bindings
yarn build   # Builds @midnight-ntwrk/credshield-contract`}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ bgcolor: '#09090c', border: '1px solid #18181b', color: '#fff', borderRadius: '14px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>2. Running the Interactive CLI Runner</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ color: '#a1a1aa', borderTop: '1px solid #18181b', p: 3 }}>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>
              Credential issuance and verification can be performed directly via the Web UI (using <strong>Lace / 1AM Wallet</strong>) or via CLI:
            </Typography>
            <Box component="pre" sx={{ bgcolor: '#030304', p: 2, borderRadius: '8px', overflowX: 'auto', border: '1px solid #18181b', fontFamily: 'monospace', fontSize: '0.85rem' }}>
{`cd bboard-cli
yarn build
npm run preprod-remote # Connects to Midnight Preprod Testnet & launches CLI menu`}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ bgcolor: '#09090c', border: '1px solid #18181b', color: '#fff', borderRadius: '14px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>3. Contract Address Format & Testnet Verification</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ color: '#a1a1aa', borderTop: '1px solid #18181b', p: 3 }}>
            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
              Midnight contract addresses are 32 bytes long (64 hex characters). Example:
              <br />
              <code style={{ color: '#ffffff' }}>0200dbf964f541e1950883f5b2f539b66fd6111e46ce8e6e9551fbdd180114d5</code>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </MainLayout>
  );
};

export default App;
