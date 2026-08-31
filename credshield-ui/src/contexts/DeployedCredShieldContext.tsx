import React, { type PropsWithChildren, createContext, useContext, useMemo, useEffect } from 'react';
import {
  type DeployedCredShieldAPIProvider,
  BrowserDeployedCredShieldManager,
} from './BrowserDeployedCredShieldManager';
import { useWallet } from './WalletContext';
import { type Logger } from 'pino';

export const DeployedCredShieldContext = createContext<DeployedCredShieldAPIProvider | undefined>(undefined);

export type DeployedCredShieldProviderProps = PropsWithChildren<{
  logger: Logger;
}>;

export const DeployedCredShieldProvider: React.FC<Readonly<DeployedCredShieldProviderProps>> = ({
  logger,
  children,
}) => {
  const { connectedAPI } = useWallet();

  const manager = useMemo(() => new BrowserDeployedCredShieldManager(logger), [logger]);

  useEffect(() => {
    if (connectedAPI) {
      manager.setConnectedAPI(connectedAPI);
    }
  }, [connectedAPI, manager]);

  return <DeployedCredShieldContext.Provider value={manager}>{children}</DeployedCredShieldContext.Provider>;
};

export const useDeployedCredShieldContext = (): DeployedCredShieldAPIProvider => {
  const ctx = useContext(DeployedCredShieldContext);
  if (!ctx) throw new Error('useDeployedCredShieldContext must be used inside <DeployedCredShieldProvider>');
  return ctx;
};

export * from './BrowserDeployedCredShieldManager';
