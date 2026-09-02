import { Router } from 'express';
import { agentService } from '../agent/agent.service.js';
import { SAMPLE_PROMPTS } from '../agent/prompts.js';
import { toolRegistry } from '../tools/tool.registry.js';

const router = Router();

/**
 * GET /api/agent/prompts
 * Returns sample starter prompts for free and paid tools
 */
router.get('/prompts', (req, res) => {
  res.json({
    prompts: SAMPLE_PROMPTS,
    tools: toolRegistry.getAllTools()
  });
});

/**
 * POST /api/agent/chat
 * Primary agent conversation & intent routing endpoint
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, selectedToolId, paymentProof } = req.body;
    const result = await agentService.processRequest({ message, selectedToolId, paymentProof });

    return res.status(result.statusCode).json(result.response);
  } catch (error) {
    console.error('Agent chat error:', error);
    return res.status(500).json({ error: 'Internal server error processing agent request.' });
  }
});

export default router;
