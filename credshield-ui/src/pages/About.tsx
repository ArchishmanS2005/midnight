import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Stack,
  Chip,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const workspaces = [
  {
    name: 'contract/',
    desc: 'Compact smart contract, ZK circuits, generated TypeScript bindings & ZKIR/WASM proving keys',
    files: ['src/credshield.compact', 'src/witnesses.ts', 'src/managed/credshield/'],
    color: '#e5c158',
  },
  {
    name: 'api/',
    desc: 'High-level TypeScript API wrapper (CredShieldAPI) — deploy, join, issueCredential, verifyCredential, revokeCredential',
    files: ['src/index.ts', 'src/common-types.ts', 'src/utils/'],
    color: '#22c55e',
  },
  {
    name: 'credshield-cli/',
    desc: 'Interactive command-line launcher with standalone/preview/preprod modes, Docker proof-server configs',
    files: ['src/index.ts', 'src/config.ts', 'src/launcher/', 'compose.yml'],
    color: '#60a5fa',
  },
  {
    name: 'credshield-ui/',
    desc: 'React 19 + MUI 9 + Vite 8 Web DApp — GSAP animations, Lace/1AM wallet connector, ZK credential management',
    files: ['src/App.tsx', 'src/contexts/', 'src/pages/', 'src/components/'],
    color: '#a78bfa',
  },
];

