import React, { useState } from 'react';
import { Bot, Sparkles, ArrowLeft, Wallet, LogOut, Coins } from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import { useAlgorandWallet } from '../context/WalletContext';
import { WalletConnectModal } from './WalletConnectModal';

export function Navbar() {
  const { currentView, setCurrentView, handleReset } = useAgent();
  const { isConnected, activeAddress, algoBalance, disconnectWallet } = useAlgorandWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0B132B]/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div 
            onClick={() => { setCurrentView('landing'); handleReset(); }} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B132B] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-teal-400 transition-colors">
                  Agentic<span className="text-teal-400">x402</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  BWB 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Algorand Testnet Micropayment Agent
              </p>
            </div>
          </div>

          {/* Center / Network Badge */}
          <div className="hidden md:flex items-center space-x-2 text-xs">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Algorand Testnet</span>
            </div>
          </div>

          {/* Right Header CTAs & Wallet Button */}
          <div className="flex items-center space-x-3">
            {/* Wallet Button in Navbar */}
            {isConnected ? (
              <div className="hidden sm:flex items-center space-x-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs">
                <div className="font-mono text-teal-300 font-medium">
                  {activeAddress.substring(0, 6)}...{activeAddress.substring(activeAddress.length - 4)}
                </div>
                <span className="text-slate-600">|</span>
                <div className="font-mono font-bold text-slate-200">
                  {algoBalance.toFixed(2)} ALGO
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-slate-400 hover:text-red-400 ml-1 p-0.5 transition-colors"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-300 bg-teal-950/60 hover:bg-teal-900/60 border border-teal-500/40 transition-colors"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Connect Wallet</span>
              </button>
            )}

            {/* View Switcher CTA */}
            {currentView === 'dashboard' ? (
              <button
                onClick={() => setCurrentView('landing')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-black bg-gradient-to-r from-teal-400 to-emerald-400 hover:opacity-95 shadow-md shadow-teal-500/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Agent</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Wallet Connect Modal */}
      <WalletConnectModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />
    </>
  );
}
