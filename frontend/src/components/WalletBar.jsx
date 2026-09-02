import React, { useState } from 'react';
import { 
  Wallet, 
  RefreshCw, 
  LogOut, 
  Copy, 
  Check, 
  Sparkles, 
  AlertTriangle,
  Coins,
  Trash2
} from 'lucide-react';
import { useAlgorandWallet } from '../context/WalletContext';
import { WalletConnectModal } from './WalletConnectModal';

export function WalletBar() {
  const { 
    isConnected, 
    activeAddress, 
    persistedAddress,
    algoBalance, 
    isBalanceLoading, 
    networkStatus, 
    disconnectWallet, 
    purgeWallet,
    refreshBalance 
  } = useAlgorandWallet();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (activeAddress) {
      navigator.clipboard.writeText(activeAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Column: Wallet Status & Network Info */}
          <div className="flex items-center space-x-3.5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              isConnected 
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40 shadow-lg shadow-teal-500/10' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              <Wallet className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white">Algorand Wallet</span>
                
                {/* Network Status Badge */}
                <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono">
                  <span className={`w-2 h-2 rounded-full ${networkStatus.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                  <span className="text-slate-200">{networkStatus.network}</span>
                  {networkStatus.lastRound && (
                    <span className="text-slate-400 hidden sm:inline">
                      (Block #{networkStatus.lastRound.toLocaleString()})
                    </span>
                  )}
                </div>

                {isConnected && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    Persisted in Browser
                  </span>
                )}
              </div>

              {/* Connected Address vs Prompt */}
              {isConnected ? (
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-mono text-xs text-teal-300 font-medium select-all">
                    {activeAddress}
                  </span>
                  <button
                    onClick={copyAddress}
                    className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors flex items-center space-x-1"
                    title="Copy full Algorand address"
                  >
                    {copied ? (
                      <span className="text-teal-400 text-xs flex items-center space-x-1 font-sans">
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400 mt-0.5">
                  {persistedAddress ? (
                    <span>
                      Saved demo account detected: <span className="font-mono text-teal-300">{persistedAddress.substring(0, 8)}...{persistedAddress.substring(persistedAddress.length - 6)}</span>. Click Connect to re-activate.
                    </span>
                  ) : (
                    <span>No wallet connected. Click below to connect or generate a persistent Algorand Testnet demo account.</span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Balance & Controls */}
          <div className="flex items-center space-x-3">
            {isConnected ? (
              <>
                {/* Real Live ALGO Balance */}
                <div className="bg-black/50 border border-slate-800 rounded-xl px-4 py-2 text-right">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Real Testnet Balance
                  </div>
                  <div className="font-mono text-sm font-bold text-teal-300 flex items-center justify-end space-x-1 mt-0.5">
                    <Coins className="w-3.5 h-3.5 text-teal-400" />
                    <span>{algoBalance.toFixed(4)} ALGO</span>
                  </div>
                </div>

                {/* Refresh Balance Button */}
                <button
                  onClick={refreshBalance}
                  disabled={isBalanceLoading}
                  className={`p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700 flex items-center space-x-1.5 ${
                    isBalanceLoading ? 'opacity-75' : ''
                  }`}
                  title="Query live ALGO balance from Algorand Testnet node"
                >
                  <RefreshCw className={`w-4 h-4 ${isBalanceLoading ? 'animate-spin text-teal-400' : ''}`} />
                  <span className="text-xs hidden lg:inline">Refresh</span>
                </button>

                {/* Disconnect UI Session Button (Does NOT delete saved account) */}
                <button
                  onClick={disconnectWallet}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
                  title="Disconnect active session (Account remains saved in browser)"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </>
            ) : (
              /* Connect Wallet Button */
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-black bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 shadow-md shadow-teal-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{persistedAddress ? 'Reconnect Demo Wallet' : 'Connect / Create Demo Wallet'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Testnet Security Notice Banner when Connected */}
        {isConnected && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5 text-amber-400/90">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Testnet Demo Account (Reusable across disconnects & page reloads).</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-500 font-mono">
              <span>Algonode API</span>
              <span>•</span>
              <button
                onClick={purgeWallet}
                className="text-red-400/70 hover:text-red-400 transition-colors flex items-center space-x-1 font-sans"
                title="Permanently remove saved account from browser"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Saved Account</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Connect Modal */}
      <WalletConnectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
