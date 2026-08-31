import React, { useEffect, useState } from 'react';
import { LinearProgress, Alert, CircularProgress, TextField, Tooltip } from '@mui/material';
import { Shield, CheckCircle, Lock, EyeOff, Copy, Ban, Wallet } from 'lucide-react';
import { type Observable } from 'rxjs';
import { type CredShieldDeployment } from '../contexts';
import { type CredShieldDerivedState } from '@midnight-ntwrk/credshield-api';
import { CredentialState } from '@midnight-ntwrk/credshield-contract';

export type CredShieldCardProps = {
  deployment$?: Observable<CredShieldDeployment>;
  onQuickJoinPreprod?: (contractAddress: string) => void;
  onRetryConnect?: () => void;
};

// ZK proof stage labels
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
    if (!active) {
      setStage(0);
      return;
    }
    const interval = setInterval(() => {
      setStage((s) => (s + 1) % ZK_STAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [active]);
  return ZK_STAGES[stage];
};

export const CredShieldCard: React.FC<CredShieldCardProps> = ({ deployment$, onRetryConnect }) => {
  const [deployment, setDeployment] = useState<CredShieldDeployment | undefined>(undefined);
  const [derivedState, setDerivedState] = useState<CredShieldDerivedState | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
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
      setActionMessage(
        '✅ Credential verified via ZK Proof! secretKey never left your device. totalVerified counter updated on-chain.',
      );
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

  // ── Loading state ──────────────────────────────────────────
  if (!deployment) {
    return (
      <div className="bg-white rounded-2xl border border-black/[0.07] p-10 text-center">
        <CircularProgress size={32} sx={{ color: '#2B2644', mb: 2 }} />
        <div className="text-black text-[16px] font-medium mb-1 mt-3">Initializing CredShield…</div>
        <div className="text-black/45 text-[13px]">
          Connecting to Midnight network and loading ZK circuit artifacts.
        </div>
      </div>
    );
  }

  // ── In-progress state ──────────────────────────────────────
  if (deployment.status === 'in-progress') {
    return (
      <div className="bg-white rounded-2xl border border-black/[0.07] p-10 text-center">
        <CircularProgress size={40} thickness={3} sx={{ color: '#2B2644', mb: 2 }} />
        <div className="text-black text-[16px] font-medium mb-3 mt-3">Deploying Contract & Loading ZK Circuits</div>
        <LinearProgress
          sx={{ mb: 3, borderRadius: 1, bgcolor: '#F5F5F5', '& .MuiLinearProgress-bar': { bgcolor: '#2B2644' } }}
        />
        <div className="text-black/45 text-[12px] mb-4">
          Connecting wallet → Loading circuit proving keys → Deploying contract…
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2B2644]/8 border border-[#2B2644]/15 text-[#2B2644] text-[11px]">
          <Lock className="w-3 h-3" strokeWidth={2} />
          secretKey: PRIVATE WITNESS — never leaves your device
        </span>
      </div>
    );
  }

  // ── Failed state ───────────────────────────────────────────
  if (deployment.status === 'failed') {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-6">
        <Alert
          severity="error"
          sx={{ mb: 3, bgcolor: '#fff5f5', color: '#c53030', border: '1px solid #fed7d7', borderRadius: '12px' }}
        >
          <strong>Connection Failed:</strong> {String(deployment.error ?? 'Unknown error')}
          <br />
          <br />
          <strong>Troubleshooting:</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
            <li>Ensure Lace or 1AM Wallet is installed and unlocked</li>
            <li>
              Run: <code>docker compose -f standalone.yml up -d</code>
            </li>
            <li>
              Verify proof server: <code>curl http://localhost:6300</code>
            </li>
            <li>Set wallet network to &quot;Undeployed&quot;</li>
          </ul>
        </Alert>
        <button
          onClick={onRetryConnect}
          className="flex items-center gap-2 border border-black/15 text-black/70 rounded-xl px-4 py-2.5 text-[13px] font-medium hover:border-[#2B2644]/30 hover:text-[#2B2644] transition-all duration-200"
        >
          <Wallet className="w-4 h-4" strokeWidth={1.5} />
          Connect Wallet & Retry
        </button>
      </div>
    );
  }

  // ── Main deployed state ────────────────────────────────────
  const isUninit = derivedState?.credentialState === CredentialState.UNINITIALIZED;
  const isActive = derivedState?.credentialState === CredentialState.ACTIVE;
  const isRevoked = derivedState?.credentialState === CredentialState.REVOKED;

  const totalIssued = Number(derivedState?.totalIssued ?? 0n);
  const totalVerified = Number(derivedState?.totalVerified ?? 0n);

  return (
    <div className="bg-white rounded-2xl border border-black/[0.07] shadow-sm overflow-hidden">
      <div className="p-5 sm:p-7">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-black/40" strokeWidth={1.5} />
            <span className="text-black/40 text-[11px] font-medium tracking-widest uppercase">
              Zero-Knowledge Verifiable Credential
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isUninit && (
              <span className="px-2.5 py-1 rounded-full bg-black/5 text-black/50 text-[11px] font-medium">
                UNINITIALIZED
              </span>
            )}
            {isActive && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2B2644] text-white text-[11px] font-medium">
                <CheckCircle className="w-3 h-3" strokeWidth={2} /> CREDENTIAL ACTIVE
              </span>
            )}
            {isRevoked && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-600 text-[11px] font-medium border border-red-200">
                <Ban className="w-3 h-3" strokeWidth={2} /> REVOKED
              </span>
            )}
          </div>
        </div>

        {/* Privacy label */}
        <Tooltip
          title="The secretKey witness is computed locally in the ZK circuit and never transmitted or stored on the ledger."
          placement="top"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2B2644]/6 border border-[#2B2644]/12 text-[#2B2644] text-[11px] mb-4 cursor-help">
            <EyeOff className="w-3 h-3" strokeWidth={2} />
            secretKey: PRIVATE WITNESS — never disclosed on-chain
          </span>
        </Tooltip>

        {/* Title */}
        <h3 className="text-black text-[1.6rem] sm:text-[2rem] font-medium tracking-[-0.03em] leading-tight mb-2">
          {derivedState?.credentialMetadata ?? 'CredShield Verifiable Credential'}
        </h3>

        {/* Contract address */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-black/35 text-[11px] font-mono break-all">
            Contract: <span className="text-black/60">{deployment.api.deployedContractAddress}</span>
          </span>
          <button
            onClick={copyAddress}
            className="flex items-center gap-1 text-black/35 hover:text-[#2B2644] text-[11px] transition-colors"
          >
            <Copy className="w-3 h-3" strokeWidth={2} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* ZK Proof Loading Indicator */}
        {isSubmitting && (
          <div className="mb-5 p-4 bg-[#2B2644]/5 border border-[#2B2644]/15 rounded-xl">
            <div className="flex items-center gap-2.5 mb-2">
              <CircularProgress size={18} thickness={4} sx={{ color: '#2B2644', flexShrink: 0 }} />
              <span className="text-[#2B2644] text-[13px] font-medium">{zkStageLabel}</span>
            </div>
            <LinearProgress
              sx={{ borderRadius: 1, bgcolor: '#e8e6f0', '& .MuiLinearProgress-bar': { bgcolor: '#2B2644' } }}
            />
            <p className="text-black/35 text-[11px] mt-2">
              ZK proof generation runs locally — your private key never leaves this device.
            </p>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <Alert
            severity="error"
            sx={{ mb: 3, bgcolor: '#fff5f5', color: '#c53030', border: '1px solid #fed7d7', borderRadius: '12px' }}
            onClose={() => setErrorMsg('')}
          >
            {errorMsg}
          </Alert>
        )}

        {/* Success */}
        {actionMessage && !errorMsg && !isSubmitting && (
          <Alert
            severity="success"
            sx={{ mb: 3, bgcolor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '12px' }}
          >
            {actionMessage}
          </Alert>
        )}

        {/* ── Issue Form (UNINITIALIZED) ─────────────────── */}
        {isUninit && (
          <div className="bg-[#F5F5F5] rounded-xl border border-black/[0.06] p-5 sm:p-6">
            <div className="text-black text-[15px] font-medium mb-1">Issue Verifiable Credential</div>
            <p className="text-black/50 text-[13px] leading-relaxed mb-4">
              Create and bind a verifiable credential on the Midnight chain. The issuer&apos;s{' '}
              <strong>secretKey</strong> is committed via ZK hash — never exposed publicly.
            </p>

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
                  color: '#000',
                  bgcolor: '#ffffff',
                  borderRadius: '10px',
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
                  '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.25)' },
                  '&.Mui-focused fieldset': { borderColor: '#2B2644' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.4)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#2B2644' },
              }}
            />

            <button
              onClick={handleIssueCredential}
              disabled={isSubmitting || !titleInput.trim()}
              className="flex items-center gap-2 bg-[#2B2644] text-white rounded-xl px-5 py-2.5 text-[13px] font-medium hover:bg-[#3d3560] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Generating ZK Proof…' : 'Issue Credential (ZK Commitment)'}
            </button>
          </div>
        )}

        {/* ── Details & Verification (ACTIVE / REVOKED) ──── */}
        {(isActive || isRevoked) && (
          <div className="mt-2">
            <div className="text-black text-[15px] font-medium mb-4">Credential On-Chain State & Verification</div>

            <div className="flex flex-col gap-3 mb-5">
              {/* Credential ID */}
              <div className="p-3.5 bg-[#F5F5F5] rounded-xl border border-black/[0.06]">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-black/40 text-[10px] tracking-widest uppercase font-medium">
                    Credential ID (Hashed):
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#2B2644]/8 text-[#2B2644] text-[10px] font-medium">
                    PUBLIC
                  </span>
                </div>
                <code className="text-black/70 text-[11px] sm:text-[12px] font-mono break-all">
                  {derivedState?.credentialId}
                </code>
              </div>

              {/* Issuer Authority */}
              <div className="p-3.5 bg-[#F5F5F5] rounded-xl border border-black/[0.06]">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-black/40 text-[10px] tracking-widest uppercase font-medium">
                    Issuer Authority Commitment:
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#2B2644]/8 text-[#2B2644] text-[10px] font-medium">
                    PUBLIC (one-way hash)
                  </span>
                </div>
                <code className="text-black/70 text-[11px] sm:text-[12px] font-mono break-all">
                  {derivedState?.issuerAuthority}
                </code>
              </div>

              {/* Secret key note */}
              <div className="p-3 bg-[#2B2644]/5 rounded-xl border border-[#2B2644]/12 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#2B2644] shrink-0" strokeWidth={2} />
                <span className="text-black/55 text-[11px] leading-relaxed">
                  <span className="text-[#2B2644] font-medium">secretKey:</span> PRIVATE WITNESS — exists only in local
                  memory, proven via ZK hash, never transmitted
                </span>
              </div>
            </div>

            <div className="h-px bg-black/[0.06] mb-4" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <span className="text-black/50 text-[13px]">
                Total Verified Off-Chain: <strong className="text-black">{totalVerified}</strong> | Total Issued:{' '}
                <strong className="text-black">{totalIssued}</strong>
              </span>
              {derivedState?.isIssuer && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2B2644]/8 border border-[#2B2644]/15 text-[#2B2644] text-[11px] font-medium">
                  <CheckCircle className="w-3 h-3" strokeWidth={2} />
                  AUTHORIZED ISSUER
                </span>
              )}
            </div>

            {isActive && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleVerifyCredential}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#2B2644] text-white rounded-xl px-5 py-3 text-[14px] font-medium hover:bg-[#3d3560] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={16} sx={{ color: '#fff' }} /> Generating ZK Proof…
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" strokeWidth={2} /> Verify Ownership (ZK Circuit)
                    </>
                  )}
                </button>

                {derivedState?.isIssuer && (
                  <button
                    onClick={handleRevokeCredential}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 border-2 border-red-200 text-red-600 rounded-xl px-5 py-3 text-[14px] font-medium hover:border-red-400 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Ban className="w-4 h-4" strokeWidth={2} />
                    Revoke Credential
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
