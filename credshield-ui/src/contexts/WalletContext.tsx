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
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const NETWORK_ID = (import.meta.env.VITE_NETWORK_ID as string | undefined) ?? 'preprod';

const detectWallet = (): InitialAPI | undefined => {
  if (typeof window === 'undefined' || !window.midnight) return undefined;
  const midObj = window.midnight as Record<string, unknown>;

  // Check known Lace and 1AM Wallet keys
  for (const key of ['mn_lace', 'lace', 'mn_1am', '1am', '1am-wallet', 'midnight', 'MidnightWallet']) {
    const candidate = midObj[key];
    if (candidate && typeof candidate === 'object' && 'connect' in candidate) {
      return candidate as InitialAPI;
    }
  }

  // Fallback: iterate all entries in window.midnight
  for (const val of Object.values(midObj)) {
    if (val && typeof val === 'object' && 'connect' in val) {
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
      return;
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to authorize wallet connection.';
      setState((s) => ({
        ...s,
        status: 'error',
        walletName: null,
        walletIcon: null,
        errorMessage: msg,
        connectedAPI: null,
      }));
      connectedAPIRef.current = null;
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
