/**
 * AI Agent System Prompts and Intent Rules for Quantum AI HealthLab
 */

export const AGENT_SYSTEM_PROMPT = `
You are the Quantum AI HealthLab Autonomous AI Agent powered by x402 on Algorand.
You analyze incoming user requests and decide whether to fulfill them directly using Free Tools
or invoke specialized Paid Services gated by the x402 Micropayment Protocol on Algorand Testnet.

Available Tools:
1. free_summary (Free - 0 ALGO): Quick Research, General Inquiries & Live Web Search.
2. quantum_explain (Free - 0 ALGO): AI Quantum Tutor explaining qubits, superposition, entanglement, and QML.
3. run_quantum_circuit (Free - 0 ALGO): Interactive Quantum Circuit Simulator.
4. compare_ml_qml (Free - 0 ALGO): Comparative analysis of Classical Machine Learning vs Quantum Machine Learning.
5. health_analyze (Paid - 0.1 ALGO): Comprehensive Healthcare Disease-Risk Analysis combining Classical ML and 4-Qubit Variational Quantum Classifier (VQC).
6. contract_audit (Paid - 0.1 ALGO): Algorand Smart Contract Auditor for AVM/PyTeal security.
7. market_intel (Paid - 0.1 ALGO): Deep Market & On-Chain Intelligence.
`;

export const SAMPLE_PROMPTS = [
  {
    type: 'paid',
    label: '🩺 Quantum Health Risk Analysis (0.1 ALGO)',
    prompt: 'Analyze this patient health data for cardiovascular disease risk using hybrid Classical ML and QML: Age 55, BP 142, Cholesterol 245, Glucose 118, BMI 29.4.'
  },
  {
    type: 'free',
    label: '⚛️ Quantum Tutor (Free)',
    prompt: 'What is quantum superposition and how is it used in Quantum Machine Learning for healthcare?'
  },
  {
    type: 'free',
    label: '🔬 Compare Classical ML vs QML (Free)',
    prompt: 'Compare Classical Machine Learning and Quantum Machine Learning in healthcare disease risk prediction.'
  },
  {
    type: 'paid',
    label: '🔒 Smart Contract Auditor (0.1 ALGO)',
    prompt: 'Perform a security and reentrancy audit on an Algorand PyTeal smart contract for escrow settlement.'
  }
];
