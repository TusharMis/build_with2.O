import React from 'react';
import { 
  Atom, 
  HeartPulse, 
  Cpu, 
  Bot, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  Zap, 
  Layers, 
  Lock, 
  BarChart3, 
  BookOpen, 
  Receipt,
  Network
} from 'lucide-react';
import { useAgent } from '../context/AgentContext';

export function LandingHero({ onTryCircuit }) {
  const { setCurrentView, handleSendPrompt } = useAgent();

  const handleQuickAgent = (prompt) => {
    setCurrentView('agent');
    setTimeout(() => {
      handleSendPrompt(prompt);
    }, 150);
  };

  return (
    <div className="space-y-16 pb-20 max-w-6xl mx-auto px-4">
      {/* Hero Header */}
      <section className="relative pt-10 pb-6 text-center space-y-6">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hackathon Header Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            🤖 AI Agent
          </span>
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            ⚛️ Quantum ML
          </span>
          <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            🩺 Healthcare AI
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            💳 x402 Micropayments
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            ⛓️ Algorand Testnet
          </span>
        </div>

        {/* Project Headline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Quantum AI <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">HealthLab</span>
          </h1>
          <p className="text-lg sm:text-xl text-teal-300 font-medium">
            "Learn Quantum. Build Quantum AI. Apply It to Healthcare."
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            An integrated agentic platform bridging interactive quantum algorithm education, multi-qubit circuit simulation, an intelligent AI tutor, classical machine learning baselines, and a 4-qubit Variational Quantum Classifier (VQC) for healthcare disease-risk evaluation — powered by <strong className="text-white">x402</strong> on <strong className="text-white">Algorand Testnet</strong>.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentView('health')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <HeartPulse className="w-4 h-4 text-black" />
            <span>Healthcare Disease Analysis (0.1 ALGO)</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => setCurrentView('learning')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-teal-300 bg-teal-950/40 hover:bg-teal-900/60 border border-teal-500/30 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Quantum Lab</span>
          </button>

          <button
            onClick={() => setCurrentView('circuit')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all"
          >
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>Quantum Circuit Builder</span>
          </button>
        </div>
      </section>

      {/* Module Navigation Showcase Cards */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-white">Platform Modules & Features</h2>
          <p className="text-xs text-slate-400">Select any module to begin exploring</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Quantum Learning Lab */}
          <div
            onClick={() => setCurrentView('learning')}
            className="bg-slate-900/90 hover:bg-slate-850 p-6 rounded-2xl border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all duration-200 shadow-xl space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors">
              Quantum Learning Lab
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              12 interactive topics: Qubits, Superposition, Entanglement, Quantum Measurement, Hadamard, Pauli, CNOT, and QML.
            </p>
            <div className="flex items-center text-xs font-semibold text-teal-400 pt-1">
              <span>Open Learning Lab</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Quantum Circuit Lab */}
          <div
            onClick={() => setCurrentView('circuit')}
            className="bg-slate-900/90 hover:bg-slate-850 p-6 rounded-2xl border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all duration-200 shadow-xl space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors">
              Quantum Circuit Lab
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visual multi-qubit circuit builder with statevector math, Bell states, GHZ entanglement, and 1024-shot probability histograms.
            </p>
            <div className="flex items-center text-xs font-semibold text-teal-400 pt-1">
              <span>Launch Simulator</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: AI Quantum Tutor */}
          <div
            onClick={() => setCurrentView('tutor')}
            className="bg-slate-900/90 hover:bg-slate-850 p-6 rounded-2xl border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all duration-200 shadow-xl space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Atom className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors">
              AI Quantum Tutor
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask questions about superposition, gate matrices, QML vs Classical ML, and why quantum mechanics aids healthcare analysis.
            </p>
            <div className="flex items-center text-xs font-semibold text-teal-400 pt-1">
              <span>Ask Quantum Tutor</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Healthcare Analysis (x402 Protected) */}
          <div
            onClick={() => setCurrentView('health')}
            className="bg-slate-900/90 hover:bg-slate-850 p-6 rounded-2xl border border-amber-500/40 hover:border-amber-500/70 cursor-pointer transition-all duration-200 shadow-xl space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                0.1 ALGO (x402)
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Healthcare Disease-Risk Analysis
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-world patient evaluation comparing Classical Logistic Regression (84.5% acc) with 4-Qubit VQC (81.2% acc) gated by x402 on Algorand.
            </p>
            <div className="flex items-center text-xs font-semibold text-amber-400 pt-1">
              <span>Perform Paid Analysis</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: AI Health Agent */}
          <div
            onClick={() => setCurrentView('agent')}
            className="bg-slate-900/90 hover:bg-slate-850 p-6 rounded-2xl border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all duration-200 shadow-xl space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors">
              AI Health Agent
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous chat agent that routes prompts to free tools or triggers the x402 payment flow for healthcare risk evaluation.
            </p>
            <div className="flex items-center text-xs font-semibold text-teal-400 pt-1">
              <span>Chat with Agent</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Payment History */}
          <div
            onClick={() => setCurrentView('history')}
            className="bg-slate-900/90 hover:bg-slate-850 p-6 rounded-2xl border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all duration-200 shadow-xl space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors">
              Payment History & Audit
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              View on-chain proof of execution with verified Algorand Testnet round numbers, timestamps, and Lora Algokit explorer links.
            </p>
            <div className="flex items-center text-xs font-semibold text-teal-400 pt-1">
              <span>View Payment Ledger</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & x402 Flow Visualization */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-white">Full-Stack Architecture & x402 Flow</h3>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            From user prompt to on-chain Algorand Testnet verification and hybrid QML inference.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-black/60 border border-slate-800">
          <pre className="font-mono text-xs text-teal-300 leading-relaxed overflow-x-auto whitespace-pre">
{`                        USER / CLINICAL RESEARCHER
                                   │
                                   ▼
                    REACT DASHBOARD & AGENTIC UI
                                   │
                                   ▼
                            AI HEALTH AGENT
                    (Intent & Tool Orchestrator)
                                   │
                                   ▼
                    POST /api/health/analyze (Protected)
                                   │
                                   ▼
                        HTTP 402 PAYMENT REQUIRED
                     (Challenge: 0.1 ALGO / 100k μA)
                                   │
                                   ▼
                        ALGORAND TESTNET WALLET
                       (Atomic Payment Signed)
                                   │
                                   ▼
                        GoPlausible Facilitator
                                   │
                                   ▼
                     ON-CHAIN TESTNET VERIFICATION
                   (Dual Algod + Indexer Validation)
                                   │
                                   ▼
                     HYBRID ML + QML DISEASE ENGINE
               ┌───────────────────┴───────────────────┐
               ▼                                       ▼
       Classical ML Baseline                   Quantum ML (QML)
    (Logistic Regression: 84.5% Acc)        (4-Qubit VQC: 81.2% Acc)
               │                                       │
               └───────────────────┬───────────────────┘
                                   │
                                   ▼
                      HEALTH RISK ANALYSIS REPORT
                     • Combined Risk Probability
                     • Side-by-Side Model Comparison
                     • AI Contextual Explanation
                     • Verified Algorand TxID (Lora Explorer)`}
          </pre>
        </div>
      </section>
    </div>
  );
}
