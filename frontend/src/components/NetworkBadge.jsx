import React from 'react';
import { ShieldCheck, Cpu, Radio } from 'lucide-react';
import { useAgent } from '../context/AgentContext';

export function NetworkBadge() {
  const { networkInfo } = useAgent();

  return (
    <div className="flex items-center space-x-2 text-xs">
      {/* Algorand Testnet Badge */}
      <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
        <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
        <span className="font-medium text-slate-200">Algorand Testnet</span>
      </div>

      {/* x402 Protocol Badge */}
      <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-teal-950/50 border border-teal-500/40 text-teal-300">
        <Cpu className="w-3.5 h-3.5 text-teal-400" />
        <span className="font-mono font-semibold">x402 Protocol</span>
      </div>

      {/* GoPlausible Facilitator Badge */}
      <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-950/50 border border-indigo-500/40 text-indigo-300">
        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
        <span>GoPlausible Facilitator</span>
      </div>
    </div>
  );
}
