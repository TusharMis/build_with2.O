import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import agentRoutes from './routes/agent.routes.js';
import serviceRoutes from './routes/service.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import paidServiceRoutes from './routes/paidService.routes.js';
import { x402PaymentService } from './payment/x402.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  exposedHeaders: ['Payment-Required', 'Payment-Signature', 'Payment-Response', 'WWW-Authenticate', 'X-Payment', 'X-Payment-Response']
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Build With Bharat 2.0 - Agentic x402 Backend',
    network: 'Algorand Testnet (CAIP-2)',
    facilitator: config.x402.facilitatorUrl,
    receiverAddress: config.algorand.receiverAddress,
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api', paidServiceRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/payment', paymentRoutes);

// If frontend/dist exists, serve React frontend SPA
if (fs.existsSync(frontendDistPath)) {
  console.log(`[Server] Serving static frontend from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// 404 Handler for unhandled API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API endpoint ${req.method} ${req.path} not found.` });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// Start Server & Initialize x402
const server = app.listen(config.port, async () => {
  console.log(`====================================================`);
  console.log(`🚀 Build With Bharat 2.0 x402 Backend Running`);
  console.log(`🌐 Port: ${config.port}`);
  console.log(`⛓️  Algorand Receiver (AVM_ADDRESS): ${config.algorand.receiverAddress}`);
  console.log(`💳 GoPlausible Facilitator: ${config.x402.facilitatorUrl}`);
  console.log(`====================================================`);

  // Pre-initialize facilitator connection
  await x402PaymentService.initialize();
});

export default app;
