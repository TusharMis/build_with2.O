import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { walletService } from '../services/wallet';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  // Initialize from persisted localStorage account
  const [activeAccount, setActiveAccount] = useState(() => walletService.activeAccount);
  const [persistedAccount, setPersistedAccount] = useState(() => walletService.getPersistedAccount());
  const [algoBalance, setAlgoBalance] = useState(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkStatus, setNetworkStatus] = useState({
    network: 'Algorand Testnet',
    isOnline: true,
    lastRound: null
  });

  // Query live network status from Algorand Testnet node
  const fetchNetworkStatus = useCallback(async () => {
    const status = await walletService.getNetworkStatus();
    setNetworkStatus(status);
  }, []);

  // Query live ALGO balance from Algorand Testnet node
  const refreshBalance = useCallback(async () => {
    const account = walletService.activeAccount;
    if (!account?.address) {
      setAlgoBalance(0);
      return;
    }

    setIsBalanceLoading(true);
    try {
      const balanceInfo = await walletService.getAccountBalance(account.address);
      setAlgoBalance(balanceInfo.algoBalance);
    } catch (err) {
      console.warn('Balance refresh error:', err);
    } finally {
      setIsBalanceLoading(false);
    }
  }, []);

  // Poll network status on mount
  useEffect(() => {
    fetchNetworkStatus();
    const netInterval = setInterval(fetchNetworkStatus, 20000);
    return () => clearInterval(netInterval);
  }, [fetchNetworkStatus]);

  // Load balance whenever activeAccount changes or on initial mount
  useEffect(() => {
    if (activeAccount?.address) {
      refreshBalance();
    } else {
      setAlgoBalance(0);
    }
    setPersistedAccount(walletService.getPersistedAccount());
  }, [activeAccount, refreshBalance]);

  // Connect or re-connect to existing persisted demo account
  const connectWithDemoAccount = () => {
    const account = walletService.connectWithDemoAccount();
    setActiveAccount({ ...account });
    setPersistedAccount(walletService.getPersistedAccount());
    refreshBalance();
    return account;
  };

  // Generate a brand new fresh demo account (deliberate reset)
  const generateFreshDemoAccount = () => {
    const account = walletService.generateAndPersistFreshAccount();
    setActiveAccount({ ...account });
    setPersistedAccount(walletService.getPersistedAccount());
    refreshBalance();
    return account;
  };

  // Import from 25-word mnemonic & Persist
  const connectWithMnemonic = (mnemonic) => {
    const account = walletService.importAndPersistMnemonic(mnemonic);
    setActiveAccount({ ...account });
    setPersistedAccount(walletService.getPersistedAccount());
    refreshBalance();
    return account;
  };

  // Connect browser extension wallet
  const connectBrowserWallet = async () => {
    setIsConnecting(true);
    try {
      const account = await walletService.connectBrowserWallet();
      setActiveAccount({ ...account });
      setPersistedAccount(walletService.getPersistedAccount());
      await refreshBalance();
      return account;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect UI session (keeps persisted account safe in localStorage)
  const disconnectWallet = () => {
    walletService.disconnect();
    setActiveAccount(null);
    setAlgoBalance(0);
    setPersistedAccount(walletService.getPersistedAccount());
  };

  // Deliberate destructive action: removes account from localStorage
  const purgeWallet = () => {
    walletService.purgePersistedAccount();
    setActiveAccount(null);
    setAlgoBalance(0);
    setPersistedAccount(null);
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected: !!activeAccount?.address,
        activeAddress: activeAccount?.address || null,
        activeAccount,
        persistedAccount,
        persistedAddress: persistedAccount?.address || null,
        algoBalance,
        isBalanceLoading,
        isConnecting,
        networkStatus,
        connectBrowserWallet,
        connectWithDemoAccount,
        generateFreshDemoAccount,
        connectWithMnemonic,
        disconnectWallet,
        purgeWallet,
        refreshBalance,
        getSigner: () => walletService.getSigner()
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useAlgorandWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useAlgorandWallet must be used within a WalletProvider');
  }
  return context;
}
