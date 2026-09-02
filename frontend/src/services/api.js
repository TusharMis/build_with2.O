/**
 * API Service Client for Backend & x402 Endpoints
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
    const res = await fetch(`${API_BASE}/payment/status`);
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
   * Send chat request to the AI Agent
   * Handles 200 OK (free or paid verified) and 402 Payment Required responses
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
