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
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShieldIcon from '@mui/icons-material/Shield';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BlockIcon from '@mui/icons-material/Block';
import { type Observable } from 'rxjs';
import { type CredShieldDeployment } from '../contexts';
import { type CredShieldDerivedState } from '@midnight-ntwrk/credshield-api';
import { CredentialState } from '@midnight-ntwrk/credshield-contract';

export type CredShieldCardProps = {
  deployment$?: Observable<CredShieldDeployment>;
  onQuickJoinPreprod?: (contractAddress: string) => void;
  onRetryConnect?: () => void;
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
      setActionMessage('Generating ZK proof for credential issuance...');
      const rawId = getRandomBytes(32);
      await deployment.api.issueCredential(rawId, titleInput.trim());
      setActionMessage('Credential successfully issued and recorded on Midnight Preprod!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to issue credential';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCredential = async () => {
    if (!deployment || deployment.status !== 'deployed' || !derivedState?.credentialId) return;
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      setActionMessage('Executing off-chain ZK circuit to verify credential ownership...');
      const idBytes = Uint8Array.from(Buffer.from(derivedState.credentialId, 'hex'));
      await deployment.api.verifyCredential(idBytes);
      setActionMessage('Credential verified off-chain via ZK Proof! Total verified counter updated.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to verify credential';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeCredential = async () => {
    if (!deployment || deployment.status !== 'deployed') return;
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      setActionMessage('Generating revocation proof for credential...');
      await deployment.api.revokeCredential();
      setActionMessage('Credential revoked on-chain by issuer authority!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to revoke credential';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!deployment) {
    return (
      <Card sx={{ bgcolor: '#09090c', color: '#fff', borderRadius: '16px', border: '1px solid #18181b', p: 4, textAlign: 'center' }}>
        <CardContent sx={{ py: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#ffffff' }}>
            No Active CredShield Instance Selected
          </Typography>
          <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 3, maxWidth: 500, mx: 'auto' }}>
            Paste an existing 32-byte CredShield contract address above or issue a fresh credential instance on Midnight Preprod testnet.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (deployment.status === 'in-progress') {
    return (
      <Card sx={{ bgcolor: '#09090c', color: '#fff', borderRadius: '16px', border: '1px solid #18181b', p: 5, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#ffffff', mb: 2 }} size={36} thickness={4} />
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Connecting to Midnight Preprod...</Typography>
        <Typography variant="body2" sx={{ color: '#a1a1aa' }}>Prompting Lace / 1AM Wallet authorization & fetching ZK proving keys.</Typography>
      </Card>
    );
  }

  if (deployment.status === 'failed') {
    return (
      <Card sx={{ bgcolor: '#09090c', color: '#fff', borderRadius: '16px', border: '1px solid #27272a', p: 4 }}>
        <CardContent sx={{ textAlign: 'center', py: 2 }}>
          <Box sx={{ display: 'inline-flex', p: 2, bgcolor: '#ffffff0a', borderRadius: '50%', mb: 2, border: '1px solid #ffffff15' }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 44, color: '#ffffff' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Wallet Authorization / Provider Connection Required
          </Typography>
          <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 4, maxWidth: 540, mx: 'auto', lineHeight: 1.6 }}>
            {deployment.error.message}
          </Typography>
          {onRetryConnect && (
            <Button
              variant="contained"
              startIcon={<AccountBalanceWalletIcon />}
              sx={{ bgcolor: '#ffffff', color: '#000000', fontWeight: 700, px: 3.5, py: 1.4, borderRadius: '12px', '&:hover': { bgcolor: '#e4e4e7' } }}
              onClick={onRetryConnect}
            >
              Connect Wallet & Retry
            </Button>
          )}
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
      <CardContent sx={{ p: 3.5 }}>
        {/* Header Badges */}
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <ShieldIcon sx={{ color: '#ffffff', fontSize: 18 }} />
            <Typography variant="caption" sx={{ color: '#a1a1aa', fontWeight: 700, letterSpacing: '0.1em' }}>
              ZERO-KNOWLEDGE VERIFIABLE CREDENTIAL
            </Typography>
          </Stack>

          {isUninit && <Chip label="UNINITIALIZED" size="small" sx={{ bgcolor: '#27272a', color: '#e4e4e7', fontWeight: 700, fontSize: '0.7rem' }} />}
          {isActive && <Chip label="CREDENTIAL ACTIVE" size="small" sx={{ bgcolor: '#ffffff', color: '#000000', fontWeight: 800, fontSize: '0.7rem' }} icon={<VerifiedUserIcon sx={{ color: '#000 !important' }} />} />}
          {isRevoked && <Chip label="REVOKED" size="small" sx={{ bgcolor: '#18181b', color: '#ef4444', border: '1px solid #7f1d1d', fontWeight: 700, fontSize: '0.7rem' }} icon={<BlockIcon sx={{ color: '#ef4444 !important' }} />} />}
        </Stack>

        {/* Title */}
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#ffffff', letterSpacing: '-0.03em' }}>
          {derivedState?.credentialMetadata ?? 'CredShield Verifiable Credential'}
        </Typography>

        {/* Address */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
          <Typography variant="caption" sx={{ color: '#71717a', fontFamily: 'monospace' }}>
            Contract Address: <span style={{ color: '#ffffff' }}>{deployment.api.deployedContractAddress}</span>
          </Typography>
          <Button size="small" startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />} sx={{ color: '#a1a1aa', py: 0.2, minWidth: 0 }} onClick={copyAddress}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </Stack>

        {/* Alerts & Progress */}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2.5, bgcolor: '#180e0e', color: '#f87171', border: '1px solid #3b1212', borderRadius: '10px' }} onClose={() => setErrorMsg('')}>
            {errorMsg}
          </Alert>
        )}

        {actionMessage && !errorMsg && (
          <Alert severity="info" sx={{ mb: 2.5, bgcolor: '#0e1726', color: '#60a5fa', border: '1px solid #1e3a5f', borderRadius: '10px' }}>
            {actionMessage}
          </Alert>
        )}

        {isSubmitting && <LinearProgress sx={{ mb: 2.5, borderRadius: 1, bgcolor: '#18181b', '& .MuiLinearProgress-bar': { bgcolor: '#ffffff' } }} />}

        {/* Issuance Form when UNINITIALIZED */}
        {isUninit && (
          <Box sx={{ bgcolor: '#121216', p: 3.5, borderRadius: '12px', border: '1px solid #27272a' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Issue Verifiable Credential</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 3 }}>
              Create and bind a verifiable credential on Midnight Preprod chain with off-chain ZK private ownership.
            </Typography>

            <TextField
              fullWidth
              size="small"
              label="Credential Metadata / Title"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
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
              }}
            />

            <Button
              variant="contained"
              sx={{ bgcolor: '#ffffff', color: '#000000', fontWeight: 800, px: 3.5, py: 1.4, borderRadius: '10px' }}
              onClick={handleIssueCredential}
              disabled={isSubmitting}
            >
              Issue Credential (ZK Commitment)
            </Button>
          </Box>
        )}

        {/* Details & Private Verification when ACTIVE or REVOKED */}
        {(isActive || isRevoked) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>Credential On-Chain State & Verification</Typography>

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ p: 2.5, bgcolor: '#121216', borderRadius: '12px', border: '1px solid #18181b' }}>
                <Typography variant="caption" sx={{ color: '#a1a1aa', display: 'block', mb: 0.5 }}>CREDENTIAL ID (HASHED):</Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {derivedState?.credentialId}
                </Typography>
              </Box>

              <Box sx={{ p: 2.5, bgcolor: '#121216', borderRadius: '12px', border: '1px solid #18181b' }}>
                <Typography variant="caption" sx={{ color: '#a1a1aa', display: 'block', mb: 0.5 }}>ISSUER AUTHORITY COMMITMENT:</Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {derivedState?.issuerAuthority}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2.5, borderColor: '#18181b' }} />

            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
                  startIcon={<SecurityIcon />}
                  sx={{ bgcolor: '#ffffff', color: '#000000', fontWeight: 800, py: 1.6, '&:hover': { bgcolor: '#e4e4e7' } }}
                  onClick={handleVerifyCredential}
                  disabled={isSubmitting}
                >
                  Verify Ownership (ZK Circuit)
                </Button>

                {derivedState?.isIssuer && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    startIcon={<BlockIcon />}
                    sx={{ borderColor: '#7f1d1d', color: '#ef4444', fontWeight: 700, py: 1.6, '&:hover': { borderColor: '#ef4444', bgcolor: 'rgba(239,68,68,0.1)' } }}
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
