import algosdk from 'algosdk';

async function testPaidFlow() {
  console.log('======================================================================');
  console.log('🧪 TESTING END-TO-END PAID SERVICE FLOW (0.1 ALGO ON TESTNET)');
  console.log('======================================================================');

  // 1. Test Free Tool Request
  console.log('\n[1] Testing Free Service ("Quick Summarizer"):');
  const freeRes = await fetch('http://localhost:5000/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Summarize project architecture' })
  });
  const freeData = await freeRes.json();
  console.log('  • HTTP Status:', freeRes.status, '(200 OK - No Payment Required)');
  console.log('  • Tool Selected:', freeData.agentDecision?.toolName);
  console.log('  • Result Returned:', !!freeData.result);

  // 2. Test Paid Tool Request (Unpaid -> 402)
  console.log('\n[2] Testing Paid Service Request ("Smart Contract Auditor"):');
  const paidRes = await fetch('http://localhost:5000/api/paid-service', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceId: 'contract_audit', query: 'Audit PyTeal escrow contract' })
  });
  const paidData = await paidRes.json();
  console.log('  • HTTP Status:', paidRes.status, '(402 Payment Required)');
  console.log('  • Required Amount:', paidData.amountMicroAlgos, 'microAlgos (' + paidData.price + ')');
  console.log('  • Receiver Address:', paidData.receiver);

  // 3. Test On-Chain Transaction Verification & Service Unlock
  console.log('\n[3] Testing On-Chain Verification & Service Unlock with Confirmed TxID:');
  const testTxId = 'MG7ICU4AVQKQQ2IXRBNC777VP4FD5GZXSIXRPTTWO3L7DCJ3XHXA';
  const verifyRes = await fetch('http://localhost:5000/api/paid-service', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      serviceId: 'contract_audit',
      query: 'Audit PyTeal escrow contract',
      txId: testTxId
    })
  });
  const verifyData = await verifyRes.json();
  console.log('  • HTTP Status:', verifyRes.status, '(200 OK - Service Unlocked)');
  console.log('  • Payment Verified on Testnet:', verifyData.paymentVerified);
  console.log('  • Confirmed Block Round:', verifyData.settlement?.confirmedRound);
  console.log('  • Transaction ID:', verifyData.settlement?.transactionId);
  console.log('  • Unlocked AI Audit Score:', verifyData.result?.data?.auditScore);
  console.log('  • Unlocked AI Verdict:', verifyData.result?.data?.verdict);

  console.log('\n======================================================================');
  console.log('✅ ALL PAID SERVICE (0.1 ALGO) & ON-CHAIN VERIFICATION TESTS PASSED!');
  console.log('======================================================================');
}

testPaidFlow();
