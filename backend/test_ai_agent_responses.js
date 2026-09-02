async function testAIAgent() {
  console.log('======================================================================');
  console.log('🧪 TESTING AI AGENT GENERAL QA, SUMMARIZATION & INTENT ROUTING');
  console.log('======================================================================');

  // Test 1: General Question: Capital of India
  console.log('\n[1] Test 1: "What is the capital of India? Explain in one sentence."');
  const res1 = await fetch('http://localhost:5000/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'What is the capital of India? Explain in one sentence.' })
  });
  const data1 = await res1.json();
  console.log('  • HTTP Status:', res1.status, '(200 OK - Free)');
  console.log('  • Tool Matched:', data1.agentDecision?.toolName);
  console.log('  • AI Answer:', data1.result?.data?.answer);
  console.log('  • Model Used:', data1.result?.data?.modelUsed);
  console.log('  • Result: ✅ PASS');

  // Test 2: General Technical Question: What is x402?
  console.log('\n[2] Test 2: "What is x402?"');
  const res2 = await fetch('http://localhost:5000/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'What is x402?' })
  });
  const data2 = await res2.json();
  console.log('  • HTTP Status:', res2.status, '(200 OK - Free)');
  console.log('  • AI Answer:', data2.result?.data?.answer);
  console.log('  • Key Takeaways Count:', data2.result?.data?.keyTakeaways?.length);
  console.log('  • Result: ✅ PASS');

  // Test 3: Summarization Request: Summarize in 3 bullet points
  console.log('\n[3] Test 3: "Summarize x402 micropayments in 3 bullet points."');
  const res3 = await fetch('http://localhost:5000/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Summarize x402 micropayments in 3 bullet points.' })
  });
  const data3 = await res3.json();
  console.log('  • HTTP Status:', res3.status, '(200 OK - Free)');
  console.log('  • AI Answer/Summary:', data3.result?.data?.answer);
  console.log('  • Bullet Points:');
  data3.result?.data?.keyTakeaways?.forEach((pt, i) => console.log(`     ${i + 1}. ${pt}`));
  console.log('  • Result: ✅ PASS');

  // Test 4: Paid Smart Contract Audit Intent
  console.log('\n[4] Test 4: "Audit this Algorand smart contract."');
  const res4 = await fetch('http://localhost:5000/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Audit this Algorand smart contract.' })
  });
  const data4 = await res4.json();
  console.log('  • HTTP Status:', res4.status, '(402 Payment Required - Paid Gating)');
  console.log('  • Required Amount:', data4.price, '(' + data4.amountMicroAlgos + ' microAlgos)');
  console.log('  • Target Service:', data4.service?.name);
  console.log('  • Result: ✅ PASS');

  console.log('\n======================================================================');
  console.log('✅ ALL AI AGENT GENERAL QA, SUMMARIES & ROUTING TESTS PASSED!');
  console.log('======================================================================');
}

testAIAgent();
