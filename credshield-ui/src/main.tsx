import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './config/theme';
import { DeployedCredShieldProvider, WalletProvider } from './contexts';
import pino from 'pino';

const logger = pino({ level: 'trace' });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WalletProvider>
        <DeployedCredShieldProvider logger={logger}>
          <App />
        </DeployedCredShieldProvider>
      </WalletProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
