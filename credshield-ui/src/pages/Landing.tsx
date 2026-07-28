import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  Container,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import KeyIcon from '@mui/icons-material/Key';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';

export default function Landing() {
  return (
    <Box sx={{ color: '#ffffff', pb: 10 }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 8, md: 10 },
          pb: { xs: 8, md: 11 },
          px: { xs: 3, md: 6 },
          borderRadius: '32px',
          bgcolor: '#050507',
          border: '1px solid rgba(229, 193, 88, 0.2)',
          boxShadow: '0 30px 100px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.08)',
          textAlign: 'center',
          mb: 8,
        }}
      >
        {/* Background Radiant Glows */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(229, 193, 88, 0.12) 0%, rgba(229, 193, 88, 0.03) 45%, rgba(0,0,0,0) 75%)',
            pointerEvents: 'none',
          }}
        />

        {/* Concentric Halo Rings */}
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            border: '1px dashed rgba(229, 193, 88, 0.15)',
            pointerEvents: 'none',
          }}
        />

        {/* Status Badges */}
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center', mb: 3.5, flexWrap: 'wrap', gap: 1 }}>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: '13px !important', color: '#e5c158 !important' }} />}
            label="MIDNIGHT NETWORK • PREPROD TESTNET"
            sx={{
              bgcolor: 'rgba(229, 193, 88, 0.08)',
              border: '1px solid rgba(229, 193, 88, 0.35)',
              color: '#e5c158',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              py: 0.5,
            }}
          />
          <Chip
            icon={<LockIcon sx={{ fontSize: '13px !important', color: '#22c55e !important' }} />}
            label="COMPACT ZK CIRCUIT PROVER READY"
            sx={{
              bgcolor: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.35)',
              color: '#22c55e',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              py: 0.5,
            }}
          />
        </Stack>

        {/* Hero Title */}
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            mb: 1.5,
            letterSpacing: '0.03em',
            fontSize: { xs: '2.8rem', sm: '4.2rem', md: '5.2rem' },
            color: '#ffffff',
            lineHeight: 1.05,
            textTransform: 'uppercase',
          }}
        >
          CredShield
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 3,
            letterSpacing: '0.06em',
            fontSize: { xs: '1.2rem', sm: '1.8rem', md: '2.2rem' },
            color: '#e5c158',
            textTransform: 'uppercase',
          }}
        >
          Zero-Knowledge Verifiable Credentials
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          sx={{
            color: '#a1a1aa',
            maxWidth: 780,
            mx: 'auto',
            mb: 5.5,
            lineHeight: 1.7,
            fontSize: { xs: '1rem', md: '1.2rem' },
            fontWeight: 400,
          }}
        >
          Issue, verify, and revoke tamper-proof credentials on the Midnight Blockchain.
          Credential holders prove ownership off-chain via Compact ZK circuits without exposing secret keys or identity payloads.
        </Typography>

        {/* CTA Buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ justifyContent: 'center', mb: 7 }}>
          <Button
            component={Link}
            to="/demo"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: '#e5c158',
              color: '#000000',
              fontWeight: 800,
              px: 4.5,
              py: 1.8,
              borderRadius: '14px',
              fontSize: '1.05rem',
              boxShadow: '0 8px 30px rgba(229, 193, 88, 0.35)',
              '&:hover': {
                bgcolor: '#f5d36c',
                boxShadow: '0 12px 35px rgba(229, 193, 88, 0.5)',
              },
            }}
          >
            Launch Live Demo
          </Button>

          <Button
            component={Link}
            to="/architecture"
            variant="outlined"
            size="large"
            startIcon={<SecurityIcon />}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontWeight: 700,
              px: 4,
              py: 1.8,
              borderRadius: '14px',
              fontSize: '1.05rem',
              '&:hover': {
                borderColor: '#e5c158',
                bgcolor: 'rgba(229, 193, 88, 0.08)',
              },
            }}
          >
            Explore Architecture
          </Button>

          <Button
            component={Link}
            to="/features"
            variant="text"
            size="large"
            sx={{
              color: '#a1a1aa',
              fontWeight: 600,
              px: 3,
              py: 1.8,
              fontSize: '1rem',
              '&:hover': { color: '#ffffff' },
            }}
          >
            View Features →
          </Button>
        </Stack>

        {/* Live Metrics Grid */}
        <Grid container spacing={3} sx={{ maxWidth: 850, mx: 'auto' }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#e5c158', mb: 0.5 }}>0 Bytes</Typography>
              <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 600, letterSpacing: '0.05em' }}>EXPOSED IDENTITY DATA</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#ffffff', mb: 0.5 }}>32 Bytes</Typography>
              <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 600, letterSpacing: '0.05em' }}>ZK COMMITMENT HASH</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#22c55e', mb: 0.5 }}>100%</Typography>
              <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 600, letterSpacing: '0.05em' }}>OFF-CHAIN LOCAL PROVING</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#e5c158', mb: 0.5 }}>Preprod</Typography>
              <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 600, letterSpacing: '0.05em' }}>LIVE MIDNIGHT TESTNET</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Feature Cards Grid */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 1, letterSpacing: '-0.02em' }}>
          Why Choose CredShield?
        </Typography>
        <Typography variant="body1" sx={{ color: '#a1a1aa', textAlign: 'center', mb: 5, maxWidth: 600, mx: 'auto' }}>
          Designed specifically for privacy-first enterprise verifiable credentials powered by Midnight ZK technology.
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                bgcolor: '#0a0a0f',
                border: '1px solid #18181b',
                borderRadius: '20px',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(229, 193, 88, 0.4)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(229, 193, 88, 0.08)', borderRadius: '12px', width: 'fit-content', mb: 2.5, border: '1px solid rgba(229, 193, 88, 0.2)' }}>
                  <KeyIcon sx={{ color: '#e5c158', fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#ffffff' }}>
                  Off-Chain Proving
                </Typography>
                <Typography variant="body2" sx={{ color: '#a1a1aa', lineHeight: 1.7 }}>
                  Secret witness keys stay strictly inside local browser memory. Compact ZK circuit provers generate valid proof payloads client-side.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                bgcolor: '#0a0a0f',
                border: '1px solid #18181b',
                borderRadius: '20px',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(229, 193, 88, 0.4)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(229, 193, 88, 0.08)', borderRadius: '12px', width: 'fit-content', mb: 2.5, border: '1px solid rgba(229, 193, 88, 0.2)' }}>
                  <VerifiedUserIcon sx={{ color: '#e5c158', fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#ffffff' }}>
                  Selective Disclosure
                </Typography>
                <Typography variant="body2" sx={{ color: '#a1a1aa', lineHeight: 1.7 }}>
                  Prove active credential ownership without revealing underlying student details, identity metadata, or un-blinded secret commitments.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                bgcolor: '#0a0a0f',
                border: '1px solid #18181b',
                borderRadius: '20px',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(229, 193, 88, 0.4)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(229, 193, 88, 0.08)', borderRadius: '12px', width: 'fit-content', mb: 2.5, border: '1px solid rgba(229, 193, 88, 0.2)' }}>
                  <ShieldIcon sx={{ color: '#e5c158', fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#ffffff' }}>
                  Authority Revocation
                </Typography>
                <Typography variant="body2" sx={{ color: '#a1a1aa', lineHeight: 1.7 }}>
                  Issuers maintain cryptographic authority hashes on-chain to revoke compromised credentials while keeping holder history completely private.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 8 }}>
        <Box sx={{ p: { xs: 4, md: 6 }, bgcolor: '#08080c', borderRadius: '24px', border: '1px solid #18181b' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#ffffff', letterSpacing: '-0.02em' }}>
            How CredShield Works
          </Typography>
          <Typography variant="body1" sx={{ color: '#a1a1aa', mb: 5 }}>
            A 3-step privacy workflow combining Compact ZK smart contracts and Midnight Preprod testnet.
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" spacing={2} sx={{ mb: 1.5, alignItems: 'center' }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#e5c158', color: '#000', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  1
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Issue Credential</Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#71717a', lineHeight: 1.7, pl: 6.5 }}>
                Issuer constructs a 32-byte credential commitment and metadata payload on-chain using the <code>issueCredential</code> circuit.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" spacing={2} sx={{ mb: 1.5, alignItems: 'center' }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#e5c158', color: '#000', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  2
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Generate ZK Proof</Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#71717a', lineHeight: 1.7, pl: 6.5 }}>
                Holder executes <code>verifyCredential</code> off-chain in their browser with the secret key witness to construct a ZK proof payload.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" spacing={2} sx={{ mb: 1.5, alignItems: 'center' }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#e5c158', color: '#000', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  3
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Verify On-Chain</Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#71717a', lineHeight: 1.7, pl: 6.5 }}>
                The proof is verified on Midnight network. The total verified counter increments while secret key remains completely private.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Code Preview Section */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 8 }}>
        <Box sx={{ bgcolor: '#030304', borderRadius: '24px', border: '1px solid #18181b', p: { xs: 3, md: 5 } }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <CodeIcon sx={{ color: '#e5c158' }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>credshield.compact</Typography>
            </Stack>
            <Chip label="Compact Language v0.23" size="small" sx={{ bgcolor: '#18181b', color: '#a1a1aa', fontWeight: 600 }} />
          </Stack>

          <Box
            component="pre"
            sx={{
              bgcolor: '#000000',
              p: 3,
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.06)',
              overflowX: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.88rem',
              color: '#d4d4d4',
              lineHeight: 1.6,
            }}
          >
{`pragma language_version 0.23;

export enum CredentialState { UNINITIALIZED, ACTIVE, REVOKED }

export ledger credentialState: CredentialState;
export ledger credentialId: Bytes<32>;
export ledger issuerAuthority: Bytes<32>;
export ledger totalIssued: Counter;
export ledger totalVerified: Counter;

export circuit issueCredential(id: Bytes<32>, metadata: Opaque<"string">): [] {
  assert(credentialState == CredentialState.UNINITIALIZED, "Already initialized");
  issuerAuthority = disclose(authorityPublicKey(secretKey(), sequence as Field as Bytes<32>));
  credentialId = disclose(id);
  credentialState = CredentialState.ACTIVE;
  totalIssued.increment(1);
}

export circuit verifyCredential(providedId: Bytes<32>): [] {
  assert(credentialState == CredentialState.ACTIVE, "Credential not active");
  assert(providedId == credentialId, "Credential ID mismatch");
  totalVerified.increment(1);
}`}
          </Box>
        </Box>
      </Container>

      {/* Call To Action Card */}
      <Container maxWidth="lg" disableGutters>
        <Box
          sx={{
            p: { xs: 5, md: 7 },
            borderRadius: '28px',
            bgcolor: 'linear-gradient(135deg, #09090e 0%, #12121c 100%)',
            border: '1px solid rgba(229, 193, 88, 0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Ready to test CredShield on Midnight Preprod?
          </Typography>
          <Typography variant="body1" sx={{ color: '#a1a1aa', mb: 4, maxWidth: 650, mx: 'auto' }}>
            Connect your Lace or 1AM Wallet to start issuing, verifying, and managing credentials on testnet.
          </Typography>
          <Button
            component={Link}
            to="/demo"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: '#e5c158',
              color: '#000000',
              fontWeight: 800,
              px: 5,
              py: 2,
              borderRadius: '14px',
              fontSize: '1.1rem',
              '&:hover': { bgcolor: '#f5d36c' },
            }}
          >
            Open Live Demo Workspace
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
