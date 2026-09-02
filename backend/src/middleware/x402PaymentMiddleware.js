import { x402Service } from '../payment/x402.service.js';
import { toolRegistry } from '../tools/tool.registry.js';

/**
 * Express Middleware for x402 Payment Gating
 * Enforces x402 payment requirements on protected API endpoints.
 */
export function requireX402Payment(toolId) {
  return async (req, res, next) => {
    const targetToolId = toolId || req.body.serviceId || req.params.serviceId;
    const tool = toolRegistry.getToolById(targetToolId);

    if (!tool) {
      return res.status(404).json({ error: `Requested service "${targetToolId}" not found.` });
    }

    // Free tools do not require payment
    if (tool.tier === 'free') {
      return next();
    }

    // Check for x402 payment token in headers or body
    const paymentHeader = req.headers['x-payment'] || req.headers['authorization'];
    const paymentToken = paymentHeader ? paymentHeader.replace(/^x402\s+/i, '') : req.body.paymentToken;

    if (!paymentToken) {
      const challenge = x402Service.generateChallenge(tool);
      res.setHeader('WWW-Authenticate', `x402 challenge="${Buffer.from(JSON.stringify(challenge)).toString('base64')}"`);
      return res.status(402).json({
        error: 'Payment Required',
        message: `Service "${tool.name}" requires an x402 payment of ${tool.costAlgo} ALGO on Algorand Testnet.`,
        x402: challenge
      });
    }

    // Verify payment token
    const verification = await x402Service.verifyPayment({
      paymentToken,
      serviceId: tool.id,
      expectedMicroAlgos: tool.costMicroAlgos
    });

    if (!verification.valid) {
      return res.status(402).json({
        error: 'Payment Verification Incomplete',
        details: verification,
        x402: x402Service.generateChallenge(tool)
      });
    }

    req.paymentVerification = verification;
    next();
  };
}
