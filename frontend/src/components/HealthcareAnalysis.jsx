import React, { useState } from 'react';
import { 
  HeartPulse, 
  Activity, 
  AlertCircle, 
  Cpu, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  BarChart3,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { useAlgorandWallet } from '../context/WalletContext';
import { PaymentModal } from './PaymentModal';

const SAMPLE_PATIENTS = {
  highRisk: {
    label: 'Patient 1: High Cardiovascular Risk',
    data: {
      age: 65,
      gender: 1,
      blood_pressure: 160,
      cholesterol: 265,
      glucose: 160,
      bmi: 34.2,
      heart_rate: 92,
      smoking: 1,
      diabetes: 1,
      physical_activity: 0
    }
  },
  lowRisk: {
    label: 'Patient 2: Low Baseline Risk',
    data: {
      age: 38,
      gender: 0,
      blood_pressure: 112,
      cholesterol: 180,
      glucose: 82,
      bmi: 21.5,
      heart_rate: 64,
      smoking: 0,
      diabetes: 0,
      physical_activity: 1
    }
  },
  moderateRisk: {
    label: 'Patient 3: Moderate Risk Profile',
    data: {
      age: 50,
      gender: 1,
      blood_pressure: 135,
      cholesterol: 220,
      glucose: 105,
      bmi: 27.8,
      heart_rate: 74,
      smoking: 0,
      diabetes: 0,
      physical_activity: 1
    }
  }
};

export function HealthcareAnalysis() {
  const { activeAddress, balance } = useAlgorandWallet();
  const [patient, setPatient] = useState(SAMPLE_PATIENTS.highRisk.data);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [comparisonPreview, setComparisonPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentChallenge, setPaymentChallenge] = useState(null);

  const handleInputChange = (field, val) => {
    setPatient(prev => ({
      ...prev,
      [field]: Number(val)
    }));
  };

  const loadSample = (type) => {
    if (SAMPLE_PATIENTS[type]) {
      setPatient(SAMPLE_PATIENTS[type].data);
    }
  };

  // Free Classical vs QML benchmark preview
  const handlePreviewComparison = async () => {
    setIsLoading(true);
    try {
      const res = await api.compareMLvsQML(patient);
      setComparisonPreview(res);
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initiate x402-protected full analysis
  const handleRunFullAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await api.analyzeHealthcare({ patient });

      // If server returns HTTP 402 Payment Required
      if (response.isPaymentRequired) {
        setPaymentChallenge(response.data);
        setShowPaymentModal(true);
      } else if (response.isSuccess) {
        setAnalysisResult(response.data);
      }
    } catch (err) {
      console.error('Healthcare analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Callback when on-chain x402 payment settles
  const handlePaymentSuccess = async (txId, senderAddress) => {
    setShowPaymentModal(false);
    setIsLoading(true);

    try {
      // Retry request with confirmed transaction proof
      const verifiedRes = await api.analyzeHealthcare({
        patient,
        txId,
        sender: senderAddress || activeAddress
      });

      if (verifiedRes.isSuccess) {
        setAnalysisResult(verifiedRes.data);
      } else {
        alert('Payment verification failed on server: ' + (verifiedRes.data?.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error settling verified service:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
          <span>Real-World Healthcare Application</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Quantum AI Disease-Risk Intelligence
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          Hybrid Classical Machine Learning & 4-Qubit Variational Quantum Classifier (VQC) gated by the <span className="text-teal-300 font-medium">x402 Protocol on Algorand Testnet</span>.
        </p>
      </div>

      {/* Prominent Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex items-start space-x-3 shadow-lg">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 uppercase tracking-wider block">
            Educational & Research Prototype — Not a Medical Diagnosis
          </span>
          <p className="text-slate-300 leading-relaxed">
            This platform is an experimental demonstration of hybrid Quantum Machine Learning and x402 Web3 micropayments. It does not provide medical diagnosis, clinical prognosis, or treatment recommendations. Always consult a qualified physician for clinical health assessments.
          </p>
        </div>
      </div>

      {/* Main Grid: Input Form & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Clinical Vitals Input */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Patient Biomarker Parameters</h3>
              <p className="text-xs text-slate-400 mt-0.5">Input 10 vital cardiovascular & metabolic clinical indicators</p>
            </div>

            {/* Quick Sample Presets */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400 font-medium">Load:</span>
              <button
                onClick={() => loadSample('highRisk')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition-colors"
              >
                High Risk
              </button>
              <button
                onClick={() => loadSample('moderateRisk')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
              >
                Moderate
              </button>
              <button
                onClick={() => loadSample('lowRisk')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
              >
                Low Risk
              </button>
            </div>
          </div>

          {/* Form Input Fields */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Age (years)</label>
              <input
                type="number"
                value={patient.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Gender</label>
              <select
                value={patient.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
              >
                <option value={1}>Male</option>
                <option value={0}>Female</option>
              </select>
            </div>

            {/* Blood Pressure */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Systolic BP (mmHg)</label>
              <input
                type="number"
                value={patient.blood_pressure}
                onChange={(e) => handleInputChange('blood_pressure', e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Cholesterol */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Cholesterol (mg/dL)</label>
              <input
                type="number"
                value={patient.cholesterol}
                onChange={(e) => handleInputChange('cholesterol', e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Glucose */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Fasting Glucose (mg/dL)</label>
              <input
                type="number"
                value={patient.glucose}
                onChange={(e) => handleInputChange('glucose', e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* BMI */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">BMI (kg/m²)</label>
              <input
                type="number"
                step="0.1"
                value={patient.bmi}
                onChange={(e) => handleInputChange('bmi', e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Heart Rate */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Resting Heart Rate (bpm)</label>
              <input
                type="number"
                value={patient.heart_rate}
                onChange={(e) => handleInputChange('heart_rate', e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Smoking */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Smoking Status</label>
              <select
                value={patient.smoking}
                onChange={(e) => handleInputChange('smoking', e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
              >
                <option value={1}>Active Smoker</option>
                <option value={0}>Non-Smoker</option>
              </select>
            </div>

            {/* Diabetes */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Diabetes History</label>
              <select
                value={patient.diabetes}
                onChange={(e) => handleInputChange('diabetes', e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
              >
                <option value={1}>Diabetic</option>
                <option value={0}>Non-Diabetic</option>
              </select>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
            <button
              onClick={handleRunFullAnalysis}
              disabled={isLoading}
              className="w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Lock className="w-4 h-4 text-black" />
              <span>Run Quantum AI Analysis (0.1 ALGO via x402)</span>
            </button>

            <button
              onClick={handlePreviewComparison}
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 transition-all flex items-center justify-center space-x-1.5"
            >
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span>Preview ML vs QML (Free)</span>
            </button>
          </div>
        </div>

        {/* Right Col: Architecture & Payment Details */}
        <div className="space-y-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>x402 Micropayment Protocol</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full Quantum ML inference is cryptographically gated. When invoked, the server returns <span className="text-amber-400 font-mono">HTTP 402</span>, which your connected Algorand wallet signs on Testnet.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Service Price:</span>
                <span className="text-amber-400 font-bold">0.1 ALGO (100k μA)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Network:</span>
                <span className="text-teal-400">Algorand Testnet</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Facilitator:</span>
                <span className="text-slate-300">GoPlausible</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Free Comparison Preview Box (If triggered) */}
      {comparisonPreview && !analysisResult && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span>Model Comparison Preview (Free Benchmark)</span>
            </h3>
            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
              Free Tier
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2 text-xs">
              <span className="font-semibold text-slate-200 block">Classical Machine Learning (Logistic Regression)</span>
              <div className="flex justify-between text-slate-300">
                <span>Risk Probability:</span>
                <span className="font-bold text-white">{comparisonPreview.classicalML.riskProbability}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Validation Accuracy:</span>
                <span>{comparisonPreview.comparison.classicalAccuracy}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2 text-xs">
              <span className="font-semibold text-teal-300 block">Quantum Machine Learning (4-Qubit VQC)</span>
              <div className="flex justify-between text-slate-300">
                <span>Risk Probability:</span>
                <span className="font-bold text-teal-400">{comparisonPreview.quantumML.riskProbability}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Validation Accuracy:</span>
                <span>{comparisonPreview.comparison.quantumAccuracy}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            {comparisonPreview.comparison.scientificObservation}
          </p>
        </div>
      )}

      {/* Verified Full Analysis Result Card (After x402 Payment) */}
      {analysisResult && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Top Payment Proof Banner */}
          {analysisResult.payment?.verified && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2.5 text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block">Payment Status: VERIFIED on Algorand Testnet</span>
                  <span className="text-[11px] text-emerald-400/80 font-mono">
                    Confirmed in Block #{analysisResult.payment.confirmedRound} • Fee: 0.1 ALGO
                  </span>
                </div>
              </div>
              <a
                href={analysisResult.payment.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-teal-400 hover:text-teal-300 font-mono font-medium underline underline-offset-2 shrink-0"
              >
                <span>TxID: {analysisResult.payment.transactionId.substring(0, 10)}...</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Primary Assessment Headline */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Integrated Consensus Risk Assessment</span>
              <div className="flex items-center space-x-3 mt-1">
                <h2 className="text-2xl font-black text-white">
                  Risk Level: {analysisResult.prediction}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  analysisResult.prediction === 'High' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : analysisResult.prediction === 'Moderate'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {analysisResult.prediction} Risk
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Combined Risk Probability</span>
              <span className="text-3xl font-extrabold text-teal-400 mt-0.5 block font-mono">
                {analysisResult.risk_probability}%
              </span>
            </div>
          </div>

          {/* Side-by-Side Model Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Classical ML Card */}
            <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Classical Machine Learning</span>
                <span className="text-slate-400 font-mono">Accuracy: 84.5%</span>
              </div>
              <p className="text-slate-300">Model: {analysisResult.classical_ml.modelName}</p>
              <div className="space-y-1 pt-1">
                <span className="text-slate-400 font-semibold">Identified Biomarker Factors:</span>
                <ul className="space-y-1">
                  {analysisResult.classical_ml.topRiskFactors?.map((f, i) => (
                    <li key={i} className="flex items-center space-x-1.5 text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quantum ML Card */}
            <div className="p-5 rounded-xl bg-slate-800/50 border border-teal-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-300 text-sm">Quantum Machine Learning (QML)</span>
                <span className="text-teal-400 font-mono">Accuracy: 81.2%</span>
              </div>
              <p className="text-slate-300">Ansatz: {analysisResult.quantum_ml.modelName}</p>
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 bg-black/40 rounded-lg">
                  <span className="text-slate-400 block">Qubits Used:</span>
                  <span className="text-white font-bold">{analysisResult.quantum_ml.qubits} Qubits</span>
                </div>
                <div className="p-2 bg-black/40 rounded-lg">
                  <span className="text-slate-400 block">Circuit Depth:</span>
                  <span className="text-teal-300 font-bold">{analysisResult.quantum_ml.circuitDepth}</span>
                </div>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {analysisResult.quantum_ml.qmlAdvantageAnalysis}
              </p>
            </div>
          </div>

          {/* AI Explanation Summary */}
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 space-y-1.5 text-xs text-slate-300 leading-relaxed">
            <span className="text-[11px] font-semibold text-teal-300 uppercase tracking-wider block">
              AI Health Intelligence Synthesis:
            </span>
            <p>{analysisResult.explanation}</p>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentChallenge && (
        <PaymentModal
          paymentChallenge={paymentChallenge}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}
