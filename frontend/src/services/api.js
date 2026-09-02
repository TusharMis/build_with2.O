/**
 * API Service Client for Quantum AI HealthLab Backend & x402 Endpoints
 */

const getApiBase = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    // If running in browser on production (e.g. on render.com)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return `${window.location.origin}/api`;
    }
    // If running in local dev on port 3000, backend is on port 5000
    if (window.location.port === '3000') {
      return 'http://localhost:5000/api';
    }
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:5000/api';
};

export const API_BASE = getApiBase();

export const api = {
  /**
   * Health & network status check
   */
  async getStatus() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch network status');
    return res.json();
  },

  /**
   * Fetch sample starter prompts & available tools
   */
  async getPrompts() {
    const res = await fetch(`${API_BASE}/agent/prompts`);
    if (!res.ok) throw new Error('Failed to load agent prompts');
    return res.json();
  },

  /**
   * Fetch list of registered services
   */
  async getServices() {
    const res = await fetch(`${API_BASE}/services`);
    if (!res.ok) throw new Error('Failed to load services');
    return res.json();
  },

  /**
   * Quantum Learning Topics
   */
  async getQuantumTopics() {
    const res = await fetch(`${API_BASE}/quantum/topics`);
    if (!res.ok) throw new Error('Failed to fetch quantum topics');
    return res.json();
  },

  /**
   * Run Quantum Circuit Simulator
   */
  async simulateCircuit({ numQubits = 2, gates = [] }) {
    const res = await fetch(`${API_BASE}/quantum/circuit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numQubits, gates })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Circuit simulation failed' }));
      throw new Error(err.error || 'Circuit simulation failed');
    }
    return res.json();
  },

  /**
   * Classical ML Prediction
   */
  async predictClassicalML(patient) {
    const res = await fetch(`${API_BASE}/ml/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient })
    });
    return res.json();
  },

  /**
   * Quantum ML (QML) Prediction
   */
  async predictQML(patient) {
    const res = await fetch(`${API_BASE}/qml/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient })
    });
    return res.json();
  },

  /**
   * Compare Classical ML vs QML
   */
  async compareMLvsQML(patient) {
    const res = await fetch(`${API_BASE}/ml-vs-qml`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient })
    });
    return res.json();
  },

  /**
   * Protected Healthcare Analysis (Gated by x402 on Algorand Testnet)
   */
  async analyzeHealthcare({ patient, txId, sender }) {
    const res = await fetch(`${API_BASE}/health/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient, txId, sender })
    });

    const data = await res.json();

    return {
      status: res.status,
      data,
      isPaymentRequired: res.status === 402,
      isSuccess: res.status === 200,
    };
  },

  /**
   * Payment History Audit Log
   */
  async getPaymentHistory() {
    const res = await fetch(`${API_BASE}/payments`);
    if (!res.ok) throw new Error('Failed to fetch payment history');
    return res.json();
  },

  /**
   * Send chat request to the AI Agent
   */
  async sendAgentChat({ message, selectedToolId, txId, sender, paymentPayload, paymentRequirements }) {
    const res = await fetch(`${API_BASE}/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, selectedToolId, txId, sender, paymentPayload, paymentRequirements }),
    });

    const data = await res.json();

    return {
      status: res.status,
      data,
      isPaymentRequired: res.status === 402,
      isSuccess: res.status === 200,
    };
  },

  /**
   * Call real paid endpoint directly: POST /api/paid-service
   */
  async callPaidService({ serviceId, query, txId, sender, paymentPayload, paymentRequirements }) {
    const res = await fetch(`${API_BASE}/paid-service`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, query, txId, sender, paymentPayload, paymentRequirements }),
    });

    const data = await res.json();

    return {
      status: res.status,
      data,
      isPaymentRequired: res.status === 402,
      isSuccess: res.status === 200,
    };
  }
};
