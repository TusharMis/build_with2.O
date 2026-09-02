import { aiService } from '../../agent/ai.service.js';

/**
 * Free Tool: Quick Research & Text Summarizer / General AI & Web Search Agent
 * Tier: Free (0 ALGO)
 * Access: Unrestricted
 */
export const textSummaryTool = {
  id: 'free_summary',
  name: 'AI Agent (Free Tier)',
  description: 'Answers questions, summarizes documents, and performs live web searches without requiring payment.',
  tier: 'free',
  costAlgo: 0,
  costMicroAlgos: 0,
  
  /**
   * Executes the free AI query/search/summary service
   * @param {Object} params - Tool parameters (query / text)
   * @returns {Promise<Object>} Execution result
   */
  async execute(params = {}) {
    const text = params.text || params.query || 'What is Algorand?';
    
    console.log(`[Free AI Agent] Answering query: "${text.substring(0, 60)}..."`);
    const aiResult = await aiService.answerQuestion(text);

    return {
      success: true,
      serviceId: 'free_summary',
      serviceName: 'AI Agent (Free Tier)',
      tier: 'free',
      timestamp: new Date().toISOString(),
      data: {
        answer: aiResult.answer,
        summary: aiResult.answer || aiResult.summary,
        keyTakeaways: aiResult.keyTakeaways || [],
        source: aiResult.source || '',
        isSearchGrounded: !!aiResult.isSearchGrounded,
        details: aiResult.details || '',
        modelUsed: aiResult.modelUsed || 'Built-in Knowledge Engine'
      }
    };
  }
};
