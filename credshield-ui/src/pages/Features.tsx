import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import LockIcon from '@mui/icons-material/Lock';
import KeyIcon from '@mui/icons-material/Key';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HubIcon from '@mui/icons-material/Hub';
import TerminalIcon from '@mui/icons-material/Terminal';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import SpeedIcon from '@mui/icons-material/Speed';
import TuneIcon from '@mui/icons-material/Tune';
import BuildIcon from '@mui/icons-material/Build';

const primaryFeatures = [
  {
    icon: <KeyIcon />,
    title: 'Off-Chain ZK Proving',
    subtitle: 'Client-Side Privacy',
    desc: 'Compact ZK circuit provers execute entirely within local browser or CLI memory. The 32-byte secret key witness never leaves the client — zero network hops, zero exposure, zero trust assumptions.',
    highlight: 'secretKey stays in WitnessContext',
  },
  {
    icon: <VerifiedUserIcon />,
    title: 'Selective Disclosure',
    subtitle: 'Prove Without Revealing',
    desc: 'Holders can prove credential validity, ownership, and active status without exposing the underlying raw metadata, identity payloads, or un-blinded commitment values to the verifier.',
    highlight: 'Zero raw identity exposure',
  },
  {
    icon: <ShieldIcon />,
    title: 'Issuer Authority & Revocation',
    subtitle: 'Cryptographic Control',
    desc: 'The issuer authority is a persistent hash of (secretKey, sequence). Revocation requires re-computing this commitment, ensuring only the original issuer can disable a credential.',
    highlight: 'authorityPublicKey(sk, seq)',
  },
  {
    icon: <VisibilityOffIcon />,
    title: 'Unlinkable Verifications',
    subtitle: 'Privacy-Preserving History',
    desc: 'Each verification increments the on-chain counter but reveals no correlation between verification requests. Historical holder activity is completely unlinkable.',
    highlight: 'totalVerified: Counter (no logs)',
  },
  {
    icon: <HubIcon />,
    title: 'Local-First Development',
    subtitle: 'Docker Standalone Network',
    desc: 'Run a full Midnight network locally — node on port 9944, indexer on 8088, proof server on 6300. Deploy and iterate without testnets, faucets, or wallet extensions.',
    highlight: 'docker compose -f standalone.yml up',
  },
  {
    icon: <TerminalIcon />,
    title: 'Dual Interface',
    subtitle: 'CLI + React Web DApp',
    desc: 'Issue credentials via the interactive terminal CLI or the React Web DApp. Both share the same CredShieldAPI TypeScript wrapper and ZK circuit execution path.',
    highlight: 'npm run standalone',
  },
];

