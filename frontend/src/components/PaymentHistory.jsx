import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  RefreshCw,
  Coins
} from 'lucide-react';
import { api } from '../services/api';

export function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await api.getPaymentHistory();
      if (res.success && Array.isArray(res.payments)) {
        setPayments(res.payments);
      }
    } catch (err) {
      console.error('Failed to load payment history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-medium">
            <Coins className="w-3.5 h-3.5 text-teal-400" />
            <span>On-Chain Settlement Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Payment History & Proof of Execution
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Immutable record of Algorand Testnet micropayments settled via the x402 Protocol and GoPlausible Facilitator.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          disabled={isLoading}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No On-Chain Payments Recorded Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Execute a protected service like Quantum AI Healthcare Analysis or Smart Contract Auditor to generate your first on-chain x402 payment proof.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Network</th>
                  <th className="py-3.5 px-4">Confirmed Round</th>
                  <th className="py-3.5 px-4">Transaction ID</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {payments.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors font-mono">
                    <td className="py-3.5 px-4 font-sans font-medium text-white">{p.service}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-400">{p.amount}</td>
                    <td className="py-3.5 px-4 text-slate-400">{p.network}</td>
                    <td className="py-3.5 px-4 text-teal-300">#{p.confirmedRound || 'Confirmed'}</td>
                    <td className="py-3.5 px-4">
                      <a
                        href={`https://lora.algokit.io/testnet/transaction/${p.transactionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-teal-400 hover:text-teal-300 underline underline-offset-2"
                      >
                        <span>{p.transactionId.substring(0, 12)}...</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{p.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-black/40 border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
        <span>All transactions are verified against Algorand Testnet consensus rounds and recorded without storing private keys or secret credentials.</span>
      </div>
    </div>
  );
}
