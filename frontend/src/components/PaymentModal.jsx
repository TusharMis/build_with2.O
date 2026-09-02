import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  X, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  Code2, 
  ExternalLink, 
  Cpu, 
  CheckCircle2, 
  AlertCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  Wallet,
  Sparkles,
  RefreshCw,
  Clock,
  RotateCcw
} from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import { useAlgorandWallet } from '../context/WalletContext';

export function PaymentModal() {
  const { 
    paymentChallenge, 
    handleDismissPayment, 
    handleExecutePayment 
  } = useAgent();

  const {
    isConnected,
    activeAddress,
    algoBalance,
    refreshBalance,
    connectWithDemoAccount
  } = useAlgorandWallet();

  const [paymentState, setPaymentState] = useState('IDLE'); 
  // 'IDLE' | 'CHECKING_WALLET' | 'CHECKING_BALANCE' | 'PREPARING_TRANSACTION' | 'WAITING_FOR_APPROVAL' | 'TRANSACTION_SUBMITTED' | 'VERIFYING_PAYMENT' | 'UNLOCKING_SERVICE' | 'PAYMENT_CONFIRMED' | 'PAYMENT_FAILED'
  
  const [currentTxId, setCurrentTxId] = useState('');
  const [confirmedRound, setConfirmedRound] = useState(null);
  const [errorCode, setErrorCode] = useState(null); // 'INSUFFICIENT_BALANCE' | 'PAYMENT_CANCELLED' | 'SUBMISSION_FAILED' | 'VERIFICATION_FAILED' | 'SETTLEMENT_FAILED'
  const [errorMessage, setErrorMessage] = useState(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  useEffect(() => {
    if (paymentChallenge) {
      setPaymentState('IDLE');
      setErrorMessage(null);
      setErrorCode(null);
      setCurrentTxId('');
      setConfirmedRound(null);
      refreshBalance();
    }
  }, [paymentChallenge, refreshBalance]);

  if (!paymentChallenge) return null;

  const service = paymentChallenge.service || {};
  const decision = paymentChallenge.agentDecision || {};
  const receiver = paymentChallenge.receiver || paymentChallenge.accepts?.[0]?.payTo || 'ZMFK2OI7ZBD2U27ISERZC4S6LKM6WMFJPZQ4MYNJDZ2VNBNMBA67RA22AA';
  const priceDisplay = service.price || '0.1 ALGO';
  const hasSufficientBalance = algoBalance >= 0.101; // 0.1 ALGO + 0.001 fee

  const handlePayClick = async () => {
    setErrorMessage(null);
    setErrorCode(null);

    try {
      await handleExecutePayment((stateName, payload) => {
        setPaymentState(stateName);
        if (payload?.txId) setCurrentTxId(payload.txId);
        if (payload?.confirmedRound) setConfirmedRound(payload.confirmedRound);
        if (payload?.code) setErrorCode(payload.code);
      });
    } catch (err) {
      console.error('Payment execution error:', err);
      setPaymentState('PAYMENT_FAILED');
      setErrorCode(err.code || 'PAYMENT_FAILED');
      setErrorMessage(err.message || 'Payment execution could not be completed.');
    }
  };

  const handleRetry = () => {
    setPaymentState('IDLE');
    setErrorMessage(null);
    setErrorCode(null);
    refreshBalance();
  };

  const isProcessing = [
    'PREPARING_TRANSACTION', 
    'WAITING_FOR_APPROVAL', 
    'TRANSACTION_SUBMITTED', 
    'VERIFYING_PAYMENT', 
    'UNLOCKING_SERVICE'
  ].includes(paymentState);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1C2541] border border-amber-500/40 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden relative">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent p-4 sm:p-5 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  HTTP 402
                </span>
                <span className="text-sm font-bold text-white">Payment Required — 0.1 ALGO</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Paid AI service on Algorand Testnet
              </p>
            </div>
          </div>
          <button
            onClick={handleDismissPayment}
            disabled={isProcessing}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Agent Decision Explanation */}
          {decision.reasoning && (
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-teal-400">Agent Decision: </span>
              {decision.reasoning}
            </div>
          )}

          {/* Pricing Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Target Service</span>
              <span className="text-xs font-semibold text-white">{service.name || 'Smart Contract Auditor'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Settlement Network</span>
              <span className="text-xs font-mono text-teal-300 font-medium">
                Algorand Testnet (Algonode Node)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Recipient Address</span>
              <span className="text-[11px] font-mono text-slate-300 truncate max-w-[260px]">
                {receiver}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Required Payment</span>
              <div className="text-right">
                <span className="text-lg font-bold text-amber-400 font-mono">
                  {priceDisplay}
                </span>
                <span className="block text-[10px] font-mono text-slate-400">
                  (100,000 microAlgos + 0.001 ALGO network fee)
                </span>
              </div>
            </div>
          </div>

          {/* Connected Wallet State */}
          {!isConnected ? (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-xs text-amber-400 font-medium">
                <Wallet className="w-4 h-4" />
                <span>No Algorand Testnet wallet connected</span>
              </div>
              <button
                onClick={connectWithDemoAccount}
                className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg bg-teal-400 hover:bg-teal-300 text-black text-xs font-semibold transition-colors shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Connect / Generate Demo Wallet</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">Paying from:</span>
                  <span className="font-mono text-teal-300 font-medium truncate max-w-[180px] sm:max-w-[240px]">
                    {activeAddress}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">Current Balance:</span>
                  <span className={`font-mono font-bold ${hasSufficientBalance ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {algoBalance.toFixed(4)} ALGO
                  </span>
                  {!hasSufficientBalance && (
                    <span className="text-[10px] text-amber-400 font-sans">(Need min 0.101 ALGO)</span>
                  )}
                </div>
              </div>

              <button
                onClick={refreshBalance}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Refresh balance"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Insufficient Balance Notice (Pre-flight check) */}
          {isConnected && !hasSufficientBalance && paymentState !== 'PAYMENT_FAILED' && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300 space-y-2 animate-in fade-in">
              <div className="font-semibold flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Insufficient Testnet Balance (0.101 ALGO required)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Your account balance (<span className="font-mono text-amber-300">{algoBalance.toFixed(4)} ALGO</span>) is insufficient. Please fund your address <span className="font-mono text-teal-300">{activeAddress?.substring(0, 8)}...</span> using the Testnet dispenser:
              </p>
              <div className="pt-1">
                <a
                  href={`https://bank.testnet.algorand.network/?account=${activeAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold text-amber-300 transition-colors"
                >
                  <span>Open Algorand Testnet Dispenser</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Multi-Step Processing Feedback */}
          {isProcessing && (
            <div className="p-4 rounded-xl bg-slate-900 border border-teal-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 text-teal-400 animate-spin shrink-0" />
                <div className="text-xs text-white font-semibold">
                  {paymentState === 'PREPARING_TRANSACTION' && 'Preparing Algorand Testnet Transaction...'}
                  {paymentState === 'WAITING_FOR_APPROVAL' && 'Waiting for Wallet Approval & Cryptographic Signature...'}
                  {paymentState === 'TRANSACTION_SUBMITTED' && 'Transaction Submitted to Algorand Testnet Node...'}
                  {paymentState === 'VERIFYING_PAYMENT' && 'Verifying On-Chain Block Confirmation...'}
                  {paymentState === 'UNLOCKING_SERVICE' && 'Unlocking Smart Contract Auditor Service...'}
                </div>
              </div>

              {currentTxId && (
                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-[11px] font-mono space-y-1">
                  <div className="text-slate-400">Broadcasted TxID:</div>
                  <div className="text-teal-300 truncate">{currentTxId}</div>
                </div>
              )}
            </div>
          )}

          {/* Payment Confirmed State */}
          {paymentState === 'PAYMENT_CONFIRMED' && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 space-y-2 animate-in fade-in">
              <div className="flex items-center space-x-2 font-bold text-white text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Payment Confirmed on Algorand Testnet!</span>
              </div>
              <p className="text-slate-300">
                Transaction confirmed in block #{confirmedRound}. Smart Contract Auditor result unlocked!
              </p>
            </div>
          )}

          {/* Failure Case Banners (Categorized) */}
          {paymentState === 'PAYMENT_FAILED' && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 space-y-2.5 text-xs text-red-300 animate-in fade-in">
              {/* Failure Header */}
              <div className="flex items-center justify-between">
                <div className="font-semibold flex items-center space-x-1.5 text-sm text-red-200">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>
                    {errorCode === 'INSUFFICIENT_BALANCE' && 'Insufficient Testnet Balance'}
                    {errorCode === 'PAYMENT_CANCELLED' && 'Payment Cancelled'}
                    {errorCode === 'SUBMISSION_FAILED' && 'Transaction Submission Failed'}
                    {errorCode === 'VERIFICATION_FAILED' && 'Verification Failed'}
                    {errorCode === 'SETTLEMENT_FAILED' && 'Settlement Failed'}
                    {!['INSUFFICIENT_BALANCE', 'PAYMENT_CANCELLED', 'SUBMISSION_FAILED', 'VERIFICATION_FAILED', 'SETTLEMENT_FAILED'].includes(errorCode) && 'Payment Failed'}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 uppercase">
                  Service Locked
                </span>
              </div>

              {/* Specific failure message */}
              <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                {errorMessage || 'The payment could not be processed. The service remains locked.'}
              </p>

              {/* Insufficient balance dispenser helper link */}
              {errorCode === 'INSUFFICIENT_BALANCE' && activeAddress && (
                <div className="pt-1">
                  <a
                    href={`https://bank.testnet.algorand.network/?account=${activeAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-400 hover:underline"
                  >
                    <span>Fund with Algorand Testnet Dispenser</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Retry Button */}
              <div className="pt-2 border-t border-red-500/20 flex justify-end">
                <button
                  onClick={handleRetry}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={handlePayClick}
              disabled={isProcessing || !isConnected || !hasSufficientBalance}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing On-Chain Payment...</span>
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  <span>Sign & Pay 0.1 ALGO (Algorand Testnet)</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full flex items-center justify-center space-x-1.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showTechnicalDetails ? 'Hide' : 'Inspect'} 402 Challenge Payload</span>
            </button>
          </div>

          {/* Technical Inspector */}
          {showTechnicalDetails && (
            <div className="bg-black/80 rounded-xl p-3.5 border border-slate-800 text-[11px] font-mono text-emerald-400 max-h-40 overflow-y-auto">
              <pre>{JSON.stringify(paymentChallenge, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
