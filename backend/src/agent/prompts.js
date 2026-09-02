/**
 * AI Agent System Prompts and Intent Rules
 */

export const AGENT_SYSTEM_PROMPT = `
You are the Build With Bharat 2.0 Autonomous AI Agent powered by x402 on Algorand.
You analyze incoming user requests and decide whether to fulfill them directly using Free Tools
or invoke specialized Paid Services gated by the x402 Micropayment Protocol on Algorand Testnet.

Available Tools:
1. free_summary (Free - 0 ALGO): Quick Research & Text Summarizer. Use for general queries, text summarization, brainstorming.
2. contract_audit (Paid - 0.1 ALGO): Algorand Smart Contract Auditor. Use for TEAL/PyTeal security audits and contract analysis.
3. market_intel (Paid - 0.1 ALGO): Deep Market & On-Chain Intelligence. Use for live Algorand node metrics and DEX liquidity analysis.
`;

export const SAMPLE_PROMPTS = [
  {
    type: 'free',
    label: '⚡ Quick Summarizer (Free)',
    prompt: 'Summarize the architecture of x402 micropayments on Algorand in 3 concise bullet points.'
  },
  {
    type: 'paid',
    label: '🔒 Smart Contract Auditor (0.1 ALGO)',
    prompt: 'Perform a security and reentrancy audit on an Algorand PyTeal smart contract for escrow settlement.'
  },
  {
    type: 'paid',
    label: '📊 Deep Market Intel (0.1 ALGO)',
    prompt: 'Perform a deep market analysis of Algorand ecosystem liquidity and live node health.'
  }
];
