import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Loader2, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Coins,
  Clock,
  BarChart3
} from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import { ResultCard } from './ResultCard';
import { PaymentModal } from './PaymentModal';
import { WalletBar } from './WalletBar';

export function AgentDashboard() {
  const { 
    messages, 
    isLoading, 
    agentState, 
    handleSendPrompt, 
    handleReset, 
    samplePrompts,
    availableTools
  } = useAgent();

  const [inputPrompt, setInputPrompt] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, agentState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;
    handleSendPrompt(inputPrompt);
    setInputPrompt('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Real Algorand Testnet Wallet Bar */}
      <WalletBar />

      {/* Top Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>AI Agent Workspace</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                Algorand Testnet
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous reasoning & x402 micropayments on Algorand Testnet
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Main Conversation Canvas */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl min-h-[420px] max-h-[550px] flex flex-col overflow-hidden shadow-2xl">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-teal-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-sm font-semibold text-white">Ask the Autonomous AI Agent</h4>
                <p className="text-xs text-slate-400">
                  Select a template below or write your custom request to test autonomous tool selection and x402 payment flows.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-black font-medium'
                      : 'bg-slate-800/90 border border-slate-700/80 text-slate-200'
                  }`}
                >
                  {msg.sender === 'user' && msg.text}

                  {msg.sender === 'agent' && (
                    <div className="space-y-3">
                      {msg.status === 'payment_required' && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
                            <Lock className="w-4 h-4" />
                            <span>HTTP 402: Payment Required — 0.1 ALGO</span>
                          </div>
                          <p className="text-xs text-slate-300">
                            {msg.decision?.reasoning || 'This premium action requires an x402 payment on Algorand Testnet to proceed.'}
                          </p>
                          <div className="p-2.5 rounded-lg bg-black/40 border border-slate-700 text-xs font-mono text-amber-300">
                            Required: {msg.decision?.cost || '0.1 ALGO'} on Algorand Testnet
                          </div>
                        </div>
                      )}

                      {msg.status === 'completed' && msg.result && (
                        <ResultCard result={msg.result} />
                      )}

                      {msg.status === 'error' && (
                        <div className="text-red-400 text-xs">{msg.text}</div>
                      )}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 w-fit animate-pulse">
              <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
              <span className="text-xs text-slate-300 font-medium">
                Agent evaluating tool requirements & checking x402 specifications...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Prompt Chips */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap pl-1">
            Quick Prompts:
          </span>
          <button
            onClick={() => handleSendPrompt('Summarize the architecture of x402 micropayments on Algorand in 3 concise bullet points.')}
            disabled={isLoading}
            className="whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-medium border bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border-teal-500/30 transition-colors"
          >
            <span>⚡ Quick Summarizer (Free)</span>
          </button>
          <button
            onClick={() => handleSendPrompt('Perform a security and reentrancy audit on an Algorand PyTeal smart contract for escrow settlement.')}
            disabled={isLoading}
            className="whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-medium border bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30 transition-colors"
          >
            <span>🔒 Smart Contract Auditor (0.1 ALGO)</span>
          </button>
          <button
            onClick={() => handleSendPrompt('Perform a deep market analysis of Algorand ecosystem liquidity and live node health.')}
            disabled={isLoading}
            className="whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-medium border bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30 transition-colors"
          >
            <span>📊 Deep Market Intel (0.1 ALGO)</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Type your request (e.g. 'Audit smart contract' or 'Summarize architecture')..."
            disabled={isLoading}
            className="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/80 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-black bg-gradient-to-r from-teal-400 to-emerald-400 hover:opacity-95 disabled:opacity-50 transition-all flex items-center space-x-1.5 shadow-md shadow-teal-500/20 shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Available Services Registry Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Agent Capabilities Registry
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Free */}
          <div
            onClick={() => handleSendPrompt('Summarize the architecture of x402 micropayments on Algorand in 3 concise bullet points.')}
            className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-xs text-white group-hover:text-teal-300 transition-colors">
                Quick Summarizer
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                Free (0 ALGO)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
              Condenses research, documentation, and technical code into actionable key takeaways.
            </p>
          </div>

          {/* Card 2: Smart Contract Auditor (Paid) */}
          <div
            onClick={() => handleSendPrompt('Perform a security and reentrancy audit on an Algorand PyTeal smart contract for escrow settlement.')}
            className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/30 hover:border-amber-500/60 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-xs text-white group-hover:text-amber-300 transition-colors">
                Smart Contract Auditor
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                0.1 ALGO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
              Deep security audit for PyTeal & TEAL contracts checking opcode budgets and reentrancy.
            </p>
          </div>

          {/* Card 3: Deep Market Intel (Paid) */}
          <div
            onClick={() => handleSendPrompt('Perform a deep market analysis of Algorand ecosystem liquidity and live node health.')}
            className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/30 hover:border-amber-500/60 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-xs text-white group-hover:text-amber-300 transition-colors">
                Deep Market Intel
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                0.1 ALGO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
              Live Algorand Testnet node performance combined with ecosystem liquidity analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Active 402 Modal */}
      <PaymentModal />
    </div>
  );
}
