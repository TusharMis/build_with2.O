import { toolRegistry } from '../tools/tool.registry.js';
import { config } from '../config/index.js';

/**
 * AI Agent Service
 * Interprets user requests and orchestrates free execution vs real 0.1 ALGO payment requirements.
 */
export class AgentService {
  /**
   * Process a user request/chat message
   * @param {Object} payload
   * @param {string} payload.message - User query
   * @param {string} [payload.selectedToolId] - Explicit tool override if provided
   */
  async processRequest({ message, selectedToolId }) {
    if (!message || message.trim() === '') {
      return {
        type: 'error',
        statusCode: 400,
        response: { error: 'Please provide a valid prompt or message.' }
      };
    }

    // Step 1: Agent decides tool selection based on intent
    const tool = selectedToolId 
      ? toolRegistry.getToolById(selectedToolId) 
      : toolRegistry.matchToolByIntent(message);

    if (!tool) {
      return {
        type: 'error',
        statusCode: 404,
        response: { error: 'No suitable tool could be identified for this request.' }
      };
    }

    // Step 2: If tool is FREE ("Quick Summarizer"), execute immediately
    if (tool.tier === 'free') {
      const executionResult = await tool.execute({ query: message });
      return {
        type: 'success',
        statusCode: 200,
        response: {
          status: 'COMPLETED',
          agentDecision: {
            selectedTool: tool.id,
            toolName: tool.name,
            tier: 'free',
            reasoning: `Matched free utility tool "${tool.name}". Executed immediately without requiring payment.`
          },
          result: executionResult
        }
      };
    }

    // Step 3: If tool is PAID ("Smart Contract Auditor" or "Deep Market Intel"), return HTTP 402 with Algorand Testnet requirements
    if (tool.tier === 'paid') {
      console.log(`[Agent Service] Generating 402 Payment Required for paid tool: "${tool.name}" (${tool.id})`);

      return {
        type: 'payment_required',
        statusCode: 402,
        response: {
          status: 'PAYMENT_REQUIRED',
          agentDecision: {
            selectedTool: tool.id,
            toolName: tool.name,
            tier: 'paid',
            cost: '0.1 ALGO',
            reasoning: `User requested "${tool.name}". This is a premium on-chain tool requiring a 0.1 ALGO micropayment on Algorand Testnet.`
          },
          x402Version: 2,
          network: 'algorand:testnet',
          price: '0.1 ALGO',
          amountMicroAlgos: config.x402.amountMicroAlgos,
          receiver: config.algorand.receiverAddress,
          service: {
            id: tool.id,
            name: tool.name,
            price: '0.1 ALGO',
            network: 'Algorand Testnet',
          },
          accepts: [
            {
              scheme: 'exact',
              network: 'algorand:testnet',
              amount: String(config.x402.amountMicroAlgos),
              payTo: config.algorand.receiverAddress,
              asset: '0', // Native ALGO
            }
          ]
        }
      };
    }
  }
}

export const agentService = new AgentService();
