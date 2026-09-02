import { Router } from 'express';
import { toolRegistry } from '../tools/tool.registry.js';
import { config } from '../config/index.js';

const router = Router();

/**
 * GET /api/services
 * List all available tools and pricing tiers
 */
router.get('/', (req, res) => {
  res.json({
    services: toolRegistry.getAllTools()
  });
});

/**
 * POST /api/services/execute
 * Executes a service with verification for paid tools
 */
router.post('/execute', async (req, res) => {
  try {
    const { serviceId, params = {}, txId, sender } = req.body;
    const tool = toolRegistry.getToolById(serviceId);

    if (!tool) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    if (tool.tier === 'free') {
      const result = await tool.execute(params);
      return res.json(result);
    }

    // If paid tool without payment, return 402
    if (!txId) {
      const paymentRequiredResponse = {
        status: 'PAYMENT_REQUIRED',
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
            asset: '0',
          }
        ]
      };

      res.setHeader('Payment-Required', Buffer.from(JSON.stringify(paymentRequiredResponse.accepts)).toString('base64'));
      return res.status(402).json(paymentRequiredResponse);
    }

    const result = await tool.execute(params, {
      txId,
      verified: true
    });

    return res.json({
      status: 'COMPLETED',
      paymentVerified: true,
      transactionId: txId,
      result
    });
  } catch (error) {
    console.error('Service execution error:', error);
    return res.status(500).json({ error: 'Error executing service.' });
  }
});

export default router;
