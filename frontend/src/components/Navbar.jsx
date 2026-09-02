import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  ArrowLeft, 
  Wallet, 
  LogOut, 
  Coins, 
  Atom, 
  HeartPulse, 
  Cpu, 
  BookOpen, 
  Receipt, 
  Info,
  Layers
} from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import { useAlgorandWallet } from '../context/WalletContext';
import { WalletConnectModal } from './WalletConnectModal';
import { AboutModal } from './AboutModal';

export function Navbar() {
  const { currentView, setCurrentView, handleReset } = useAgent();
  const { isConnected, activeAddress, algoBalance, disconnectWallet } = useAlgorandWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Dashboard', icon: Layers },
    { id: 'learning', label: 'Quantum Learning', icon: BookOpen },
    { id: 'circuit', label: 'Circuit Lab', icon: Cpu },
    { id: 'tutor', label: 'AI Quantum Tutor', icon: Atom },
    { id: 'health', label: 'Healthcare Analysis', icon: HeartPulse, highlight: true },
    { id: 'agent', label: 'AI Health Agent', icon: Bot },
    { id: 'history', label: 'Payment History', icon: Receipt },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0B132B]/90 border-b border-slate-800">
        {/* Top Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Branding */}
          <div 
            onClick={() => { setCurrentView('landing'); handleReset(); }} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B132B] rounded-[10px] flex items-center justify-center">
                <Atom className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-teal-400 transition-colors">
                  Quantum AI <span className="text-teal-400">HealthLab</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  BWB 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Learn Quantum • Build Quantum AI • Apply to Healthcare
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Network Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Algorand Testnet</span>
            </div>

            {/* Wallet Button */}
            {isConnected ? (
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs">
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

            {/* About Modal Button */}
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
              title="About Project"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Bar Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 overflow-x-auto py-1 border-t border-slate-800/60 text-xs scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold shadow-sm'
                    : item.highlight
                    ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Wallet Modal */}
      <WalletConnectModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </>
  );
}
