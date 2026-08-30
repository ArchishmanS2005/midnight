import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Link as MuiLink,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import { useWallet } from '../contexts/WalletContext';

export default function AppLayout() {
  const { pathname } = useLocation();
  const wallet = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/architecture', label: 'Architecture' },
    { to: '/demo', label: 'Live Demo' },
    { to: '/about', label: 'About' },
  ];

  const isConnected = wallet.status === 'connected';

  const shortAddr = (addr: string | null): string => {
    if (!addr) return '';
    if (addr.length <= 16) return addr;
    return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
  };

  const handleMobileClose = () => setMobileOpen(false);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#030304' }}>
      {/* Navigation Header */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          bgcolor: 'rgba(3, 3, 4, 0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #18181b',
          py: 1.5,
          px: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Logo */}
            <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
              <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Box
                  sx={{
                    p: 1,
                    bgcolor: 'rgba(229, 193, 88, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(229, 193, 88, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ShieldIcon sx={{ color: '#e5c158', fontSize: 22 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.1 }}>
                    CredShield
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#a1a1aa', fontWeight: 600, letterSpacing: '0.06em', fontSize: '0.6rem' }}>
                    MIDNIGHT ZK VC • PREPROD NETWORK
                  </Typography>
                </Box>
              </Link>

              {/* Nav Links — desktop only */}
              <Stack direction="row" spacing={1} sx={{ ml: 3, display: { xs: 'none', md: 'flex' } }}>
                {links.map((l) => {
                  const isActive = pathname === l.to;
                  return (
                    <Button
                      key={l.to}
                      component={Link}
                      to={l.to}
                      size="small"
                      sx={{
                        color: isActive ? '#e5c158' : '#a1a1aa',
                        fontWeight: isActive ? 800 : 500,
                        px: 2,
                        py: 0.8,
                        borderRadius: '10px',
                        bgcolor: isActive ? 'rgba(229, 193, 88, 0.1)' : 'transparent',
                        border: isActive ? '1px solid rgba(229, 193, 88, 0.25)' : '1px solid transparent',
                        '&:hover': {
                          color: '#ffffff',
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      {l.label}
                    </Button>
                  );
                })}
              </Stack>
            </Stack>

            {/* Right side — wallet + mobile burger */}
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              {/* Privacy label chip — desktop */}
              <Chip
                icon={<LockIcon sx={{ fontSize: 12, color: '#e5c158 !important' }} />}
                label="ZK Privacy"
                size="small"
                sx={{ bgcolor: 'rgba(229,193,88,0.08)', color: '#e5c158', border: '1px solid rgba(229,193,88,0.2)', fontSize: '0.7rem', display: { xs: 'none', sm: 'flex' } }}
              />

              <Button
                component={Link}
                to="/demo"
                variant="contained"
                size="small"
                sx={{
                  bgcolor: isConnected ? 'rgba(34, 197, 94, 0.15)' : '#e5c158',
                  color: isConnected ? '#22c55e' : '#000000',
                  border: isConnected ? '1px solid rgba(34, 197, 94, 0.4)' : 'none',
                  fontWeight: 800,
                  px: { xs: 2, sm: 2.5 },
                  py: 1,
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  '&:hover': {
                    bgcolor: isConnected ? 'rgba(34, 197, 94, 0.25)' : '#f5d36c',
                  },
                }}
              >
                {isConnected
                  ? `✓ ${shortAddr(wallet.shieldedAddress) || 'Connected'}`
                  : 'Connect Wallet'}
              </Button>

              {/* Mobile hamburger */}
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ color: '#ffffff', display: { xs: 'flex', md: 'none' } }}
                aria-label="Open navigation menu"
              >
                <MenuIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleMobileClose}
        PaperProps={{ sx: { bgcolor: '#09090c', color: '#fff', width: 260, borderLeft: '1px solid #18181b' } }}
      >
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #18181b' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ShieldIcon sx={{ color: '#e5c158', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>CredShield</Typography>
          </Stack>
          <IconButton onClick={handleMobileClose} sx={{ color: '#ffffff' }} aria-label="Close navigation menu">
            <CloseIcon />
          </IconButton>
        </Stack>
        <List>
          {links.map((l) => {
            const isActive = pathname === l.to;
            return (
              <ListItem key={l.to} disablePadding>
                <ListItemButton
                  component={Link}
                  to={l.to}
                  onClick={handleMobileClose}
                  sx={{
                    color: isActive ? '#e5c158' : '#a1a1aa',
                    bgcolor: isActive ? 'rgba(229, 193, 88, 0.08)' : 'transparent',
                    borderLeft: isActive ? '3px solid #e5c158' : '3px solid transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#fff' },
                  }}
                >
                  <ListItemText primary={l.label} primaryTypographyProps={{ fontWeight: isActive ? 800 : 500 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ p: 2, mt: 'auto', borderTop: '1px solid #18181b' }}>
          <Chip
            icon={<LockIcon sx={{ fontSize: 12, color: '#e5c158 !important' }} />}
            label="ZK Privacy — secretKey never exposed"
            size="small"
            sx={{ bgcolor: 'rgba(229,193,88,0.08)', color: '#a1a1aa', border: '1px solid rgba(229,193,88,0.2)', fontSize: '0.7rem' }}
          />
        </Box>
      </Drawer>

      {/* Main Outlet */}
      <Container maxWidth="lg" component="main" sx={{ flexGrow: 1, pt: 4, pb: 8 }}>
        <Outlet />
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          borderTop: '1px solid #18181b',
          bgcolor: '#000000',
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <ShieldIcon sx={{ color: '#e5c158', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#ffffff' }}>
                CredShield Protocol
              </Typography>
              <Typography variant="caption" sx={{ color: '#71717a' }}>
                • Midnight Blockchain • ZK Privacy
              </Typography>
            </Stack>

            <Stack direction="row" spacing={3}>
              <MuiLink href="https://docs.midnight.network" target="_blank" rel="noreferrer" underline="hover" sx={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                Midnight Docs
              </MuiLink>
              <MuiLink href="https://midnight.network" target="_blank" rel="noreferrer" underline="hover" sx={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                Midnight Network
              </MuiLink>
              <MuiLink href="https://github.com/ArchishmanS2005/midnight" target="_blank" rel="noreferrer" underline="hover" sx={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                GitHub
              </MuiLink>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
