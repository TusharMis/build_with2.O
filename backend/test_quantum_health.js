/**
 * Automated Test Suite for Quantum AI HealthLab
 * Tests:
 * 1. Quantum Circuit Simulator (Superposition, Bell State, Pauli gates)
 * 2. Classical Machine Learning Service
 * 3. Quantum Machine Learning (QML) 4-Qubit VQC
 * 4. ML vs QML Side-by-Side Benchmark
 * 5. AI Quantum Tutor Q&A Engine
 * 6. x402 Protected Healthcare Analysis (/api/health/analyze):
 *    - 402 Payment Required when payment missing
 *    - 400 Bad Request when transaction unconfirmed
 *    - 200 OK when payment verified on Algorand Testnet
 * 7. Payment History Audit Ledger
 */

import { QuantumCircuitSimulator } from './src/quantum/quantum.simulator.js';
import { classicalMLService } from './src/ml/classical.ml.service.js';
import { qmlService } from './src/qml/qml.service.js';
import { aiService } from './src/agent/ai.service.js';
import app from './src/server.js';
import http from 'http';

async function runTests() {
  console.log(`\n================================================================`);
  console.log(`🧪 RUNNING QUANTUM AI HEALTHLAB MASTER VERIFICATION SUITE`);
  console.log(`================================================================\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name}`);
      failed++;
    }
  }

  // --- TEST 1: Quantum Circuit Simulator ---
  console.log(`[TEST 1] Quantum Circuit Simulator (Statevector & Measurements)`);
  try {
    const qc = new QuantumCircuitSimulator(2);
    qc.h(0);
    qc.cnot(0, 1);
    const probs = qc.getProbabilities();
    const p00 = probs.find(p => p.binary === '00')?.probability;
    const p11 = probs.find(p => p.binary === '11')?.probability;
    const p01 = probs.find(p => p.binary === '01')?.probability;

    assert(p00 === 0.5 && p11 === 0.5 && p01 === 0, 'Bell State |Φ+⟩ creates equal superposition of |00⟩ and |11⟩');
    
    const counts = qc.measure(1024);
    assert(counts['00'] > 400 && counts['11'] > 400 && !counts['01'], '1024-shot measurement yields only |00⟩ and |11⟩');
    assert(qc.toAscii().includes('●') && qc.toAscii().includes('⊕'), 'ASCII circuit diagram generated accurately');
  } catch (err) {
    assert(false, `Quantum Circuit Simulator crashed: ${err.message}`);
  }

  // --- TEST 2: Classical ML Service ---
  console.log(`\n[TEST 2] Classical ML Disease-Risk Classifier`);
  try {
    const patientHigh = { age: 65, blood_pressure: 160, cholesterol: 265, glucose: 160, bmi: 34.2, smoking: 1, diabetes: 1 };
    const patientLow = { age: 35, blood_pressure: 110, cholesterol: 170, glucose: 80, bmi: 21.0, smoking: 0, diabetes: 0, physical_activity: 1 };

    const resHigh = classicalMLService.predict(patientHigh);
    const resLow = classicalMLService.predict(patientLow);

    assert(resHigh.riskLevel === 'High' && resHigh.riskProbability > 70, `High-risk patient correctly classified as High (${resHigh.riskProbability}%)`);
    assert(resLow.riskLevel === 'Low' && resLow.riskProbability < 30, `Low-risk patient correctly classified as Low (${resLow.riskProbability}%)`);
    assert(resHigh.metrics.accuracy === 0.845 && resHigh.metrics.f1Score === 0.840, 'Model metrics accurately documented (Accuracy: 84.5%, F1: 0.840)');
  } catch (err) {
    assert(false, `Classical ML crashed: ${err.message}`);
  }

  // --- TEST 3: Quantum Machine Learning (QML) VQC ---
  console.log(`\n[TEST 3] Quantum Machine Learning 4-Qubit VQC`);
  try {
    const patient = { age: 55, blood_pressure: 142, cholesterol: 245, glucose: 118, bmi: 29.4 };
    const norm = classicalMLService.normalizeFeatures(patient);
    const qmlRes = qmlService.predict(norm);

    assert(qmlRes.qubits === 4, 'QML operates on 4 entangled qubits');
    assert(typeof qmlRes.riskProbability === 'number' && qmlRes.riskProbability >= 0 && qmlRes.riskProbability <= 100, `QML computes valid risk probability (${qmlRes.riskProbability}%)`);
    assert(qmlRes.metrics.accuracy === 0.812 && qmlRes.metrics.f1Score === 0.812, 'QML benchmark metrics documented (Accuracy: 81.2%, F1: 0.812)');
    assert(qmlRes.quantumGatesTotal === 22, 'Variational circuit depth & gate count computed accurately');
  } catch (err) {
    assert(false, `QML crashed: ${err.message}`);
  }

  // --- TEST 4: AI Quantum Tutor ---
  console.log(`\n[TEST 4] AI Quantum Tutor Knowledge Engine`);
  try {
    const ansSuperposition = await aiService.answerQuestion('What is superposition?');
    assert(ansSuperposition.answer.toLowerCase().includes('linear combination') || ansSuperposition.answer.toLowerCase().includes('superposition'), 'Explains superposition accurately');

    const ansQubit = await aiService.answerQuestion('What is a qubit?');
    assert(ansQubit.answer.toLowerCase().includes('quantum bit'), 'Explains qubit geometry & amplitudes');

    const ansDiff = await aiService.answerQuestion('Difference between ML and QML');
    assert(ansDiff.answer.toLowerCase().includes('hilbert space'), 'Articulates difference between classical Euclidean space and quantum Hilbert space');
  } catch (err) {
    assert(false, `AI Quantum Tutor crashed: ${err.message}`);
  }

  // --- TEST 5: HTTP Endpoints & x402 Payment Protection ---
  console.log(`\n[TEST 5] HTTP Endpoints & x402 Protocol on Algorand Testnet`);

  const server = http.createServer(app);
  await new Promise(res => server.listen(5099, res));
  const baseUrl = 'http://127.0.0.1:5099/api';

  try {
    // 5.1 GET /api/quantum/topics
    const topicsRes = await fetch(`${baseUrl}/quantum/topics`).then(r => r.json());
    assert(topicsRes.success && topicsRes.topics.length === 12, 'GET /api/quantum/topics returns 12 interactive topics');

    // 5.2 POST /api/quantum/circuit
    const circuitRes = await fetch(`${baseUrl}/quantum/circuit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numQubits: 2, gates: [{ gate: 'H', target: 0 }, { gate: 'CNOT', control: 0, target: 1 }] })
    }).then(r => r.json());
    assert(circuitRes.success && circuitRes.shots === 1024, 'POST /api/quantum/circuit executes simulation');

    // 5.3 POST /api/health/analyze WITHOUT payment -> MUST RETURN HTTP 402!
    const req402 = await fetch(`${baseUrl}/health/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient: { age: 55, blood_pressure: 140 } })
    });
    const body402 = await req402.json();
    assert(req402.status === 402, 'POST /api/health/analyze without payment returns HTTP 402 Payment Required');
    assert(body402.price === '0.1 ALGO' && body402.amountMicroAlgos === 100000, 'x402 challenge specifies exact 0.1 ALGO price');
    assert(req402.headers.get('payment-required') === 'true', 'Payment-Required header attached in HTTP response');

    // 5.4 POST /api/health/analyze WITH INVALID payment -> MUST RETURN HTTP 400!
    const reqInvalid = await fetch(`${baseUrl}/health/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient: { age: 55 },
        txId: 'FAKE_OR_INVALID_TRANSACTION_ID_12345'
      })
    });
    assert(reqInvalid.status === 400, 'POST /api/health/analyze with invalid/fake txId is rejected with HTTP 400');

    // 5.5 POST /api/health/analyze WITH CONFIRMED Algorand Testnet TxID -> MUST RETURN HTTP 200!
    const realConfirmedTxId = 'MG7ICU4AVQKQQ2IXRBNC777VP4FD5GZXSIXRPTTWO3L7DCJ3XHXA';
    const reqVerified = await fetch(`${baseUrl}/health/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient: { age: 55, blood_pressure: 142, cholesterol: 245, glucose: 118, bmi: 29.4 },
        txId: realConfirmedTxId,
        sender: 'YT6CIJKMCREOU6L2UGT55K5MIQ65K2ZAACFHK2PN2IBALIPB2MEZNVVJAY'
      })
    });
    const bodyVerified = await reqVerified.json();
    assert(reqVerified.status === 200, 'POST /api/health/analyze with verified Algorand Testnet TxID returns HTTP 200 OK');
    assert(bodyVerified.payment?.verified === true, 'Payment verified flag is true');
    assert(bodyVerified.classical_ml && bodyVerified.quantum_ml, 'Returns both Classical ML and Quantum ML outputs');
    assert(bodyVerified.disclaimer && bodyVerified.disclaimer.includes('Educational / Research Prototype'), 'Mandatory research disclaimer included in response');

    // 5.6 GET /api/payments
    const paymentsRes = await fetch(`${baseUrl}/payments`).then(r => r.json());
    assert(paymentsRes.success && paymentsRes.payments.length > 0, 'GET /api/payments lists verified transaction audit trail');
  } catch (err) {
    assert(false, `HTTP tests crashed: ${err.message}`);
  } finally {
    server.close();
  }

  console.log(`\n================================================================`);
  console.log(`📊 FINAL SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`================================================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
