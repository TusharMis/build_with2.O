import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  Sparkles, 
  Key, 
  AlertCircle, 
  Check, 
  Copy, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  RotateCw,
  Trash2
} from 'lucide-react';
import { useAlgorandWallet } from '../context/WalletContext';

export function WalletConnectModal({ isOpen, onClose }) {
  const { 
    connectBrowserWallet, 
    connectWithDemoAccount, 
    generateFreshDemoAccount,
    connectWithMnemonic,
    persistedAccount,
    persistedAddress,
    purgeWallet
  } = useAlgorandWallet();

  const [activeTab, setActiveTab] = useState('options'); // 'options' | 'mnemonic' | 'generated'
  const [mnemonicInput, setMnemonicInput] = useState('');
  const [generatedPassphrase, setGeneratedPassphrase] = useState('');
  const [generatedAddress, setGeneratedAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleBrowserConnect = async () => {
    setError('');
    try {
      await connectBrowserWallet();
      onClose();
    } catch (err) {
      setError(err.message || 'Could not connect browser wallet.');
    }
  };

  // Reconnect to existing persisted account
  const handleConnectExisting = () => {
    setError('');
    try {
      connectWithDemoAccount();
      onClose();
    } catch (err) {
      setError(err.message || 'Could not connect saved demo account.');
    }
  };

  // Generate fresh account
  const handleGenerateFresh = () => {
    setError('');
    try {
      const acc = generateFreshDemoAccount();
      setGeneratedAddress(acc.address);
      setGeneratedPassphrase(acc.mnemonic);
      setActiveTab('generated');
    } catch (err) {
      setError(err.message || 'Could not generate demo account.');
    }
  };

  const handleMnemonicSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      connectWithMnemonic(mnemonicInput);
      onClose();
    } catch (err) {
      setError('Invalid 25-word mnemonic passphrase: ' + err.message);
    }
  };

  const copyGenerated = () => {
    if (generatedAddress) {
      navigator.clipboard.writeText(generatedAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#1C2541] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Connect Algorand Wallet</h3>
              <p className="text-[11px] text-teal-300 font-mono">Algorand Testnet (Persistent)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Options View */}
        {activeTab === 'options' && (
          <div className="space-y-3">
            {/* If a persisted account exists in localStorage, show it as the primary option */}
            {persistedAddress ? (
              <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <span>Saved Demo Account Found</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Stored in Browser
                  </span>
                </div>
                <p className="font-mono text-[11px] text-teal-300 truncate">
                  {persistedAddress}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={handleConnectExisting}
                    className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-black bg-gradient-to-r from-teal-400 to-emerald-400 hover:opacity-95 transition-opacity flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Connect Stored Account</span>
                  </button>
                </div>
              </div>
            ) : (
              /* If no account exists yet, show Create button */
              <button
                onClick={handleGenerateFresh}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 transition-all text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      Create Testnet Demo Account (Persistent)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Generates an account stored in your browser across reloads
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>
            )}

            {/* Option: Browser Extension / ARC-0027 */}
            <button
              onClick={handleBrowserConnect}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/60 transition-all text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-teal-300 transition-colors">
                    Browser Extension (Kibisis / Pera Web / ARC-0027)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Connect an installed Algorand wallet extension
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
            </button>

            {/* Option: Import 25-word Passphrase */}
            <button
              onClick={() => setActiveTab('mnemonic')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/60 transition-all text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                    Import 25-Word Passphrase
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Restore any Algorand Testnet account via mnemonic
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </button>

            {/* If an account is already stored, show a subtle option to replace with a brand new one */}
            {persistedAddress && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <button
                  onClick={handleGenerateFresh}
                  className="text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Generate Brand New Account</span>
                </button>
                <button
                  onClick={purgeWallet}
                  className="text-red-400/80 hover:text-red-400 flex items-center space-x-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete Saved Account</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Generated Account View */}
        {activeTab === 'generated' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-3 bg-black/50 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Generated Demo Address:</span>
                <button
                  onClick={copyGenerated}
                  className="text-xs text-teal-400 hover:text-teal-300 flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Address'}</span>
                </button>
              </div>
              <p className="font-mono text-xs text-teal-300 break-all select-all">
                {generatedAddress}
              </p>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="font-semibold text-white flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Persisted in Browser</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                This account is saved locally and will remain available across disconnects and page reloads.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-black bg-gradient-to-r from-teal-400 to-emerald-400 hover:opacity-95 transition-opacity"
            >
              Continue to Dashboard
            </button>
          </div>
        )}

        {/* Mnemonic Import View */}
        {activeTab === 'mnemonic' && (
          <form onSubmit={handleMnemonicSubmit} className="space-y-4 animate-in fade-in">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                25-Word Mnemonic Passphrase
              </label>
              <textarea
                value={mnemonicInput}
                onChange={(e) => setMnemonicInput(e.target.value)}
                placeholder="Paste your 25-word Algorand Testnet mnemonic passphrase..."
                rows={3}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('options')}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Back to Options
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-black bg-teal-400 hover:bg-teal-300 transition-colors"
              >
                Restore & Connect Wallet
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
