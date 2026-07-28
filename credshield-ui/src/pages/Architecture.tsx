import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import LockIcon from '@mui/icons-material/Lock';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DnsIcon from '@mui/icons-material/Dns';
import HubIcon from '@mui/icons-material/Hub';

const publicState = [
  { field: 'credentialState', type: 'CredentialState', desc: 'UNINITIALIZED → ACTIVE → REVOKED enum lifecycle' },
  { field: 'credentialId', type: 'Bytes<32>', desc: 'Cryptographic 32-byte identifier hash of the credential' },
  { field: 'credentialMetadata', type: 'Maybe<Opaque<"string">>', desc: 'Optional human-readable metadata (degree title, badge name)' },
  { field: 'issuerAuthority', type: 'Bytes<32>', desc: 'persistentHash of (pad, sequence, secretKey) — issuer commitment' },
  { field: 'totalIssued', type: 'Counter', desc: 'Global on-chain counter of successful credential issuances' },
  { field: 'totalVerified', type: 'Counter', desc: 'Global counter of successful ZK verification proofs' },
  { field: 'sequence', type: 'Counter', desc: 'Internal sequence number for key derivation rotation' },
];

const privateWitness = [
  { field: 'secretKey', type: 'Bytes<32>', desc: 'Held strictly in local client memory (WitnessContext)' },
  { field: 'ZK Circuit Execution', type: 'Off-Chain', desc: 'Proof generation runs entirely client-side, never on-chain' },
  { field: 'Authority Derivation', type: 'persistentHash', desc: 'authorityPublicKey(sk, sequence) computed in zero-knowledge' },
  { field: 'Private State', type: 'In-Memory Provider', desc: 'Scoped per contract address, never persisted to network' },
];

const pipeline = [
  { step: '1', title: 'Compile Compact Contract', detail: 'compact compile src/credshield.compact → ZKIR, WASM proving keys, TypeScript bindings', color: '#e5c158' },
  { step: '2', title: 'Start Local Network', detail: 'docker compose -f standalone.yml up -d → node:9944, indexer:8088, proof-server:6300', color: '#22c55e' },
  { step: '3', title: 'Build API + CLI + UI', detail: 'yarn build across all workspace packages (contract → api → cli → ui)', color: '#60a5fa' },
  { step: '4', title: 'Deploy Contract Instance', detail: 'CLI standalone mode or Web DApp — uses genesis wallet on undeployed network', color: '#a78bfa' },
  { step: '5', title: 'Issue & Verify Credentials', detail: 'Execute ZK circuits via CredShieldAPI — proofs generated locally, verified on-chain', color: '#f472b6' },
];

const services = [
  { name: 'Midnight Node', port: '9944', image: 'midnightntwrk/midnight-node:0.22.3', desc: 'Local blockchain node with dev preset' },
  { name: 'Indexer', port: '8088', image: 'midnightntwrk/indexer-standalone:4.0.1', desc: 'GraphQL + WebSocket indexer API' },
  { name: 'Proof Server', port: '6300', image: 'midnightntwrk/proof-server:8.0.3', desc: 'ZK proof generation service' },
];

