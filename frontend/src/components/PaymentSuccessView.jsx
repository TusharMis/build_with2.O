import React from 'react';
import { CheckCircle2, ExternalLink, ShieldCheck, Cpu } from 'lucide-react';

export function PaymentSuccessView({ transactionId, serviceName, amount }) {
  if (!transactionId) return null;

  const explorerUrl = `https://lora.algokit.io/testnet/transaction/${transactionId}`;

  return (
    <div className="bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 border border-emerald-500/50 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              x402 Settlement Confirmed
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Algorand Testnet Payment Verified
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-emerald-400 font-bold block">{amount || '0.1 ALGO'}</span>
          <span className="text-[10px] text-slate-400">Algorand Testnet</span>
        </div>
      </div>

      <div className="bg-black/60 rounded-xl p-3.5 border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span>Service Executed:</span>
          <span className="text-slate-200 font-medium">{serviceName || 'Smart Contract Auditor'}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Facilitator Settlement:</span>
          <span className="text-indigo-300 font-medium">GoPlausible Facilitator</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Transaction ID:</span>
          <span className="font-mono text-emerald-300 font-semibold truncate max-w-[200px] sm:max-w-[320px]">
            {transactionId}
          </span>
        </div>
      </div>

      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-xs font-medium text-teal-300 transition-colors"
      >
        <span>View On-Chain Transaction on Algorand Explorer (Lora)</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