const techStack = [
  { label: 'Compact', version: 'v0.23', desc: 'ZK smart contract language' },
  { label: 'React', version: '19.2', desc: 'UI framework' },
  { label: 'MUI', version: '9.1', desc: 'Material UI components' },
  { label: 'Vite', version: '8.0', desc: 'Build tool' },
  { label: 'TypeScript', version: '5.9', desc: 'Type safety' },
  { label: 'GSAP', version: '3.12', desc: 'Scroll animations' },
  { label: 'Node.js', version: '24.11', desc: 'Runtime' },
  { label: 'Docker', version: 'Compose v2', desc: 'Container orchestration' },
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initAnimations = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (containerRef.current) {
          const sections = containerRef.current.querySelectorAll('[data-section]');
          gsap.fromTo(
            sections,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0,
              duration: 0.8, stagger: 0.12, ease: 'power2.out',
              scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
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
            <InfoIcon sx={{ color: '#e5c158', fontSize: 24 }} />
          </Box>
          <Chip label="ABOUT THE PROJECT" size="small" sx={{ bgcolor: '#18181b', color: '#a1a1aa', fontWeight: 700, letterSpacing: '0.08em', fontSize: '0.7rem' }} />
        </Stack>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.02em', mb: 1.5 }}>
          About CredShield
        </Typography>
        <Typography variant="body1" sx={{ color: '#a1a1aa', maxWidth: 750, lineHeight: 1.7 }}>
          CredShield is a privacy-preserving credential verification platform built on the Midnight Blockchain.
          It enables institutions to issue tamper-proof verifiable credentials while allowing holders to prove
          credential validity via zero-knowledge proofs — without exposing identity data.
        </Typography>
      </Container>

      {/* Vision Section */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 8 }} data-section>
        <Box sx={{ p: { xs: 4, md: 5 }, bgcolor: '#08080c', borderRadius: '20px', border: '1px solid #1a1a1f', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #e5c158, transparent)' }} />
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
            <RocketLaunchIcon sx={{ color: '#e5c158', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Vision & Motivation</Typography>
          </Stack>
          <Typography variant="body1" sx={{ color: '#a1a1aa', lineHeight: 1.8, mb: 2 }}>
            Traditional digital credential verification systems require either exposing full personal identity
            payloads to third-party verifiers or relying on centralized verification APIs that track user activity.
          </Typography>
          <Typography variant="body1" sx={{ color: '#d4d4d8', lineHeight: 1.8, fontWeight: 500 }}>
            CredShield establishes a privacy-preserving credential verification protocol where certified institutions
            issue tamper-proof verifiable credentials. Holders prove credential validity, ownership, and active state
            off-chain via Compact Zero-Knowledge circuits — without publicly disclosing personal keys or identity data.
          </Typography>
        </Box>
      </Container>

      {/* Author & Challenge */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 8 }} data-section>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 4, bgcolor: '#0a0a0f', borderRadius: '20px', border: '1px solid #18181b', height: '100%' }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
                <GitHubIcon sx={{ color: '#ffffff', fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Developer</Typography>
              </Stack>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 600, letterSpacing: '0.06em' }}>AUTHOR</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#ffffff' }}>ArchishmanS2005</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 600, letterSpacing: '0.06em' }}>EMAIL</Typography>
                  <Typography variant="body1" sx={{ color: '#a1a1aa', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.9rem' }}>
                    archishmansarkar94@gmail.com
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 600, letterSpacing: '0.06em' }}>REPOSITORY</Typography>
                  <MuiLink
                    href="https://github.com/ArchishmanS2005/midnight"
                    target="_blank"
                    rel="noreferrer"
                    sx={{ color: '#e5c158', fontWeight: 600, fontSize: '0.9rem', display: 'block' }}
                  >
                    github.com/ArchishmanS2005/midnight
                  </MuiLink>
                </Box>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 4, bgcolor: '#0a0a0f', borderRadius: '20px', border: '1px solid #18181b', height: '100%' }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
                <SchoolIcon sx={{ color: '#e5c158', fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Challenge</Typography>
              </Stack>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 600, letterSpacing: '0.06em' }}>PROGRAM</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>Midnight Rise In Level 1</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 600, letterSpacing: '0.06em' }}>CATEGORY</Typography>
                  <Typography variant="body1" sx={{ color: '#a1a1aa' }}>Builder Challenge — Privacy-Preserving DApp</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 600, letterSpacing: '0.06em' }}>LICENSE</Typography>
                  <Typography variant="body1" sx={{ color: '#a1a1aa' }}>MIT License</Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ borderColor: '#18181b', mb: 8 }} />

      {/* Monorepo Structure */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 8 }} data-section>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
          <FolderOpenIcon sx={{ color: '#e5c158', fontSize: 22 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            Monorepo Structure
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          {workspaces.map((ws) => (
            <Grid size={{ xs: 12, md: 6 }} key={ws.name}>
              <Box sx={{ p: 3.5, bgcolor: '#08080c', borderRadius: '16px', border: '1px solid #18181b', borderLeft: `3px solid ${ws.color}`, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: ws.color, fontFamily: '"JetBrains Mono", monospace', fontSize: '1rem' }}>
                  {ws.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 2, lineHeight: 1.6 }}>
                  {ws.desc}
                </Typography>
                <Stack direction="row" spacing={0.8} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                  {ws.files.map((f) => (
                    <Chip
                      key={f}
                      label={f}
                      size="small"
                      sx={{ bgcolor: '#000000', color: '#71717a', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', border: '1px solid #18181b' }}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider sx={{ borderColor: '#18181b', mb: 8 }} />

      {/* Tech Stack */}
      <Container maxWidth="lg" disableGutters data-section>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
          <ArchitectureIcon sx={{ color: '#e5c158', fontSize: 22 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            Technology Stack
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          {techStack.map((t) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={t.label}>
              <Box sx={{
                p: 2.5, bgcolor: '#0a0a0f', borderRadius: '12px', border: '1px solid #18181b', textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': { borderColor: 'rgba(229, 193, 88, 0.3)', transform: 'translateY(-2px)' },
              }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem', mb: 0.3 }}>
                  {t.label}
                </Typography>
                <Chip label={t.version} size="small" sx={{ bgcolor: 'rgba(229, 193, 88, 0.08)', color: '#e5c158', fontWeight: 700, fontSize: '0.7rem', mb: 1, border: '1px solid rgba(229, 193, 88, 0.2)' }} />
                <Typography variant="caption" sx={{ color: '#71717a', display: 'block' }}>
                  {t.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
