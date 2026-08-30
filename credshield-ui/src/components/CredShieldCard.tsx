import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  TextField,
  Tooltip,
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ShieldIcon from '@mui/icons-material/Shield';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BlockIcon from '@mui/icons-material/Block';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { type Observable } from 'rxjs';
import { type CredShieldDeployment } from '../contexts';
import { type CredShieldDerivedState } from '@midnight-ntwrk/credshield-api';
import { CredentialState } from '@midnight-ntwrk/credshield-contract';

export type CredShieldCardProps = {
  deployment$?: Observable<CredShieldDeployment>;
  onQuickJoinPreprod?: (contractAddress: string) => void;
  onRetryConnect?: () => void;
};

// ZK proof stage labels for the loading indicator
const ZK_STAGES = [
  'Initializing ZK circuit…',
  'Loading proving keys…',
  'Generating witness…',
  'Computing ZK proof… (est. 30–60s)',
  'Submitting proof to chain…',
];

const useZkStageRotation = (active: boolean) => {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (!active) { setStage(0); return; }
    const interval = setInterval(() => {
      setStage((s) => (s + 1) % ZK_STAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [active]);
  return ZK_STAGES[stage];
};

export const CredShieldCard: React.FC<CredShieldCardProps> = ({
  deployment$,
  onRetryConnect,
}) => {
  const [deployment, setDeployment] = useState<CredShieldDeployment | undefined>(undefined);
  const [derivedState, setDerivedState] = useState<CredShieldDerivedState | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Form input state for credential issuance
  const [titleInput, setTitleInput] = useState<string>('BSc Computer Science & ZK Cryptography');

  const zkStageLabel = useZkStageRotation(isSubmitting);

  useEffect(() => {
    if (!deployment$) return;
    const sub = deployment$.subscribe((d) => {
      setDeployment(d);
      if (d.status === 'deployed') {
        const stateSub = d.api.state$.subscribe(setDerivedState);
        return () => stateSub.unsubscribe();
      }
    });
    return () => sub.unsubscribe();
  }, [deployment$]);

  const copyAddress = () => {
    if (deployment?.status === 'deployed') {
      navigator.clipboard.writeText(deployment.api.deployedContractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRandomBytes = (len: number): Uint8Array => {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return arr;
  };

  const handleIssueCredential = async () => {
    if (!deployment || deployment.status !== 'deployed') return;
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      setActionMessage('');
      const rawId = getRandomBytes(32);
      await deployment.api.issueCredential(rawId, titleInput.trim());
      setActionMessage('✅ Credential successfully issued and recorded on Midnight!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to issue credential';
      setErrorMsg(`Issuance failed: ${msg}. Check wallet connection and proof server (port 6300).`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCredential = async () => {
    if (!deployment || deployment.status !== 'deployed' || !derivedState?.credentialId) return;
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      setActionMessage('');
      const idBytes = Uint8Array.from(Buffer.from(derivedState.credentialId, 'hex'));
      await deployment.api.verifyCredential(idBytes);
      setActionMessage('✅ Credential verified via ZK Proof! secretKey never left your device. totalVerified counter updated on-chain.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to verify credential';
      setErrorMsg(`Verification failed: ${msg}. Ensure the credential ID matches and the proof server is running.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeCredential = async () => {
    if (!deployment || deployment.status !== 'deployed') return;
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      setActionMessage('');
      await deployment.api.revokeCredential();
      setActionMessage('✅ Credential revoked on-chain by issuer authority!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to revoke credential';
      setErrorMsg(`Revocation failed: ${msg}. Only the authorized issuer can revoke this credential.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!deployment) {
    return (
      <Card sx={{ bgcolor: '#09090c', color: '#fff', borderRadius: '16px', border: '1px solid #18181b', p: 4, textAlign: 'center' }}>
        <CardContent sx={{ py: 3 }}>
          <CircularProgress size={32} sx={{ color: '#e5c158', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#ffffff' }}>
            Initializing CredShield…
          </Typography>
          <Typography variant="body2" sx={{ color: '#71717a', mb: 3 }}>
            Connecting to Midnight network and loading ZK circuit artifacts.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (deployment.status === 'in-progress') {
    return (
      <Card sx={{ bgcolor: '#09090c', color: '#fff', borderRadius: '16px', border: '1px solid #18181b', p: 4, textAlign: 'center' }}>
        <CardContent sx={{ py: 3 }}>
          <CircularProgress size={40} thickness={3} sx={{ color: '#e5c158', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#ffffff' }}>
            Deploying Contract & Loading ZK Circuits
          </Typography>
          <LinearProgress sx={{ mb: 2, borderRadius: 1, bgcolor: '#18181b', '& .MuiLinearProgress-bar': { bgcolor: '#e5c158' } }} />
          <Typography variant="body2" sx={{ color: '#71717a', mb: 1 }}>
            Connecting wallet → Loading circuit proving keys → Deploying contract…
          </Typography>
          <Chip
            icon={<LockIcon sx={{ fontSize: 14, color: '#a1a1aa !important' }} />}
            label="🔒 secretKey: PRIVATE WITNESS — never leaves your device"
            size="small"
            sx={{ bgcolor: '#18181b', color: '#a1a1aa', border: '1px solid #27272a', fontSize: '0.72rem' }}
          />
        </CardContent>
      </Card>
    );
  }

  if (deployment.status === 'failed') {
    return (
      <Card sx={{ bgcolor: '#09090c', color: '#fff', borderRadius: '16px', border: '1px solid #3b1212', p: 4 }}>
        <CardContent sx={{ py: 3 }}>
          <Alert severity="error" sx={{ mb: 3, bgcolor: '#180e0e', color: '#f87171', border: '1px solid #3b1212', borderRadius: '10px' }}>
            <strong>Connection Failed:</strong> {String(deployment.error ?? 'Unknown error')}
            <br /><br />
            <strong>Troubleshooting:</strong>
            <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
              <li>Ensure Lace or 1AM Wallet is installed and unlocked</li>
              <li>Run: <code>docker compose -f standalone.yml up -d</code></li>
              <li>Verify proof server: <code>curl http://localhost:6300</code></li>
              <li>Set wallet network to &quot;Undeployed&quot;</li>
            </ul>
          </Alert>
          <Button
            variant="outlined"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={onRetryConnect}
            sx={{ borderColor: '#52525b', color: '#ffffff', borderRadius: '10px', px: 3, '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' } }}
          >
            Connect Wallet & Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isUninit = derivedState?.credentialState === CredentialState.UNINITIALIZED;
  const isActive = derivedState?.credentialState === CredentialState.ACTIVE;
  const isRevoked = derivedState?.credentialState === CredentialState.REVOKED;

  const totalIssued = Number(derivedState?.totalIssued ?? 0n);
  const totalVerified = Number(derivedState?.totalVerified ?? 0n);

  return (
    <Card sx={{ bgcolor: '#09090c', color: '#fff', borderRadius: '16px', border: '1px solid #18181b', boxShadow: '0 8px 32px rgba(0,0,0,0.8)', p: 1 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3.5 } }}>
        {/* Header Badges */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2.5, gap: 1 }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <ShieldIcon sx={{ color: '#ffffff', fontSize: 18 }} />
            <Typography variant="caption" sx={{ color: '#a1a1aa', fontWeight: 700, letterSpacing: '0.1em' }}>
              ZERO-KNOWLEDGE VERIFIABLE CREDENTIAL
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            {isUninit && <Chip label="UNINITIALIZED" size="small" sx={{ bgcolor: '#27272a', color: '#e4e4e7', fontWeight: 700, fontSize: '0.7rem' }} />}
            {isActive && <Chip label="CREDENTIAL ACTIVE" size="small" sx={{ bgcolor: '#ffffff', color: '#000000', fontWeight: 800, fontSize: '0.7rem' }} icon={<VerifiedUserIcon sx={{ color: '#000 !important' }} />} />}
            {isRevoked && <Chip label="REVOKED" size="small" sx={{ bgcolor: '#18181b', color: '#ef4444', border: '1px solid #7f1d1d', fontWeight: 700, fontSize: '0.7rem' }} icon={<BlockIcon sx={{ color: '#ef4444 !important' }} />} />}
          </Stack>
        </Stack>

        {/* Privacy Label */}
        <Tooltip title="The secretKey witness is computed locally in the ZK circuit and never transmitted or stored on the ledger." placement="top">
          <Chip
            icon={<VisibilityOffIcon sx={{ fontSize: 13, color: '#a1a1aa !important' }} />}
            label="🔒 secretKey: PRIVATE WITNESS — never disclosed on-chain"
            size="small"
            sx={{ bgcolor: '#121216', color: '#a1a1aa', border: '1px solid #27272a', fontSize: '0.7rem', mb: 2.5, cursor: 'help' }}
          />
        </Tooltip>

        {/* Title */}
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#ffffff', letterSpacing: '-0.03em', fontSize: { xs: '1.4rem', sm: '2.125rem' } }}>
          {derivedState?.credentialMetadata ?? 'CredShield Verifiable Credential'}
        </Typography>

        {/* Address */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ color: '#71717a', fontFamily: 'monospace', wordBreak: 'break-all' }}>
            Contract: <span style={{ color: '#ffffff' }}>{deployment.api.deployedContractAddress}</span>
          </Typography>
          <Button size="small" startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />} sx={{ color: '#a1a1aa', py: 0.2, minWidth: 0 }} onClick={copyAddress}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </Stack>

        {/* ZK Proof Loading Indicator */}
        {isSubmitting && (
          <Box sx={{ mb: 2.5, p: 2.5, bgcolor: '#0a0f1a', border: '1px solid #1e3a5f', borderRadius: '12px' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
              <CircularProgress size={20} thickness={4} sx={{ color: '#60a5fa', flexShrink: 0 }} />
              <Typography variant="body2" sx={{ color: '#60a5fa', fontWeight: 700 }}>
                {zkStageLabel}
              </Typography>
            </Stack>
            <LinearProgress sx={{ borderRadius: 1, bgcolor: '#1e3a5f', '& .MuiLinearProgress-bar': { bgcolor: '#60a5fa' } }} />
            <Typography variant="caption" sx={{ color: '#52525b', mt: 1, display: 'block' }}>
              ZK proof generation runs locally — your private key never leaves this device.
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {errorMsg && (
          <Alert
            severity="error"
            sx={{ mb: 2.5, bgcolor: '#180e0e', color: '#f87171', border: '1px solid #3b1212', borderRadius: '10px' }}
            onClose={() => setErrorMsg('')}
          >
            {errorMsg}
          </Alert>
        )}

        {/* Success State */}
        {actionMessage && !errorMsg && !isSubmitting && (
          <Alert severity="success" sx={{ mb: 2.5, bgcolor: '#0a1a10', color: '#4ade80', border: '1px solid #14532d', borderRadius: '10px' }}>
            {actionMessage}
          </Alert>
        )}

        {/* Issuance Form when UNINITIALIZED */}
        {isUninit && (
          <Box sx={{ bgcolor: '#121216', p: { xs: 2.5, sm: 3.5 }, borderRadius: '12px', border: '1px solid #27272a' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Issue Verifiable Credential</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 3 }}>
              Create and bind a verifiable credential on the Midnight chain. The issuer&apos;s <strong>secretKey</strong> is committed via ZK hash — never exposed publicly.
            </Typography>

            <TextField
              fullWidth
              size="small"
              label="Credential Metadata / Title"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              disabled={isSubmitting}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  bgcolor: '#09090c',
                  borderRadius: '10px',
                  '& fieldset': { borderColor: '#27272a' },
                  '&:hover fieldset': { borderColor: '#52525b' },
                  '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                },
                '& .MuiInputLabel-root': { color: '#a1a1aa' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#ffffff' },
              }}
            />

            <Button
              variant="contained"
              sx={{ bgcolor: '#ffffff', color: '#000000', fontWeight: 800, px: 3.5, py: 1.4, borderRadius: '10px', '&:hover': { bgcolor: '#e4e4e7' }, '&.Mui-disabled': { bgcolor: '#27272a', color: '#52525b' } }}
              onClick={handleIssueCredential}
              disabled={isSubmitting || !titleInput.trim()}
            >
              {isSubmitting ? 'Generating ZK Proof…' : 'Issue Credential (ZK Commitment)'}
            </Button>
          </Box>
        )}

        {/* Details & Private Verification when ACTIVE or REVOKED */}
        {(isActive || isRevoked) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>Credential On-Chain State & Verification</Typography>

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ p: 2.5, bgcolor: '#121216', borderRadius: '12px', border: '1px solid #18181b' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#a1a1aa' }}>CREDENTIAL ID (HASHED):</Typography>
                  <Chip label="PUBLIC" size="small" sx={{ bgcolor: '#18181b', color: '#71717a', fontSize: '0.6rem', height: 18 }} />
                </Stack>
                <Typography variant="body2" sx={{ color: '#ffffff', fontFamily: 'monospace', wordBreak: 'break-all', fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  {derivedState?.credentialId}
                </Typography>
              </Box>

              <Box sx={{ p: 2.5, bgcolor: '#121216', borderRadius: '12px', border: '1px solid #18181b' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#a1a1aa' }}>ISSUER AUTHORITY COMMITMENT:</Typography>
                  <Chip label="PUBLIC (one-way hash)" size="small" sx={{ bgcolor: '#18181b', color: '#71717a', fontSize: '0.6rem', height: 18 }} />
                </Stack>
                <Typography variant="body2" sx={{ color: '#ffffff', fontFamily: 'monospace', wordBreak: 'break-all', fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  {derivedState?.issuerAuthority}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: '#0d1117', borderRadius: '10px', border: '1px solid #27272a' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LockIcon sx={{ fontSize: 14, color: '#e5c158' }} />
                  <Typography variant="caption" sx={{ color: '#a1a1aa' }}>
                    <strong style={{ color: '#e5c158' }}>secretKey:</strong> PRIVATE WITNESS — exists only in local memory, proven via ZK hash, never transmitted
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Divider sx={{ my: 2.5, borderColor: '#18181b' }} />

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, gap: 1 }}
            >
              <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                Total Verified Off-Chain: <strong style={{ color: '#ffffff' }}>{totalVerified}</strong> | Total Issued: <strong style={{ color: '#ffffff' }}>{totalIssued}</strong>
              </Typography>
              {derivedState?.isIssuer && (
                <Chip label="AUTHORIZED ISSUER" size="small" sx={{ bgcolor: '#ffffff15', color: '#ffffff', border: '1px solid #ffffff30', fontWeight: 700, fontSize: '0.65rem' }} />
              )}
            </Stack>

            {isActive && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={isSubmitting ? <CircularProgress size={16} sx={{ color: '#000' }} /> : <SecurityIcon />}
                  sx={{ bgcolor: '#ffffff', color: '#000000', fontWeight: 800, py: 1.6, '&:hover': { bgcolor: '#e4e4e7' }, '&.Mui-disabled': { bgcolor: '#27272a', color: '#52525b' } }}
                  onClick={handleVerifyCredential}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Generating ZK Proof…' : 'Verify Ownership (ZK Circuit)'}
                </Button>

                {derivedState?.isIssuer && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    startIcon={<BlockIcon />}
                    sx={{ borderColor: '#7f1d1d', color: '#ef4444', fontWeight: 700, py: 1.6, '&:hover': { borderColor: '#ef4444', bgcolor: 'rgba(239,68,68,0.1)' }, '&.Mui-disabled': { borderColor: '#3b1212', color: '#7f1d1d' } }}
                    onClick={handleRevokeCredential}
                    disabled={isSubmitting}
                  >
                    Revoke Credential
                  </Button>
                )}
              </Stack>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
