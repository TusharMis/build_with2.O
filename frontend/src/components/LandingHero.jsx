import React from 'react';
import { 
  Bot, 
  Coins, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Lock, 
  Terminal,
  Clock,
  BarChart3
} from 'lucide-react';
import { useAgent } from '../context/AgentContext';

export function LandingHero() {
  const { setCurrentView, handleSendPrompt } = useAgent();

  const handleQuickStart = (prompt) => {
    setCurrentView('dashboard');
    setTimeout(() => {
      handleSendPrompt(prompt);
    }, 150);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Header */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        {/* Glow background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center px-4 space-y-6 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-medium tracking-wide">
            <Zap className="w-3.5 h-3.5 text-teal-400" />
            <span>Build With Bharat 2.0 Hackathon • Agentic Solutions</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Autonomous AI Agents,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
              Powered by x402 on Algorand
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            A Web3 AI orchestrator that dynamically invokes free or paid services. Paid tools are cryptographically gated via the <span className="text-teal-300 font-medium">x402 Micropayment Protocol</span> on <span className="text-teal-300 font-medium">Algorand Testnet</span> and verified by the <span className="text-teal-300 font-medium">GoPlausible Facilitator</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Bot className="w-4 h-4" />
              <span>Launch AI Agent</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-medium text-sm text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 transition-all"
            >
              <span>Explore Architecture</span>
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Quick-Test Showcase */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-teal-400" />
                <span>Select a Service</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Free services execute immediately. Paid services trigger real x402 payment requirements on Algorand Testnet.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                Free: 0 ALGO
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                Paid: 0.1 ALGO
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {/* Card 1: Free */}
            <div 
              onClick={() => handleQuickStart('Summarize the architecture of x402 micropayments on Algorand in 3 concise bullet points.')}
              className="group bg-slate-800/50 hover:bg-slate-800 p-5 rounded-xl border border-slate-700/60 hover:border-teal-500/50 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Free Service
                </span>
                <span className="text-xs font-mono text-slate-400">0 ALGO</span>
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors">
                Quick Summarizer
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Condenses technical specifications, research, and documentation into actionable key takeaways.
              </p>
              <div className="mt-4 flex items-center text-xs font-medium text-teal-400">
                <span>Run Free Service</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Paid 0.1 ALGO (Smart Contract Auditor) */}
            <div 
              onClick={() => handleQuickStart('Perform a security and reentrancy audit on an Algorand PyTeal smart contract for escrow settlement.')}
              className="group bg-slate-800/50 hover:bg-slate-800 p-5 rounded-xl border border-slate-700/60 hover:border-amber-500/50 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Paid x402 Service
                </span>
                <span className="text-xs font-mono text-amber-400 font-semibold">0.1 ALGO</span>
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                Smart Contract Auditor
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Deep security audit for PyTeal & TEAL contracts checking opcode budgets and vulnerabilities.
              </p>
              <div className="mt-4 flex items-center text-xs font-medium text-amber-400">
                <span>Trigger x402 Payment</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Paid 0.1 ALGO (Deep Market Intel) */}
            <div 
              onClick={() => handleQuickStart('Perform a deep market analysis of Algorand ecosystem liquidity and live node health.')}
              className="group bg-slate-800/50 hover:bg-slate-800 p-5 rounded-xl border border-slate-700/60 hover:border-amber-500/50 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Paid x402 Service
                </span>
                <span className="text-xs font-mono text-amber-400 font-semibold">0.1 ALGO</span>
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                Deep Market Intel
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Live Algorand Testnet node performance combined with ecosystem liquidity analytics.
              </p>
              <div className="mt-4 flex items-center text-xs font-medium text-amber-400">
                <span>Trigger x402 Payment</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Protocol Features */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How the Integrated x402 Flow Works</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Genuinely verified machine payments powered by Algorand Testnet and GoPlausible Facilitator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-sm">
              1
            </div>
            <h4 className="font-semibold text-white text-sm">User Request</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              User submits a request to the AI Agent via dashboard chat or tool triggers.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-sm">
              2
            </div>
            <h4 className="font-semibold text-white text-sm">HTTP 402 Gating</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paid services return HTTP 402 with structured x402 payment requirements.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-sm">
              3
            </div>
            <h4 className="font-semibold text-white text-sm">Wallet Signature</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Client wallet signs atomic transaction group; GoPlausible Facilitator verifies on-chain.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-sm">
              4
            </div>
            <h4 className="font-semibold text-white text-sm">Execution & Tx Proof</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upon confirmed settlement, real Algorand Transaction ID is returned with AI results.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
