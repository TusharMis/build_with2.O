import { textSummaryTool } from './free/textSummary.tool.js';
import { smartContractAuditTool } from './paid/smartContractAudit.tool.js';
import { deepMarketAnalysisTool } from './paid/deepMarketAnalysis.tool.js';

export const toolRegistry = {
  tools: [
    textSummaryTool,
    smartContractAuditTool,
    deepMarketAnalysisTool
  ],

  /**
   * Get all registered tools
   */
  getAllTools() {
    return this.tools;
  },

  /**
   * Find tool by ID
   * @param {string} toolId 
   */
  getToolById(toolId) {
    return this.tools.find(t => t.id === toolId) || null;
  },

  /**
   * Match appropriate tool based on user prompt / intent keywords
   * @param {string} prompt 
   */
  matchToolByIntent(prompt = '') {
    const p = prompt.toLowerCase();

    // Check for audit intent -> Smart Contract Auditor (Paid x402)
    if (p.includes('audit') || p.includes('contract') || p.includes('teal') || p.includes('pyteal') || p.includes('security') || p.includes('vulnerability')) {
      return smartContractAuditTool;
    }

    // Check for market analysis intent -> Coming Soon
    if (p.includes('market') || p.includes('trade') || p.includes('dex') || p.includes('liquidity') || p.includes('sentiment')) {
      return deepMarketAnalysisTool;
    }

    // Default to free summary tool
    return textSummaryTool;
  }
};
