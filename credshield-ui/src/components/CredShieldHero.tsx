import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import KeyIcon from '@mui/icons-material/Key';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export type CredShieldHeroProps = {
  onIssueClick: () => void;
  onVerifyClick: () => void;
  onGuideClick: () => void;
};

export const CredShieldHero: React.FC<CredShieldHeroProps> = ({
  onIssueClick,
  onVerifyClick,
  onGuideClick,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 6, md: 8 },
        pb: { xs: 7, md: 9 },
        px: { xs: 3, md: 7 },
        mb: 7,
        bgcolor: '#000000',
        borderRadius: '28px',
        border: '1px solid rgba(229, 193, 88, 0.15)',
        boxShadow: '0 30px 90px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Background Radial Halo Glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '-25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '750px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(229, 193, 88, 0.08) 0%, rgba(229, 193, 88, 0.02) 40%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Dotted Concentric Halo Rings */}
      <Box
        sx={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          border: '1px dashed rgba(229, 193, 88, 0.12)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none',
        }}
      />

      {/* Protocol Live Ticker Badge */}
      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center', mb: 3.5, flexWrap: 'wrap', gap: 1 }}>
        <Chip
          icon={<AutoAwesomeIcon sx={{ fontSize: '13px !important', color: '#e5c158 !important' }} />}
          label="MIDNIGHT NETWORK • PREPROD TESTNET"
          sx={{
            bgcolor: 'rgba(229, 193, 88, 0.06)',
            border: '1px solid rgba(229, 193, 88, 0.3)',
            color: '#e5c158',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
          }}
        />
        <Chip
          icon={<LockIcon sx={{ fontSize: '13px !important', color: '#22c55e !important' }} />}
          label="COMPACT ZK CIRCUIT PROVER READY"
          sx={{
            bgcolor: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: '#22c55e',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
          }}
        />
      </Stack>

      {/* Editorial Headline: Credential Verifier */}
      <Typography
        variant="h1"
        sx={{
          fontWeight: 900,
          textAlign: 'center',
          mb: 1.5,
          letterSpacing: '0.04em',
          fontSize: { xs: '2.5rem', sm: '3.8rem', md: '4.8rem' },
          color: '#ffffff',
          lineHeight: 1.08,
          textTransform: 'uppercase',
        }}
      >
        CredShield
      </Typography>

      <Typography
        variant="h2"
        sx={{
          fontWeight: 700,
          textAlign: 'center',
          mb: 3,
          letterSpacing: '0.06em',
          fontSize: { xs: '1.2rem', sm: '1.8rem', md: '2.2rem' },
          color: '#e5c158',
          textTransform: 'uppercase',
          opacity: 0.95,
        }}
      >
        Privacy-Preserving Credential Verifier
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body1"
        sx={{
          textAlign: 'center',
          color: '#a1a1aa',
          maxWidth: 780,
          mx: 'auto',
          mb: 5.5,
          fontWeight: 400,
          lineHeight: 1.7,
          fontSize: { xs: '0.95rem', md: '1.15rem' },
        }}
      >
        Issue and verify tamper-proof credentials on Midnight Blockchain. Credential holders prove ownership off-chain via Compact zero-knowledge circuits without exposing secret keys or identity payloads to verifiers.
      </Typography>

      {/* Action Buttons */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ justifyContent: 'center', mb: 6.5 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<ShieldIcon />}
          onClick={onIssueClick}
          sx={{
            px: 4,
            py: 1.8,
            borderRadius: '14px',
            fontSize: '1.02rem',
            letterSpacing: '0.02em',
          }}
        >
          Issue Credential Instance →
        </Button>

        <Button
          variant="outlined"
          size="large"
          startIcon={<SecurityIcon />}
          onClick={onVerifyClick}
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            fontWeight: 700,
            px: 4,
            py: 1.8,
            borderRadius: '14px',
            fontSize: '1.02rem',
            '&:hover': {
              borderColor: '#e5c158',
              bgcolor: 'rgba(229, 193, 88, 0.06)',
            },
          }}
        >
          Verify Credential (ZK Proof)
        </Button>

        <Button
          variant="text"
          size="large"
          onClick={onGuideClick}
          sx={{ color: '#a1a1aa', fontWeight: 600, px: 3, py: 1.8, '&:hover': { color: '#ffffff' } }}
        >
          Deployment Guide ↓
        </Button>
      </Stack>

      {/* Protocol Architecture Grid */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              bgcolor: 'rgba(10, 10, 15, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(229, 193, 88, 0.4)',
                transform: 'translateY(-3px)',
              },
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Box
                sx={{
                  p: 1.4,
                  bgcolor: 'rgba(229, 193, 88, 0.08)',
                  borderRadius: '12px',
                  width: 'fit-content',
                  mb: 2.5,
                  border: '1px solid rgba(229, 193, 88, 0.2)',
                }}
              >
                <KeyIcon sx={{ color: '#e5c158', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, letterSpacing: '0.01em', color: '#ffffff' }}>
                Off-Chain Proving
              </Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa', lineHeight: 1.65 }}>
                Secret witness keys stay strictly in local browser memory. Compact ZK circuit prover executes client-side.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              bgcolor: 'rgba(10, 10, 15, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(229, 193, 88, 0.4)',
                transform: 'translateY(-3px)',
              },
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Box
                sx={{
                  p: 1.4,
                  bgcolor: 'rgba(229, 193, 88, 0.08)',
                  borderRadius: '12px',
                  width: 'fit-content',
                  mb: 2.5,
                  border: '1px solid rgba(229, 193, 88, 0.2)',
                }}
              >
                <VerifiedUserIcon sx={{ color: '#e5c158', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, letterSpacing: '0.01em', color: '#ffffff' }}>
                Selective Disclosure
              </Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa', lineHeight: 1.65 }}>
                Prove active credential state without exposing raw identity, degree payload, or unblinded commitments.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              bgcolor: 'rgba(10, 10, 15, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(229, 193, 88, 0.4)',
                transform: 'translateY(-3px)',
              },
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Box
                sx={{
                  p: 1.4,
                  bgcolor: 'rgba(229, 193, 88, 0.08)',
                  borderRadius: '12px',
                  width: 'fit-content',
                  mb: 2.5,
                  border: '1px solid rgba(229, 193, 88, 0.2)',
                }}
              >
                <ShieldIcon sx={{ color: '#e5c158', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, letterSpacing: '0.01em', color: '#ffffff' }}>
                Authority Revocation
              </Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa', lineHeight: 1.65 }}>
                Issuers hold on-chain authority commitments to revoke compromised credentials while keeping holder history private.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
