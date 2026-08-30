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
  Chip,
  Alert,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { CredShieldCard, CredShieldHero } from '../components';
import { useDeployedCredShieldContext } from '../contexts';
import { useWallet } from '../contexts/WalletContext';
import { type CredShieldDeployment } from '../contexts';
import { type Observable } from 'rxjs';

export default function Demo() {
  const credShieldManager = useDeployedCredShieldContext();
  const wallet = useWallet();
  const [deployments, setDeployments] = useState<Array<Observable<CredShieldDeployment>>>([]);

  const activeCardsRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);

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

  return (
    <Box sx={{ py: 2 }}>
      <CredShieldHero
        onIssueClick={handleDeployNew}
        onVerifyClick={scrollToActiveCard}
        onGuideClick={scrollToGuide}
      />

      {/* Privacy Model Banner */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: 'rgba(229, 193, 88, 0.06)',
            border: '1px solid rgba(229, 193, 88, 0.2)',
            borderRadius: '14px',
            p: 3,
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
              <LockIcon sx={{ color: '#e5c158', fontSize: 20, flexShrink: 0 }} />
              <Typography variant="subtitle2" sx={{ color: '#e5c158', fontWeight: 800, letterSpacing: '0.05em' }}>
                PRIVACY MODEL
              </Typography>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap">
              <Chip
                icon={<VisibilityOffIcon sx={{ fontSize: 14, color: '#a1a1aa !important' }} />}
                label="secretKey: PRIVATE WITNESS — never disclosed on-chain"
                size="small"
                sx={{ bgcolor: '#18181b', color: '#a1a1aa', border: '1px solid #27272a', fontSize: '0.72rem', height: 'auto', py: 0.5 }}
              />
              <Chip
                icon={<ShieldIcon sx={{ fontSize: 14, color: '#22c55e !important' }} />}
                label="issuerAuthority: PUBLIC commitment (one-way hash)"
                size="small"
                sx={{ bgcolor: '#18181b', color: '#a1a1aa', border: '1px solid #27272a', fontSize: '0.72rem', height: 'auto', py: 0.5 }}
              />
              <Chip
                icon={<LockIcon sx={{ fontSize: 14, color: '#e5c158 !important' }} />}
                label="ZK proof: generated locally, never raw key"
                size="small"
                sx={{ bgcolor: '#18181b', color: '#a1a1aa', border: '1px solid #27272a', fontSize: '0.72rem', height: 'auto', py: 0.5 }}
              />
            </Stack>
          </Stack>
        </Paper>
      </Container>

      {/* Wallet Warning */}
      {wallet.status === 'error' && wallet.errorMessage && (
        <Container maxWidth="lg" disableGutters sx={{ mb: 3 }}>
          <Alert
            severity="warning"
            sx={{ bgcolor: '#1a1600', color: '#fbbf24', border: '1px solid #422006', borderRadius: '12px' }}
            action={
              <Button
                size="small"
                sx={{ color: '#fbbf24', fontWeight: 700 }}
                onClick={handleRetryConnect}
              >
                Retry
              </Button>
            }
          >
            {wallet.errorMessage} Please install the Lace or 1AM Wallet browser extension and connect.
          </Alert>
        </Container>
      )}

      <Container maxWidth="lg" disableGutters sx={{ mb: 6 }} ref={activeCardsRef}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, gap: 2 }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
            Active Credential Instances ({deployments.length})
          </Typography>

          <Button
            variant="outlined"
            size="small"
            onClick={handleDeployNew}
            sx={{
              borderColor: '#27272a',
              color: '#ffffff',
              borderRadius: '8px',
              px: 2,
              '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.05)' },
            }}
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
{`cd credshield-cli
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

        <Accordion sx={{ bgcolor: '#09090c', border: '1px solid #18181b', color: '#fff', borderRadius: '14px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>4. Starting the Proof Server</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ color: '#a1a1aa', borderTop: '1px solid #18181b', p: 3 }}>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>
              The Proof Server handles ZK proof generation. It starts automatically with Docker Compose:
            </Typography>
            <Box component="pre" sx={{ bgcolor: '#030304', p: 2, borderRadius: '8px', overflowX: 'auto', border: '1px solid #18181b', fontFamily: 'monospace', fontSize: '0.85rem' }}>
{`# Start all services (node + indexer + proof server)
docker compose -f standalone.yml up -d

# Verify proof server is running
curl http://localhost:6300`}
            </Box>
            <Typography variant="body2" sx={{ mt: 2, color: '#e5c158' }}>
              ⚡ Note: ZK proof generation takes 30–60 seconds per circuit call. A loading indicator is shown during proof generation.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
