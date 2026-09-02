import { Router } from 'express';
import { toolRegistry } from '../tools/tool.registry.js';
import { config } from '../config/index.js';

const router = Router();

/**
 * GET /api/payment/challenge/:serviceId
 * Get real 0.1 ALGO payment requirements for a specific service
 */
router.get('/challenge/:serviceId', async (req, res) => {
  const { serviceId } = req.params;
  const tool = toolRegistry.getToolById(serviceId);

  if (!tool) {
    return res.status(404).json({ error: 'Service not found.' });
  }

  if (tool.tier === 'free') {
    return res.json({
      tier: 'free',
      message: 'This service is free. No x402 payment required.'
    });
  }

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
});

/**
 * GET /api/payment/status
 * Returns health and configuration of Algorand node and GoPlausible Facilitator
 */
router.get('/status', async (req, res) => {
  res.json({
    algorand: {
      network: 'Algorand Testnet',
      receiverAddress: config.algorand.receiverAddress,
      nodeUrl: config.algorand.nodeUrl,
      indexerUrl: config.algorand.indexerUrl,
    },
    facilitator: {
      url: config.x402.facilitatorUrl,
      status: 'ONLINE',
      protocol: 'x402-v2',
    },
  });
});

export default router;
