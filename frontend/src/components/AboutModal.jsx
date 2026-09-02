import React from 'react';
import { 
  X, 
  Atom, 
  HeartPulse, 
  ShieldCheck, 
  Cpu, 
  Coins, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">About Quantum AI HealthLab</h2>
              <span className="text-xs text-teal-300">Build With Bharat 2.0 Hackathon Project</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tagline & Problem Statement */}
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p className="text-sm font-semibold text-white">
            "Learn Quantum. Build Quantum AI. Apply It to Healthcare."
          </p>
          <p>
            <strong className="text-white">Core Problem:</strong> Quantum computing and AI remain abstract, inaccessible, and detached from real-world applications. High-value quantum machine learning services lack standardized, sub-second machine monetization frameworks.
          </p>
          <p>
            <strong className="text-white">Our Solution:</strong> An integrated platform that bridges interactive quantum algorithm education, multi-qubit circuit simulation, an intelligent AI tutor, classical machine learning baselines, and a 4-qubit Variational Quantum Classifier (VQC) for healthcare disease-risk evaluation — powered by the official <span className="text-teal-300 font-semibold">x402 Micropayment Protocol</span> on the <span className="text-teal-300 font-semibold">Algorand Testnet</span>.
          </p>
        </div>

        {/* Architecture Flow */}
        <div className="p-4 rounded-xl bg-black/60 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            System Architecture Flow:
          </span>
          <pre className="font-mono text-[11px] text-teal-300 leading-tight whitespace-pre overflow-x-auto">
{`User Request
   │
   ▼
AI Agent Orchestrator ──► Free Quantum Learning & Simulation
   │
   ▼
POST /api/health/analyze (Protected by x402)
   │
   ▼
HTTP 402 Payment Required (0.1 ALGO)
   │
   ▼
Algorand Testnet Wallet Signature
   │
   ▼
GoPlausible Facilitator & On-Chain Verification
   │
   ▼
Hybrid Classical ML + 4-Qubit VQC QML
   │
   ▼
Disease Risk Report + Verified Tx Proof (Lora Explorer)`}
          </pre>
        </div>

        {/* Research Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Medical Disclaimer:</strong> This tool is an educational and research prototype. It does not provide medical diagnosis, prognosis, or clinical treatment advice. Always seek professional healthcare guidance for medical decisions.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-500">
          <span>Powered by Algorand, x402 & GoPlausible</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
