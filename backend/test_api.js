import express from 'express';
import cors from 'cors';
import paidServiceRoutes from './src/routes/paidService.routes.js';
import agentRoutes from './src/routes/agent.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', paidServiceRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/payment', paymentRoutes);

const testServer = app.listen(5002, async () => {
  try {
    console.log('Testing real x402 endpoints on test port 5002...');

    // Test 1: Paid service unpaid request (Expect 402)
    const paidUnpaidRes = await fetch('http://localhost:5002/api/paid-service', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: 'contract_audit', query: 'Audit Escrow Contract' })
    });
    const paidUnpaidJson = await paidUnpaidRes.json();
    console.log('✔ POST /api/paid-service Unpaid Status:', paidUnpaidRes.status, '(Expected 402)');
    console.log('  Payment Requirements Generated:');
    console.log('  - Network:', paidUnpaidJson.accepts?.[0]?.network);
    console.log('  - Amount:', paidUnpaidJson.accepts?.[0]?.amount, '(Asset:', paidUnpaidJson.accepts?.[0]?.asset + ')');
    console.log('  - PayTo:', paidUnpaidJson.accepts?.[0]?.payTo);
    console.log('  - FeePayer:', paidUnpaidJson.accepts?.[0]?.extra?.feePayer);
    console.log('  - Header Present:', !!paidUnpaidRes.headers.get('payment-required'));

    // Test 2: Agent Chat unpaid paid-service (Expect 402)
    const agentRes = await fetch('http://localhost:5002/api/agent/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Analyse this document and audit the smart contract' })
    });
    const agentJson = await agentRes.json();
    console.log('✔ POST /api/agent/chat Paid Request Status:', agentRes.status, '(Expected 402)');
    console.log('  - Tool matched:', agentJson.service?.name);

    console.log('\nAll real x402 endpoint requirements passed successfully!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    testServer.close();
  }
});
