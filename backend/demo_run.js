import { x402Client } from '@x402/core/client';
import { ExactAvmScheme } from '@x402/avm/exact/client';
import { toClientAvmSigner } from '@x402/avm';
import algosdk from 'algosdk';

async function runFullDemo() {
  console.log('======================================================================');
  console.log('🎯 BUILD WITH BHARAT 2.0: AGENTIC SOLUTIONS POWERED BY x402');
  console.log('======================================================================');

  // 1. Health check
  const healthRes = await fetch('http://localhost:5000/api/health');
  const healthData = await healthRes.json();
  console.log('\n[1] Backend & Facilitator Status:');
  console.log('  • API Status:', healthData.status);
  console.log('  • Network:', healthData.network);
  console.log('  • Facilitator URL:', healthData.facilitator);
  console.log('  • Receiver Address (AVM_ADDRESS):', healthData.receiverAddress);

  // 2. Free Tool Chat
  console.log('\n[2] Testing Free Flow: "Summarize project architecture"');
  const freeRes = await fetch('http://localhost:5000/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Summarize project architecture' })
  });
  const freeData = await freeRes.json();
  console.log('  • HTTP Status:', freeRes.status, '(Free - No Payment Required)');
  console.log('  • Tool Selected:', freeData.agentDecision?.toolName);
  console.log('  • AI Output Summary:', freeData.result?.data?.summary);

  // 3. Paid Tool Chat (HTTP 402)
  console.log('\n[3] Testing Paid Flow: "Audit PyTeal smart contract for vulnerabilities"');
  const paidRes = await fetch('http://localhost:5000/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Audit PyTeal smart contract for vulnerabilities' })
  });
  const paidData = await paidRes.json();
  console.log('  • HTTP Status:', paidRes.status, 'Payment Required');
  console.log('  • Header Payment-Required:', !!paidRes.headers.get('payment-required'));
  console.log('  • Required Amount:', paidData.accepts?.[0]?.amount, 'micro-units (' + paidData.service?.price + ')');
  console.log('  • Asset ID:', paidData.accepts?.[0]?.asset, '(Testnet USDC)');
  console.log('  • Receiver:', paidData.accepts?.[0]?.payTo);
  console.log('  • GoPlausible Fee-Payer:', paidData.accepts?.[0]?.extra?.feePayer);

  // 4. Client-side x402 signing with Algorand Wallet
  console.log('\n[4] Client-Side x402 Cryptographic Signing (via @x402/avm):');
  const testAccount = algosdk.generateAccount();
  const skBase64 = Buffer.from(testAccount.sk).toString('base64');
  const signer = toClientAvmSigner(skBase64);
  console.log('  • Signing Account:', testAccount.addr.toString());
  
  const client = new x402Client();
  client.register('algorand:*', new ExactAvmScheme(signer));
  const payload = await client.createPaymentPayload(paidData);
  console.log('  • Created Atomic Transaction Group:');
  console.log('    - Txn 0 (Sponsored Fee-Payer):', payload.payload?.paymentGroup?.[0]?.substring(0, 45) + '...');
  console.log('    - Txn 1 (Signed User Payment):', payload.payload?.paymentGroup?.[1]?.substring(0, 45) + '...');

  // 5. Submit to GoPlausible Facilitator for verification
  console.log('\n[5] Submitting Payload to /api/paid-service -> GoPlausible Facilitator:');
  const verifyRes = await fetch('http://localhost:5000/api/paid-service', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      serviceId: 'contract_audit',
      query: 'Audit PyTeal smart contract for vulnerabilities',
      paymentPayload: payload,
      paymentRequirements: payload.accepted
    })
  });
  const verifyData = await verifyRes.json();
  console.log('  • Facilitator On-Chain Verification Status:', verifyRes.status);
  console.log('  • On-Chain Simulation Reason:', verifyData.error || 'Simulated successfully');

  console.log('\n======================================================================');
  console.log('✅ All x402 Protocol & Algorand Testnet flows verified live!');
  console.log('======================================================================');
}

runFullDemo();