export default function Architecture() {
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
            { opacity: 0, y: 50 },
            {
              opacity: 1, y: 0,
              duration: 0.9, stagger: 0.15, ease: 'power3.out',
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
      {/* Header */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 8 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
          <Box sx={{ p: 1.2, bgcolor: 'rgba(229, 193, 88, 0.08)', borderRadius: '12px', border: '1px solid rgba(229, 193, 88, 0.2)' }}>
            <AccountTreeIcon sx={{ color: '#e5c158', fontSize: 24 }} />
          </Box>
          <Chip label="SYSTEM ARCHITECTURE" size="small" sx={{ bgcolor: '#18181b', color: '#a1a1aa', fontWeight: 700, letterSpacing: '0.08em', fontSize: '0.7rem' }} />
        </Stack>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.02em', mb: 1.5 }}>
          Architecture & State Model
        </Typography>
        <Typography variant="body1" sx={{ color: '#a1a1aa', maxWidth: 750, lineHeight: 1.7 }}>
          CredShield uses Midnight&apos;s hybrid ledger model — public state lives on-chain for verifiability
          while secret keys and witness computations remain strictly in local memory. The architecture guarantees
          complete privacy with zero trust assumptions.
        </Typography>
      </Container>

      {/* Public vs Private State */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 8 }} data-section>
        <Grid container spacing={3}>
          {/* Public State */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 4, bgcolor: '#08080c', borderRadius: '20px', border: '1px solid #1a1a1f', height: '100%' }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
                <StorageIcon sx={{ color: '#e5c158', fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Public State (On-Chain Ledger)</Typography>
              </Stack>
              <Stack spacing={2}>
                {publicState.map((item) => (
                  <Box key={item.field} sx={{ p: 2, bgcolor: '#000000', borderRadius: '10px', border: '1px solid #18181b' }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono", monospace', color: '#e5c158', fontWeight: 700, fontSize: '0.82rem' }}>
                        {item.field}
                      </Typography>
                      <Chip label={item.type} size="small" sx={{ bgcolor: '#18181b', color: '#71717a', fontWeight: 500, fontSize: '0.65rem', height: 20 }} />
                    </Stack>
                    <Typography variant="caption" sx={{ color: '#a1a1aa', lineHeight: 1.4 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Private Witness */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 4, bgcolor: '#08080c', borderRadius: '20px', border: '1px solid rgba(229, 193, 88, 0.15)', height: '100%' }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
                <LockIcon sx={{ color: '#22c55e', fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Private Witness (Local Memory)</Typography>
                <Chip label="NEVER ON-CHAIN" size="small" sx={{ bgcolor: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: 700, fontSize: '0.65rem', border: '1px solid rgba(34,197,94,0.3)' }} />
              </Stack>
              <Stack spacing={2} sx={{ mb: 4 }}>
                {privateWitness.map((item) => (
                  <Box key={item.field} sx={{ p: 2, bgcolor: '#000000', borderRadius: '10px', border: '1px solid #18181b' }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono", monospace', color: '#22c55e', fontWeight: 700, fontSize: '0.82rem' }}>
                        {item.field}
                      </Typography>
                      <Chip label={item.type} size="small" sx={{ bgcolor: '#18181b', color: '#71717a', fontWeight: 500, fontSize: '0.65rem', height: 20 }} />
                    </Stack>
                    <Typography variant="caption" sx={{ color: '#a1a1aa', lineHeight: 1.4 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {/* Visual Separator */}
              <Box sx={{ p: 3, bgcolor: 'rgba(34,197,94,0.04)', borderRadius: '12px', border: '1px dashed rgba(34,197,94,0.2)' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                  <CloudOffIcon sx={{ color: '#22c55e', fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#22c55e' }}>Zero Network Exposure</Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: '#a1a1aa', lineHeight: 1.5 }}>
                  The secret key generates an authority commitment via persistentHash inside the ZK circuit.
                  The raw key value is never serialized, transmitted, or stored anywhere outside the client process.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ borderColor: '#18181b', mb: 8 }} />

      {/* Deployment Pipeline */}
      <Container maxWidth="lg" disableGutters sx={{ mb: 8 }} data-section>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
          Deployment Pipeline
        </Typography>
        <Typography variant="body1" sx={{ color: '#a1a1aa', mb: 5 }}>
          From contract compilation to live ZK credential verification — all running locally.
        </Typography>

        <Stack spacing={2.5}>
          {pipeline.map((p) => (
            <Box
              key={p.step}
              sx={{
                p: 3,
                bgcolor: '#08080c',
                borderRadius: '16px',
                border: '1px solid #18181b',
                borderLeft: `3px solid ${p.color}`,
                transition: 'all 0.3s ease',
                '&:hover': { borderColor: p.color, transform: 'translateX(4px)' },
              }}
            >
              <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center' }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: '50%',
                  bgcolor: `${p.color}15`, border: `1px solid ${p.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '0.9rem', color: p.color, flexShrink: 0,
                }}>
                  {p.step}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.3, fontSize: '1rem' }}>{p.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#71717a', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem' }}>
                    {p.detail}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Container>

      <Divider sx={{ borderColor: '#18181b', mb: 8 }} />

      {/* Local Services */}
      <Container maxWidth="lg" disableGutters data-section>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
          <DnsIcon sx={{ color: '#e5c158', fontSize: 22 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            Local Network Services
          </Typography>
        </Stack>
        <Typography variant="body1" sx={{ color: '#a1a1aa', mb: 4 }}>
          All services use the <code style={{ color: '#e5c158' }}>undeployed</code> network ID with the <code style={{ color: '#e5c158' }}>dev</code> node preset.
          Lace Wallet auto-connects to these ports when set to &quot;Undeployed&quot; mode.
        </Typography>

        <Grid container spacing={2.5}>
          {services.map((svc) => (
            <Grid size={{ xs: 12, md: 4 }} key={svc.name}>
              <Box sx={{
                p: 3.5, bgcolor: '#0a0a0f', borderRadius: '16px', border: '1px solid #18181b', height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': { borderColor: 'rgba(229, 193, 88, 0.3)' },
              }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
                  <HubIcon sx={{ color: '#e5c158', fontSize: 18 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem' }}>{svc.name}</Typography>
                  <Chip label={`:${svc.port}`} size="small" sx={{ bgcolor: 'rgba(229, 193, 88, 0.08)', color: '#e5c158', fontWeight: 700, fontSize: '0.72rem', border: '1px solid rgba(229, 193, 88, 0.2)' }} />
                </Stack>
                <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono", monospace', color: '#71717a', fontSize: '0.78rem', mb: 1 }}>
                  {svc.image}
                </Typography>
                <Typography variant="body2" sx={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                  {svc.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Docker command */}
        <Box sx={{ mt: 4, p: 3, bgcolor: '#000000', borderRadius: '12px', border: '1px solid #18181b' }}>
          <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 600, letterSpacing: '0.06em', display: 'block', mb: 1 }}>
            QUICK START
          </Typography>
          <Box component="pre" sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem', color: '#d4d4d4', m: 0 }}>
{`# Start the full local Midnight network
docker compose -f standalone.yml up -d

# Check health of all services
docker compose -f standalone.yml ps

# View live logs
docker compose -f standalone.yml logs -f`}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
