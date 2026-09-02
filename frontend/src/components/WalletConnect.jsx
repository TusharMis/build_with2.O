import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Key, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  LogOut, 
  AlertCircle,
  Coins,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { walletService, TESTNET_USDC_ASA } from '../services/wallet';

export function WalletConnect({ onWalletUpdated }) {
  const [activeAccount, setActiveAccount] = useState(walletService.activeAccount);
  const [balances, setBalances] = useState({ algo: 0, usdc: 0, usdcOptedIn: false });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOptingIn, setIsOptingIn] = useState(false);
  const [optInSuccess, setOptInSuccess] = useState(false);
  const [optInError, setOptInError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showMnemonicModal, setShowMnemonicModal] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importError, setImportError] = useState('');

  const fetchBalance = async (addr) => {
    if (!addr) return;
    setIsRefreshing(true);
    try {
      const b = await walletService.getBalances(addr);
      setBalances(b);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (activeAccount?.addr) {
      fetchBalance(activeAccount.addr);
    }
  }, [activeAccount]);

  const handleGenerate = () => {
    const acc = walletService.generateDemoAccount();
    setActiveAccount({ ...acc });
    fetchBalance(acc.addr);
    onWalletUpdated && onWalletUpdated(acc);
    setShowMnemonicModal(true);
  };

  const handleImport = (e) => {
    e.preventDefault();
    setImportError('');
    try {
      let acc;
      if (importInput.trim().split(/\s+/).length >= 24) {
        acc = walletService.importFromMnemonic(importInput);
      } else {
        acc = walletService.importFromPrivateKey(importInput);
      }
      setActiveAccount({ ...acc });
      fetchBalance(acc.addr);
      setShowImportModal(false);
      setImportInput('');
      onWalletUpdated && onWalletUpdated(acc);
    } catch (err) {
      setImportError(`Failed to import: ${err.message}`);
    }
  };

  const handleOptIn = async () => {
    if (!activeAccount) return;
    setIsOptingIn(true);
    setOptInError('');
    setOptInSuccess(false);

    try {
      if (balances.algo < 0.1) {
        throw new Error('You need at least 0.1 Testnet ALGO to cover the transaction fee. Use the Testnet Dispenser below.');
      }
      await walletService.optInToUsdc();
      setOptInSuccess(true);
      await fetchBalance(activeAccount.addr);
      setTimeout(() => setOptInSuccess(false), 4000);
    } catch (err) {
      setOptInError(err.message || 'Opt-in failed');
    } finally {
      setIsOptingIn(false);
    }
  };

  const handleDisconnect = () => {
    walletService.disconnect();
    setActiveAccount(null);
    setBalances({ algo: 0, usdc: 0, usdcOptedIn: false });
    onWalletUpdated && onWalletUpdated(null);
  };

  const copyAddress = () => {
    if (activeAccount?.addr) {
      navigator.clipboard.writeText(activeAccount.addr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Account Info */}
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            activeAccount ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40' : 'bg-slate-800 text-slate-400'
          }`}>
            <Wallet className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-white">Algorand Testnet Wallet</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeAccount ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {activeAccount ? 'Connected' : 'No Wallet Connected'}
              </span>
              {activeAccount && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  balances.usdcOptedIn 
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {balances.usdcOptedIn ? '✓ USDC Opted In' : '⚠ USDC Not Opted In'}
                </span>
              )}
            </div>

            {activeAccount ? (
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="font-mono text-xs text-teal-300">
                  {activeAccount.addr.substring(0, 10)}...{activeAccount.addr.substring(activeAccount.addr.length - 8)}
                </span>
                <button
                  onClick={copyAddress}
                  className="text-slate-400 hover:text-white p-0.5 transition-colors"
                  title="Copy full address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {activeAccount.mnemonic && (
                  <button
                    onClick={() => setShowMnemonicModal(true)}
                    className="text-[10px] text-slate-400 hover:text-slate-200 underline pl-1"
                  >
                    View Passphrase
                  </button>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-0.5">
                Connect or generate an Algorand Testnet account to sign x402 payments.
              </p>
            )}
          </div>
        </div>

        {/* Action Controls & Balances */}
        <div className="flex flex-wrap items-center gap-2.5">
          {activeAccount ? (
            <>
              {/* Balances */}
              <div className="text-right text-xs bg-black/40 px-3 py-1.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-end space-x-2 font-mono text-slate-200">
                  <span className={balances.algo > 0 ? 'text-emerald-400' : 'text-slate-400'}>
                    {balances.algo.toFixed(2)} ALGO
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className={balances.usdc > 0 ? 'text-teal-400 font-semibold' : 'text-slate-400'}>
                    {balances.usdc.toFixed(2)} USDC
                  </span>
                </div>
                <div className="flex items-center justify-end space-x-2 text-[10px] text-slate-400 mt-0.5">
                  <a
                    href={`https://lora.algokit.io/testnet/fund`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:underline flex items-center space-x-0.5"
                  >
                    <span>Lora Faucet</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <span>•</span>
                  <a
                    href={`https://bank.testnet.algorand.network/?account=${activeAccount.addr}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:underline flex items-center space-x-0.5"
                  >
                    <span>Dispenser</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* 1-Click Opt-In Button if not opted in */}
              {!balances.usdcOptedIn && (
                <button
                  onClick={handleOptIn}
                  disabled={isOptingIn}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                  title="Opt-in to USDC (Asset 10458941) so your wallet can hold and transfer USDC"
                >
                  {isOptingIn ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>{isOptingIn ? 'Opting in...' : 'Opt-In to USDC (1-Click)'}</span>
                </button>
              )}

              <button
                onClick={() => fetchBalance(activeAccount.addr)}
                className={`p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                title="Refresh balances"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleDisconnect}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors"
                title="Disconnect"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleGenerate}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-teal-400 to-emerald-400 hover:opacity-95 shadow-md shadow-teal-500/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Testnet Account</span>
              </button>

              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Import Key / Passphrase</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Opt-in feedback */}
      {optInSuccess && (
        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Successfully opted into Testnet USDC (ASA 10458941)! You are now ready for x402 micropayments.</span>
        </div>
      )}

      {optInError && (
        <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{optInError}</span>
        </div>
      )}

      {/* View Passphrase Modal */}
      {showMnemonicModal && activeAccount?.mnemonic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1C2541] border border-teal-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Your Testnet Account Passphrase</span>
              </h3>
              <button
                onClick={() => setShowMnemonicModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Save this 25-word passphrase if you want to reuse this account in Pera Wallet, Defly, or Lora Testnet.
            </p>

            <div className="p-3 bg-black/60 rounded-xl border border-slate-700 font-mono text-xs text-teal-300 select-all leading-relaxed">
              {activeAccount.mnemonic}
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="font-semibold text-white">Next step to get funded:</div>
              <p className="text-slate-400">
                1. Go to <a href={`https://lora.algokit.io/testnet/fund`} target="_blank" rel="noopener noreferrer" className="text-teal-400 underline">Lora Fund Testnet</a> or <a href={`https://bank.testnet.algorand.network/?account=${activeAccount.addr}`} target="_blank" rel="noopener noreferrer" className="text-teal-400 underline">Algorand Dispenser</a>.
              </p>
              <p className="text-slate-400">
                2. Paste your address: <span className="font-mono text-teal-300">{activeAccount.addr.substring(0, 12)}...</span>
              </p>
            </div>

            <button
              onClick={() => setShowMnemonicModal(false)}
              className="w-full py-2 rounded-xl text-xs font-semibold text-black bg-teal-400 hover:bg-teal-300"
            >
              I have saved my passphrase
            </button>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1C2541] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Key className="w-4 h-4 text-teal-400" />
              <span>Import Algorand Testnet Account</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your 25-word Algorand Testnet passphrase or 64-byte private key.
            </p>

            <form onSubmit={handleImport} className="space-y-3">
              <textarea
                value={importInput}
                onChange={(e) => setImportInput(e.target.value)}
                placeholder="Paste 25-word mnemonic passphrase or base64 key..."
                rows={3}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
              />

              {importError && (
                <div className="text-red-400 text-xs flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-black bg-teal-400 hover:bg-teal-300"
                >
                  Import Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
