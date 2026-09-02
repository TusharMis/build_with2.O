import React from 'react';
import { AgentProvider, useAgent } from './context/AgentContext';
import { WalletProvider } from './context/WalletContext';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { AgentDashboard } from './components/AgentDashboard';

function MainContent() {
  const { currentView } = useAgent();

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
      {currentView === 'landing' ? <LandingHero /> : <AgentDashboard />}
    </main>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <AgentProvider>
        <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col selection:bg-teal-500 selection:text-black">
          <Navbar />
          <MainContent />
          <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-[#080d1e]">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                Build With Bharat 2.0 Hackathon • Agentic Solutions Powered by <span className="text-teal-400">x402</span> on <span className="text-teal-400">Algorand Testnet</span>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                Algorand Testnet • GoPlausible Facilitator
              </div>
            </div>
          </footer>
        </div>
      </AgentProvider>
    </WalletProvider>
  );
}
