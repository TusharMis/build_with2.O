import React, { useState } from 'react';
import { AgentProvider, useAgent } from './context/AgentContext';
import { WalletProvider } from './context/WalletContext';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { AgentDashboard } from './components/AgentDashboard';
import { QuantumLearningLab } from './components/QuantumLearningLab';
import { QuantumCircuitLab } from './components/QuantumCircuitLab';
import { AIQuantumTutor } from './components/AIQuantumTutor';
import { HealthcareAnalysis } from './components/HealthcareAnalysis';
import { PaymentHistory } from './components/PaymentHistory';

function MainContent({ circuitPreset, setCircuitPreset }) {
  const { currentView, setCurrentView } = useAgent();

  const handleTryCircuit = (preset) => {
    setCircuitPreset(preset);
    setCurrentView('circuit');
  };

  switch (currentView) {
    case 'learning':
      return <QuantumLearningLab onTryCircuit={handleTryCircuit} />;
    case 'circuit':
      return <QuantumCircuitLab initialPreset={circuitPreset} />;
    case 'tutor':
      return <AIQuantumTutor />;
    case 'health':
      return <HealthcareAnalysis />;
    case 'agent':
      return <AgentDashboard />;
    case 'history':
      return <PaymentHistory />;
    case 'landing':
    default:
      return <LandingHero onTryCircuit={handleTryCircuit} />;
  }
}

export default function App() {
  const [circuitPreset, setCircuitPreset] = useState(null);

  return (
    <WalletProvider>
      <AgentProvider>
        <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col selection:bg-teal-500 selection:text-black">
          <Navbar />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
            <MainContent circuitPreset={circuitPreset} setCircuitPreset={setCircuitPreset} />
          </main>
          <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-[#080d1e]">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                Quantum AI HealthLab • Build With Bharat 2.0 Hackathon • Powered by <span className="text-teal-400">x402</span> on <span className="text-teal-400">Algorand Testnet</span>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                Algorand Testnet • GoPlausible Facilitator • Educational/Research Prototype
              </div>
            </div>
          </footer>
        </div>
      </AgentProvider>
    </WalletProvider>
  );
}