const technicalSpecs = [
  { icon: <SecurityIcon />, label: 'Circuits', value: '3 ZK circuits', detail: 'issueCredential, verifyCredential, revokeCredential' },
  { icon: <StorageIcon />, label: 'Ledger State', value: '7 fields', detail: 'credentialState, credentialId, issuerAuthority, metadata, counters, sequence' },
  { icon: <LockIcon />, label: 'Key Size', value: '32 bytes', detail: 'Bytes<32> secret key in local witness context' },
  { icon: <SpeedIcon />, label: 'Proof Server', value: 'v8.0.3', detail: 'midnightntwrk/proof-server Docker image' },
  { icon: <TuneIcon />, label: 'Compact Version', value: 'v0.23', detail: 'Latest Compact language specification' },
  { icon: <BuildIcon />, label: 'Network Mode', value: 'Undeployed', detail: 'Local dev node with genesis wallet pre-funded' },
];

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initAnimations = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (containerRef.current) {
          const cards = containerRef.current.querySelectorAll('[data-feature]');
          gsap.fromTo(
            cards,
            { opacity: 0, y: 60, rotateX: 8 },
            {
              opacity: 1, y: 0, rotateX: 0,
              duration: 0.8, stagger: 0.1, ease: 'power3.out',
              scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
            }
          );

          const specs = containerRef.current.querySelectorAll('[data-spec]');
          gsap.fromTo(
            specs,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1, scale: 1,
              duration: 0.6, stagger: 0.08, ease: 'back.out(1.4)',
              scrollTrigger: { trigger: specs[0]?.parentElement, start: 'top 80%' },
            }
          );
        }
      } catch {
        // graceful fallback
      }
    };
    initAnimations();
  }, []);

  return (
    <Box sx={{ color: '#ffffff', pb: 10, pt: 2 }} ref={containerRef}>
      {/* Page Header */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 8 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
          <Box sx={{ p: 1.2, bgcolor: 'rgba(229, 193, 88, 0.08)', borderRadius: '12px', border: '1px solid rgba(229, 193, 88, 0.2)' }}>
            <SecurityIcon sx={{ color: '#e5c158', fontSize: 24 }} />
          </Box>
          <Chip label="PLATFORM FEATURES" size="small" sx={{ bgcolor: '#18181b', color: '#a1a1aa', fontWeight: 700, letterSpacing: '0.08em', fontSize: '0.7rem' }} />
        </Stack>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.02em', mb: 1.5 }}>
          Features & Capabilities
        </Typography>
        <Typography variant="body1" sx={{ color: '#a1a1aa', maxWidth: 700, lineHeight: 1.7 }}>
          CredShield leverages Midnight&apos;s Compact ZK circuits and hybrid ledger architecture
          to deliver verifiable credentials that are genuinely private, locally provable, and
          cryptographically revocable.
        </Typography>
      </Container>

      {/* Primary Features Grid */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 10 }}>
        <Grid container spacing={3}>
          {primaryFeatures.map((f) => (
            <Grid size={{ xs: 12, md: 6 }} key={f.title}>
              <Card
                data-feature
                sx={{
                  bgcolor: '#08080c',
                  border: '1px solid #1a1a1f',
                  borderRadius: '20px',
                  height: '100%',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'rgba(229, 193, 88, 0.35)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(229, 193, 88, 0.05)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ p: 1.4, bgcolor: 'rgba(229, 193, 88, 0.06)', borderRadius: '12px', border: '1px solid rgba(229, 193, 88, 0.15)' }}>
                      {React.cloneElement(f.icon, { sx: { color: '#e5c158', fontSize: 26 } })}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', mb: 0.3 }}>
                        {f.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#e5c158', fontWeight: 600, letterSpacing: '0.06em' }}>
                        {f.subtitle}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body2" sx={{ color: '#a1a1aa', lineHeight: 1.7, mb: 2 }}>
                    {f.desc}
                  </Typography>
                  <Box sx={{ px: 2, py: 1, bgcolor: '#000000', borderRadius: '8px', border: '1px solid #18181b', display: 'inline-block' }}>
                    <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono", monospace', color: '#71717a', fontWeight: 500, fontSize: '0.75rem' }}>
                      {f.highlight}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider sx={{ borderColor: '#18181b', mb: 8 }} />

      {/* Technical Specifications */}
      <Container maxWidth="lg" disableGutters>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
          Technical Specifications
        </Typography>
        <Typography variant="body1" sx={{ color: '#a1a1aa', mb: 5 }}>
          The core building blocks that power CredShield&apos;s privacy guarantees.
        </Typography>

        <Grid container spacing={2.5}>
          {technicalSpecs.map((spec) => (
            <Grid size={{ xs: 6, md: 4 }} key={spec.label}>
              <Box
                data-spec
                sx={{
                  p: 3,
                  bgcolor: '#0a0a0f',
                  borderRadius: '16px',
                  border: '1px solid #18181b',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: 'rgba(229, 193, 88, 0.3)', transform: 'translateY(-2px)' },
                }}
              >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1.5 }}>
                  {React.cloneElement(spec.icon, { sx: { color: '#e5c158', fontSize: 20 } })}
                  <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 700, letterSpacing: '0.08em', fontSize: '0.7rem' }}>
                    {spec.label.toUpperCase()}
                  </Typography>
                </Stack>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', mb: 0.5 }}>
                  {spec.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#a1a1aa', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {spec.detail}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
