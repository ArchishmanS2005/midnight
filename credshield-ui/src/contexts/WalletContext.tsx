import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type PropsWithChildren,
} from 'react';
import {
  type InitialAPI,
  type ConnectedAPI,
} from '@midnight-ntwrk/dapp-connector-api';

export type WalletStatus =
  | 'idle'
  | 'detecting'
  | 'connecting'
  | 'connected'
  | 'error';

export interface WalletState {
  status: WalletStatus;
  walletName: string | null;
  walletIcon: string | null;
  networkId: string | null;
  shieldedAddress: string | null;
  dustBalance: bigint | null;
  errorMessage: string | null;
  connectedAPI: ConnectedAPI | null;
}

export interface WalletContextValue extends WalletState {
  connect: () => Promise<boolean>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

import { setNetworkId, type NetworkId } from '@midnight-ntwrk/midnight-js-network-id';

const NETWORK_ID = (import.meta.env.VITE_NETWORK_ID as string | undefined) ?? 'undeployed';
setNetworkId(NETWORK_ID as NetworkId);

const detectWallet = (): InitialAPI | undefined => {
  if (typeof window === 'undefined' || !window.midnight) return undefined;
  const midObj = window.midnight as Record<string, unknown>;

  // DApp Connector API v4: wallets inject under window.midnight using UUID keys.
  // Each value is an InitialAPI with { name, icon, connect, ... }
  // We iterate all entries and return the first valid wallet found.
  for (const [key, val] of Object.entries(midObj)) {
    if (val && typeof val === 'object' && 'connect' in val && typeof (val as any).connect === 'function') {
      console.log(`[CredShield] Detected wallet "${(val as any).name ?? key}" under key "${key}"`);
      return val as InitialAPI;
    }
  }

  return undefined;
};

export const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<WalletState>({
    status: 'idle',
    walletName: null,
    walletIcon: null,
    networkId: null,
    shieldedAddress: null,
    dustBalance: null,
    errorMessage: null,
    connectedAPI: null,
  });

  const connectedAPIRef = useRef<ConnectedAPI | null>(null);

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, status: 'detecting', errorMessage: null }));

    // Debug: log what's available in window.midnight
    if (typeof window !== 'undefined' && window.midnight) {
      console.log('[CredShield] window.midnight keys:', Object.keys(window.midnight as object));
    }

    let wallet: InitialAPI | undefined;
    for (let i = 0; i < 25; i++) {
      wallet = detectWallet();
      if (wallet) break;
      await new Promise((r) => setTimeout(r, 200));
    }

    if (!wallet) {
      setState((s) => ({
        ...s,
        status: 'error',
        errorMessage:
          'Lace / 1AM Wallet extension not detected. Please install the Lace or 1AM Wallet browser extension and refresh.',
      }));
      return false;
    }

    const walletName = wallet.name ?? 'Lace / 1AM Wallet';
    const walletIcon = wallet.icon ?? null;
    setState((s) => ({ ...s, status: 'connecting', walletName, walletIcon }));

    try {
      const connectedAPI = await wallet.connect(NETWORK_ID);
      connectedAPIRef.current = connectedAPI;

      const [connectionStatus, shieldedAddrs, dustBal] = await Promise.all([
        connectedAPI.getConnectionStatus(),
        connectedAPI.getShieldedAddresses().catch(() => null),
        connectedAPI.getDustBalance().catch(() => null),
      ]);

      const netId =
        connectionStatus.status === 'connected' ? connectionStatus.networkId : NETWORK_ID;

      setState({
        status: 'connected',
        walletName,
        walletIcon,
        networkId: netId,
        shieldedAddress: shieldedAddrs?.shieldedAddress ?? null,
        dustBalance: dustBal?.balance ?? null,
        errorMessage: null,
        connectedAPI,
      });
      return true;
    } catch (err: unknown) {
      console.error('WALLET CONNECT ERROR:', err);
      // APIError from the DApp Connector has a numeric `code` and string `info` field instead of `message`
      let msg = 'Failed to authorize wallet connection.';
      if (err && typeof err === 'object') {
        const apiErr = err as Record<string, unknown>;
        if (typeof apiErr['info'] === 'string' && apiErr['info'].trim() !== '') {
          msg = apiErr['info'];
        } else if (typeof apiErr['message'] === 'string' && apiErr['message'].trim() !== '' && apiErr['message'] !== 'APIError') {
          msg = apiErr['message'];
        } else if (err instanceof Error && err.message !== 'APIError') {
          msg = err.message;
        }
      }
      // Provide a clearer hint if the user simply dismissed the wallet popup or had a network mismatch
      if (msg.includes('Network ID mismatch')) {
        msg = `Network mismatch detected. The app requires the '${NETWORK_ID}' network. Please switch your wallet to the correct network and try again.`;
      } else if (!msg || msg.trim() === '' || msg === 'Failed to authorize wallet connection.') {
        msg = 'Wallet authorization was rejected or timed out. Please approve the connection in your Lace / 1AM Wallet popup.';
      }
      
      console.error('Reason:', msg);

      setState((s) => ({
        ...s,
        status: 'error',
        walletName: null,
        walletIcon: null,
        errorMessage: msg,
        connectedAPI: null,
      }));
      connectedAPIRef.current = null;
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    connectedAPIRef.current = null;
    setState({
      status: 'idle',
      walletName: null,
      walletIcon: null,
      networkId: null,
      shieldedAddress: null,
      dustBalance: null,
      errorMessage: null,
      connectedAPI: null,
    });
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextValue => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used inside <WalletProvider>');
  return ctx;
};
