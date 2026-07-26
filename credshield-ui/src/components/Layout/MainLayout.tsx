import React, { type PropsWithChildren } from 'react';
import { Box, Container, Typography, Link, Stack } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import { Header } from './Header';

export type MainLayoutProps = PropsWithChildren<{
  onJoinContract?: (contractAddress: string) => void;
  onDeployContract?: () => void;
}>;

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  onJoinContract,
  onDeployContract,
}) => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#030304' }}>
      <Header onJoinContract={onJoinContract} onDeployContract={onDeployContract} />

      <Container maxWidth="lg" component="main" sx={{ flexGrow: 1, pt: 5, pb: 8 }}>
        {children}
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
              <ShieldIcon sx={{ color: '#ffffff', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#ffffff' }}>
                CredShield Protocol
              </Typography>
              <Typography variant="caption" sx={{ color: '#71717a' }}>
                • Built on Midnight Blockchain Testnet
              </Typography>
            </Stack>

            <Stack direction="row" spacing={3}>
              <Link href="https://docs.midnight.network" target="_blank" rel="noreferrer" underline="hover" sx={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                Midnight Docs
              </Link>
              <Link href="https://midnight.network" target="_blank" rel="noreferrer" underline="hover" sx={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                Midnight Network
              </Link>
              <Link href="https://github.com/Boredooms/credshield" target="_blank" rel="noreferrer" underline="hover" sx={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                GitHub Repository
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
