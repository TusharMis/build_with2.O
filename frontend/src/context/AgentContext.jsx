import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { walletService } from '../services/wallet';
import { algorandPaymentService } from '../services/algorandPayment';

const AgentContext = createContext();

export function AgentProvider({ children }) {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard'
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [agentState, setAgentState] = useState('idle'); // 'idle' | 'thinking' | 'payment_required' | 'paying' | 'completed' | 'error'
  
  // Active Payment Challenge modal state
  const [paymentChallenge, setPaymentChallenge] = useState(null);
  const [activePrompt, setActivePrompt] = useState('');
  const [executionResult, setExecutionResult] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [availableTools, setAvailableTools] = useState([]);
  const [samplePrompts, setSamplePrompts] = useState([]);
  const [walletAccount, setWalletAccount] = useState(walletService.activeAccount);

  // Fetch initial metadata on mount
  useEffect(() => {
    async function initData() {
      try {
        const [promptsRes, statusRes] = await Promise.allSettled([
          api.getPrompts(),
          api.getStatus(),
        ]);

        if (promptsRes.status === 'fulfilled') {
          setSamplePrompts(promptsRes.value.prompts || []);
          setAvailableTools(promptsRes.value.tools || []);
        }

        if (statusRes.status === 'fulfilled') {
          setNetworkInfo(statusRes.value);
        }
      } catch (err) {
        console.warn('Initial data fetch warning:', err);
      }
    }

    initData();
  }, []);

  /**
   * Submit prompt to AI Agent
   */
  const handleSendPrompt = async (promptText) => {
    if (!promptText || promptText.trim() === '') return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setActivePrompt(promptText);
    setIsLoading(true);
    setAgentState('thinking');
    setPaymentChallenge(null);
    setExecutionResult(null);

    try {
      const response = await api.sendAgentChat({ message: promptText });

      if (response.isPaymentRequired) {
        // AI determined tool requires 0.1 ALGO payment on Algorand Testnet
        setAgentState('payment_required');
        setPaymentChallenge(response.data);
        
        const agentDecisionMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          status: 'payment_required',
          decision: response.data.agentDecision,
          x402: response.data,
          service: response.data.service,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, agentDecisionMsg]);
      } else if (response.isSuccess) {
        // Free tool executed immediately
        setAgentState('completed');
        setExecutionResult(response.data.result);

        const agentSuccessMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          status: 'completed',
          decision: response.data.agentDecision,
          result: response.data.result,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, agentSuccessMsg]);
      } else {
        setAgentState('error');
      }
    } catch (error) {
      console.error('Error in handleSendPrompt:', error);
      setAgentState('error');
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          status: 'error',
          text: 'Unable to reach the Agent backend service. Please check network connectivity and try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Execute real Algorand Testnet payment and unlock paid service
   */
  const handleExecutePayment = async (onStateChange) => {
    if (!paymentChallenge) {
      throw new Error('No active payment challenge to settle.');
    }

    setAgentState('paying');

    try {
      const outcome = await algorandPaymentService.executePayment({
        receiverAddress: paymentChallenge.receiver || paymentChallenge.accepts?.[0]?.payTo,
        serviceId: paymentChallenge.service?.id || 'contract_audit',
        query: activePrompt,
        onStateChange
      });

      setExecutionResult(outcome.result);
      setAgentState('completed');
      setPaymentChallenge(null);

      // Add confirmed result to chat workspace
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          sender: 'agent',
          status: 'completed',
          paymentVerified: true,
          settlement: outcome.settlement,
          result: outcome.result,
          timestamp: new Date().toISOString(),
        }
      ]);

      return outcome;
    } catch (err) {
      setAgentState('payment_required');
      throw err;
    }
  };

  /**
   * Dismiss the payment modal
   */
  const handleDismissPayment = () => {
    setPaymentChallenge(null);
    if (agentState === 'payment_required' || agentState === 'paying') {
      setAgentState('idle');
    }
  };

  /**
   * Reset session
   */
  const handleReset = () => {
    setMessages([]);
    setAgentState('idle');
    setPaymentChallenge(null);
    setExecutionResult(null);
    setActivePrompt('');
  };

  return (
    <AgentContext.Provider
      value={{
        currentView,
        setCurrentView,
        messages,
        isLoading,
        agentState,
        paymentChallenge,
        executionResult,
        networkInfo,
        availableTools,
        samplePrompts,
        activePrompt,
        walletAccount,
        setWalletAccount,
        handleSendPrompt,
        handleExecutePayment,
        handleDismissPayment,
        handleReset,
        setExecutionResult,
        setAgentState,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}
