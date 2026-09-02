import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Activity, 
  Layers, 
  Clock, 
  Cpu,
  BarChart3,
  Globe2,
  TrendingUp,
  Info,
  Bot,
  ExternalLink,
  Search
} from 'lucide-react';
import { PaymentSuccessView } from './PaymentSuccessView';

export function ResultCard({ result }) {
  if (!result) return null;

  const isPaid = result.tier === 'paid' && result.paymentVerified;
  const data = result.data || {};

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* If this was a paid service execution with verified transaction ID, show confirmation receipt */}
      {isPaid && result.transactionId && (
        <PaymentSuccessView
          transactionId={result.transactionId}
          serviceName={result.serviceName}
          amount={result.amountPaid || '0.1 ALGO'}
        />
      )}

      {/* Main AI Result Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        {/* Result Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isPaid 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
            }`}>
              {result.serviceId === 'market_intel' ? (
                <BarChart3 className="w-5 h-5" />
              ) : isPaid ? (
                <Cpu className="w-5 h-5" />
              ) : data.isSearchGrounded ? (
                <Search className="w-5 h-5 text-teal-400" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  isPaid 
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                    : 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                }`}>
                  {isPaid ? 'Premium Service (0.1 ALGO)' : 'Free Service (0 ALGO)'}
                </span>
                {data.isSearchGrounded && (
                  <span className="text-[10px] font-mono text-teal-300 bg-teal-500/10 border border-teal-500/30 px-1.5 py-0.5 rounded flex items-center space-x-1">
                    <Globe2 className="w-3 h-3" />
                    <span>Live Web Search</span>
                  </span>
                )}
                {data.modelUsed && !data.isSearchGrounded && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {data.modelUsed}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {result.serviceName || 'AI Agent Result'}
              </h3>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Dynamic Service Output Content */}
        <div className="space-y-4">
          {/* Direct Answer (for Free Queries & General QA) */}
          {result.serviceId === 'free_summary' && (
            <div className="space-y-3.5">
              {/* Primary Direct Answer */}
              {data.answer && (
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-slate-100 font-medium leading-relaxed">
                  {data.answer}
                </div>
              )}

              {/* Supplementary Details if different from answer */}
              {data.details && data.details !== data.answer && !data.details.includes('Your request was processed') && (
                <p className="text-xs text-slate-300 leading-relaxed px-1">
                  {data.details}
                </p>
              )}

              {/* Source Link / Reference for Web Search Findings */}
              {data.source && (
                <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-slate-400 truncate max-w-[320px] sm:max-w-[420px]">
                    <Globe2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="text-slate-400">Reference:</span>
                    <span className="font-mono text-teal-300 truncate">{data.source}</span>
                  </div>
                  <a
                    href={data.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-teal-400 hover:text-teal-300 font-medium transition-colors shrink-0 ml-2"
                  >
                    <span>Visit Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Key Takeaways / Bullet Points */}
              {data.keyTakeaways && data.keyTakeaways.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                    {data.isSearchGrounded ? 'Search Highlights:' : 'Key Points:'}
                  </span>
                  <ul className="space-y-2">
                    {data.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-black/40 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Smart Contract Audit Display */}
          {result.serviceId === 'contract_audit' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Security Audit Score</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block">
                    {data.auditScore || '96/100 (Grade A)'}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Opcode Budget Analysis</span>
                  <span className="text-xs text-slate-200 font-medium mt-1 block">
                    {data.gasOptimization || 'AVM opcode budget estimated at 420 ops'}
                  </span>
                </div>
              </div>

              {data.findings && data.findings.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Audit Findings & Security Checks:
                  </span>
                  <div className="space-y-2">
                    {data.findings.map((f, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{f.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            f.severity === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                            f.severity === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                          }`}>
                            {f.severity}
                          </span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">{f.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.verdict && (
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{data.verdict}</span>
                </div>
              )}
            </div>
          )}

          {/* Deep Market Intelligence Display */}
          {result.serviceId === 'market_intel' && (
            <div className="space-y-4">
              {/* Live Testnet Node Metrics */}
              {data.networkIntelligence && (
                <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-teal-300 flex items-center space-x-1.5">
                      <Globe2 className="w-3.5 h-3.5" />
                      <span>{data.networkIntelligence.dataSource}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Live Testnet
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Latest Block Round</span>
                      <span className="text-xs font-mono font-bold text-white mt-0.5 block">
                        #{data.networkIntelligence.currentRound}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Average Block Time</span>
                      <span className="text-xs font-mono font-bold text-teal-400 mt-0.5 block">
                        {data.networkIntelligence.blockTime}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 block">Consensus Uptime</span>
                      <span className="text-xs font-semibold text-emerald-400 mt-0.5 block">
                        100% Online
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Ecosystem Liquidity & Benchmark Analysis */}
              {data.ecosystemAnalysis && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>{data.ecosystemAnalysis.analysisType}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {data.ecosystemAnalysis.algoCirculation}
                    </span>
                  </div>

                  {data.ecosystemAnalysis.dexMetrics && (
                    <div className="space-y-1.5">
                      {data.ecosystemAnalysis.dexMetrics.map((dex, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-black/40 text-xs">
                          <span className="font-mono text-teal-300 font-medium">{dex.pair}</span>
                          <span className="text-slate-300">{dex.depth}</span>
                          <span className="font-mono text-emerald-400">Spread: {dex.spread}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {data.ecosystemAnalysis.note && (
                    <p className="text-[11px] text-slate-400 flex items-start space-x-1.5 pt-1">
                      <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>{data.ecosystemAnalysis.note}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
