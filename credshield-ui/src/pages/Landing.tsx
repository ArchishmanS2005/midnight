import React, { useEffect, useRef } from 'react';
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
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HubIcon from '@mui/icons-material/Hub';
import TerminalIcon from '@mui/icons-material/Terminal';

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let gsapModule: typeof import('gsap') | null = null;
    let scrollTriggerModule: any = null;

    const initAnimations = async () => {
      try {
        gsapModule = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsapModule.gsap.registerPlugin(ScrollTrigger);
        const { gsap } = gsapModule;

        // Hero entrance
        if (heroRef.current) {
          const heroElements = heroRef.current.querySelectorAll('[data-animate]');
          gsap.fromTo(
            heroElements,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out' }
          );
        }

        // Feature cards stagger
        if (featureCardsRef.current) {
          const cards = featureCardsRef.current.querySelectorAll('[data-card]');
          gsap.fromTo(
            cards,
            { opacity: 0, y: 80, scale: 0.92 },
            {
              opacity: 1, y: 0, scale: 1,
              duration: 0.9, stagger: 0.12, ease: 'power2.out',
              scrollTrigger: { trigger: featureCardsRef.current, start: 'top 80%' },
            }
          );
        }

        // How it works
        if (howItWorksRef.current) {
          const steps = howItWorksRef.current.querySelectorAll('[data-step]');
          gsap.fromTo(
            steps,
            { opacity: 0, x: -40 },
            {
              opacity: 1, x: 0,
              duration: 0.8, stagger: 0.2, ease: 'power2.out',
              scrollTrigger: { trigger: howItWorksRef.current, start: 'top 75%' },
            }
          );
        }

        // Code block
        if (codeRef.current) {
          gsap.fromTo(
            codeRef.current,
            { opacity: 0, y: 50 },
            {
              opacity: 1, y: 0, duration: 1, ease: 'power2.out',
              scrollTrigger: { trigger: codeRef.current, start: 'top 80%' },
            }
          );
        }

        // CTA
        if (ctaRef.current) {
          gsap.fromTo(
            ctaRef.current,
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
              scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
            }
          );
        }
      } catch {
        // GSAP not available — pages render fine without animation
      }
    };

    initAnimations();
  }, []);

  return (
    <Box sx={{ color: '#ffffff', pb: 10 }}>
      {/* Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
          borderRadius: '32px',
          bgcolor: '#020204',
          border: '1px solid rgba(229, 193, 88, 0.15)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.06)',
          textAlign: 'center',
          mb: 8,
        }}
      >
        {/* Animated gradient orb */}
        <Box
          sx={{
            position: 'absolute',
            top: '-30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(229, 193, 88, 0.1) 0%, rgba(229, 193, 88, 0.02) 40%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'pulse 6s ease-in-out infinite alternate',
          }}
        />

        {/* Concentric rings */}
        {[520, 380, 240].map((size, i) => (
          <Box
            key={size}
            sx={{
              position: 'absolute',
              top: '45%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              border: `1px ${i === 0 ? 'dashed' : 'solid'} rgba(229, 193, 88, ${0.08 - i * 0.02})`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Status Badges */}
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center', mb: 4, flexWrap: 'wrap', gap: 1 }} data-animate>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: '13px !important', color: '#e5c158 !important' }} />}
            label="MIDNIGHT NETWORK • LOCAL UNDEPLOYED"
            sx={{
              bgcolor: 'rgba(229, 193, 88, 0.06)',
              border: '1px solid rgba(229, 193, 88, 0.3)',
              color: '#e5c158',
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              py: 0.5,
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
              py: 0.5,
            }}
          />
        </Stack>

        {/* Hero Title */}
        <Typography
          variant="h1"
          data-animate
          sx={{
            fontWeight: 900,
            mb: 1.5,
            letterSpacing: '0.04em',
            fontSize: { xs: '2.8rem', sm: '4.5rem', md: '5.5rem' },
            color: '#ffffff',
            lineHeight: 1.02,
            textTransform: 'uppercase',
            textShadow: '0 4px 40px rgba(229, 193, 88, 0.15)',
          }}
        >
          CredShield
        </Typography>

        <Typography
          variant="h2"
          data-animate
          sx={{
            fontWeight: 800,
            mb: 3,
            letterSpacing: '0.06em',
            fontSize: { xs: '1.1rem', sm: '1.8rem', md: '2.2rem' },
            color: '#e5c158',
            textTransform: 'uppercase',
          }}
        >
          Zero-Knowledge Verifiable Credentials
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          data-animate
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
          Credential holders prove ownership off-chain via Compact ZK circuits without
          exposing secret keys or identity payloads — running entirely on your local network.
        </Typography>

        {/* CTA Buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ justifyContent: 'center', mb: 7 }} data-animate>
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
                boxShadow: '0 12px 40px rgba(229, 193, 88, 0.55)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontWeight: 700,
              px: 4,
              py: 1.8,
              borderRadius: '14px',
              fontSize: '1.05rem',
              '&:hover': {
                borderColor: '#e5c158',
                bgcolor: 'rgba(229, 193, 88, 0.06)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Explore Architecture
          </Button>

          <Button
            component={Link}
            to="/about"
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
            About Project →
          </Button>
        </Stack>

        {/* Live Metrics Grid */}
        <Grid container spacing={3} sx={{ maxWidth: 900, mx: 'auto' }} data-animate>
          {[
            { value: '0 Bytes', label: 'EXPOSED IDENTITY DATA', color: '#e5c158' },
            { value: '32 Bytes', label: 'ZK COMMITMENT HASH', color: '#ffffff' },
            { value: '100%', label: 'OFF-CHAIN LOCAL PROVING', color: '#22c55e' },
            { value: 'Undeployed', label: 'LOCAL MIDNIGHT NETWORK', color: '#e5c158' },
          ].map((metric) => (
            <Grid size={{ xs: 6, sm: 3 }} key={metric.label}>
              <Box sx={{
                p: 2.5,
                bgcolor: 'rgba(255,255,255,0.02)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': { border: '1px solid rgba(229, 193, 88, 0.2)', transform: 'translateY(-2px)' },
              }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: metric.color, mb: 0.5, fontSize: { xs: '1.4rem', md: '1.6rem' } }}>
                  {metric.value}
                </Typography>
                <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 600, letterSpacing: '0.05em', fontSize: '0.65rem' }}>
                  {metric.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Feature Cards */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 10 }} ref={featureCardsRef}>
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 1, letterSpacing: '-0.02em' }} data-card>
          Why Choose CredShield?
        </Typography>
        <Typography variant="body1" sx={{ color: '#a1a1aa', textAlign: 'center', mb: 6, maxWidth: 620, mx: 'auto' }} data-card>
          Designed for privacy-first enterprise verifiable credentials powered by Midnight&apos;s ZK technology — running locally with zero dependencies on external testnets.
        </Typography>

        <Grid container spacing={3}>
          {[
            { icon: <KeyIcon />, title: 'Off-Chain Proving', desc: 'Secret witness keys stay strictly inside local browser memory. Compact ZK circuit provers generate valid proof payloads client-side with zero network exposure.' },
            { icon: <VerifiedUserIcon />, title: 'Selective Disclosure', desc: 'Prove active credential ownership without revealing underlying student details, identity metadata, or un-blinded secret commitments.' },
            { icon: <ShieldIcon />, title: 'Authority Revocation', desc: 'Issuers maintain cryptographic authority hashes on-chain to revoke compromised credentials while keeping holder history completely private.' },
            { icon: <VisibilityOffIcon />, title: 'Zero Identity Exposure', desc: 'The Compact circuits guarantee that secret keys never leave the local witness context. Not a single byte of identity is exposed on-ledger.' },
            { icon: <HubIcon />, title: 'Local Network First', desc: 'Run the full Midnight stack locally — node, indexer, and proof server in Docker. Deploy and test contracts without faucets or external dependencies.' },
            { icon: <TerminalIcon />, title: 'CLI + Web DApp', desc: 'Issue and verify credentials via an interactive terminal CLI or the React Web DApp. Both use the same CredShield API and ZK circuit architecture.' },
          ].map((f) => (
            <Grid size={{ xs: 12, md: 4 }} key={f.title}>
              <Card
                data-card
                sx={{
                  bgcolor: '#0a0a0f',
                  border: '1px solid #18181b',
                  borderRadius: '20px',
                  height: '100%',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'rgba(229, 193, 88, 0.4)',
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(229, 193, 88, 0.08)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(229, 193, 88, 0.06)', borderRadius: '12px', width: 'fit-content', mb: 2.5, border: '1px solid rgba(229, 193, 88, 0.15)' }}>
                    {React.cloneElement(f.icon, { sx: { color: '#e5c158', fontSize: 28 } })}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#ffffff' }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#a1a1aa', lineHeight: 1.7 }}>
                    {f.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 10 }} ref={howItWorksRef}>
        <Box sx={{ p: { xs: 4, md: 6 }, bgcolor: '#06060a', borderRadius: '28px', border: '1px solid #18181b', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle gradient accent */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #e5c158, transparent)' }} />

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
            How CredShield Works
          </Typography>
          <Typography variant="body1" sx={{ color: '#a1a1aa', mb: 5 }}>
            A 3-step privacy workflow combining Compact ZK smart contracts on a local Midnight network.
          </Typography>

          <Grid container spacing={4}>
            {[
              { num: '1', title: 'Issue Credential', desc: 'Issuer constructs a 32-byte credential commitment and metadata payload on-chain using the issueCredential circuit. The secret key generates an authority hash without exposure.' },
              { num: '2', title: 'Generate ZK Proof', desc: 'Holder executes verifyCredential off-chain in their browser with the secret key witness to construct a zero-knowledge proof payload — entirely client-side.' },
              { num: '3', title: 'Verify On-Chain', desc: 'The proof is submitted to the local Midnight network. The totalVerified counter increments while the secret key remains completely private in the witness context.' },
            ].map((step) => (
              <Grid size={{ xs: 12, md: 4 }} key={step.num}>
                <Box data-step>
                  <Stack direction="row" spacing={2} sx={{ mb: 1.5, alignItems: 'center' }}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #e5c158, #c59b27)',
                      color: '#000', fontWeight: 900, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 15px rgba(229, 193, 88, 0.3)',
                    }}>
                      {step.num}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{step.title}</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: '#71717a', lineHeight: 1.7, pl: 7 }}>
                    {step.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Code Preview */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 10 }} ref={codeRef}>
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
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.85rem',
              color: '#d4d4d4',
              lineHeight: 1.65,
            }}
          >
{`pragma language_version 0.23;

export enum CredentialState { UNINITIALIZED, ACTIVE, REVOKED }

export ledger credentialState: CredentialState;
export ledger credentialId: Bytes<32>;
export ledger issuerAuthority: Bytes<32>;
export ledger totalIssued: Counter;
export ledger totalVerified: Counter;

witness secretKey(): Bytes<32>;

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

      {/* Call To Action */}
      <Container maxWidth="lg" disableGutters ref={ctaRef}>
        <Box
          sx={{
            p: { xs: 5, md: 7 },
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #08080c 0%, #0f0f18 100%)',
            border: '1px solid rgba(229, 193, 88, 0.25)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', bottom: '-50%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(circle, rgba(229, 193, 88, 0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: '#ffffff', letterSpacing: '-0.02em', position: 'relative' }}>
            Ready to run CredShield locally?
          </Typography>
          <Typography variant="body1" sx={{ color: '#a1a1aa', mb: 4, maxWidth: 650, mx: 'auto', position: 'relative' }}>
            Start the local Midnight network with Docker, deploy your credential contract, and issue ZK-verified credentials in minutes.
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
              position: 'relative',
              '&:hover': { bgcolor: '#f5d36c', transform: 'translateY(-2px)' },
              transition: 'all 0.3s ease',
            }}
          >
            Open Live Demo
          </Button>
        </Box>
      </Container>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; transform: translateX(-50%) scale(1); }
          100% { opacity: 1; transform: translateX(-50%) scale(1.05); }
        }
      `}</style>
    </Box>
  );
}
