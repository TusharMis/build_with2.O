import { spawn } from 'child_process';
import path from 'path';

/**
 * Master Test Suite Runner for Hackathon Evaluation
 * Executes all unit, integration, intent routing, web search, and on-chain verification tests.
 */
const testSuites = [
  { name: 'AI Agent Prompt Matrix & Web Search Grounding', script: 'test_six_prompts.js' },
  { name: 'End-to-End Paid Service (0.1 ALGO) & On-Chain Settlement', script: 'test_paid_flow.js' },
  { name: 'Payment Failure Scenarios & Security Safeguards', script: 'test_payment_failures.js' },
  { name: 'Persistent Wallet Lifecycle & Algorand Balance Checks', script: 'test_wallet_lifecycle.js' }
];

async function runTest(suite) {
  return new Promise((resolve) => {
    console.log(`\n▶ RUNNING: ${suite.name} (${suite.script})...`);
    const proc = spawn('node', [suite.script], { stdio: 'inherit', shell: true });
    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`✔ PASSED: ${suite.name}`);
        resolve(true);
      } else {
        console.error(`✖ FAILED: ${suite.name} (exit code ${code})`);
        resolve(false);
      }
    });
  });
}

async function main() {
  console.log('======================================================================');
  console.log('🧪 MASTER TEST SUITE — BUILD WITH BHARAT 2.0 (AGENTIC x402)');
  console.log('======================================================================');

  const results = [];
  for (const suite of testSuites) {
    const passed = await runTest(suite);
    results.push({ name: suite.name, passed });
  }

  console.log('\n======================================================================');
  console.log('📊 MASTER TEST RESULTS SUMMARY');
  console.log('======================================================================');

  let allPassed = true;
  results.forEach((r, i) => {
    const icon = r.passed ? '✅' : '❌';
    console.log(`${icon} [${i + 1}] ${r.name}: ${r.passed ? 'PASSED' : 'FAILED'}`);
    if (!r.passed) allPassed = false;
  });

  console.log('======================================================================');
  if (allPassed) {
    console.log('🎉 ALL TEST SUITES PASSED WITH 100% SUCCESS RATE!');
    process.exit(0);
  } else {
    console.error('❌ SOME TEST SUITES FAILED.');
    process.exit(1);
  }
}

main();
