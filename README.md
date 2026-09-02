# ⚛️ Quantum AI HealthLab

> **"Learn Quantum. Build Quantum AI. Apply It to Healthcare."**  
> *An Agentic Quantum AI Platform for Learning, Circuit Experimentation, and Pay-Per-Use Healthcare Intelligence.*  
> **Built for the Build With Bharat 2.0 Hackathon**

---

## 🌟 Overview & Problem Statement

### The Problem
Quantum computing and artificial intelligence are revolutionizing modern science, yet they remain abstract, highly mathematical, and disconnected from real-world medical applications. Furthermore, as proprietary Quantum Machine Learning (QML) models emerge, there is no standardized, low-latency protocol to monetize high-value AI inference at the machine-to-machine level without subscriptions or credit card friction.

### The Solution: Quantum AI HealthLab
**Quantum AI HealthLab** is an end-to-end platform that connects:
1. **Interactive Quantum Education**: 12 fundamental topics from qubits to variational quantum classifiers.
2. **Interactive Quantum Circuit Lab**: Visual multi-qubit circuit builder with exact statevector simulation and 1024-shot probability distributions.
3. **AI Quantum Tutor**: Conversational AI tutor explaining quantum physics and QML mechanics.
4. **Classical Machine Learning Baseline**: L2-regularized Logistic Regression (84.5% validation accuracy).
5. **Quantum Machine Learning (QML)**: 4-Qubit Variational Quantum Classifier (VQC) with angle encoding and entangling ansatz (81.2% validation accuracy).
6. **Agentic AI Orchestrator**: Natural language routing between free quantum tools and paid medical risk analysis.
7. **x402 Pay-Per-Use Protocol**: Cryptographic **HTTP 402 Payment Required** gating on Algorand Testnet.
8. **Real Blockchain Settlement**: Verified on-chain via **GoPlausible Facilitator** and **Algorand Testnet consensus rounds**.

---

## 🏗️ Architecture & x402 Flow

```text
                    USER / CLINICAL RESEARCHER
                                │
                                ▼
                 QUANTUM AI HEALTHLAB DASHBOARD
           (Modern Multi-Module Workspace: React, Vite, Tailwind)
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
QUANTUM LEARNING LAB    QUANTUM CIRCUIT LAB      AI QUANTUM TUTOR
(12 Interactive Topics) (1-4 Qubit Simulator)   (Conversational Q&A)
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                                ▼
                         AI HEALTH AGENT
                  (Intent & Tool Orchestrator)
                                │
                                ▼
              POST /api/health/analyze (Protected)
                                │
                                ▼
                    HTTP 402 PAYMENT REQUIRED
                 (0.1 ALGO / 100,000 microAlgos)
                                │
                                ▼
                     ALGORAND TESTNET WALLET
                    (Atomic Payment Signed)
                                │
                                ▼
                     GoPlausible Facilitator
                                │
                                ▼
                  DUAL ON-CHAIN VERIFICATION
                (Algod + Indexer Consensus Round)
                                │
                                ▼
                  HYBRID ML + QML DISEASE ENGINE
            ┌───────────────────┴───────────────────┐
            ▼                                       ▼
    Classical ML Baseline                   Quantum ML (QML)
 (Logistic Regression: 84.5%)            (4-Qubit VQC: 81.2%)
            │                                       │
            └───────────────────┬───────────────────┘
                                │
                                ▼
                   HEALTH RISK REPORT (CARD)
                  • Consensus Risk Assessment
                  • Combined Risk Probability
                  • Classical vs QML Metrics
                  • AI Contextual Explanation
                  • Verified Algorand TxID (Lora Explorer)
```

---

## 🚀 Live Demonstration & Deployment

- **Live URL (Render):** [https://build-with-bharat-agentic-x402.onrender.com](https://build-with-bharat-agentic-x402.onrender.com)
- **GitHub Repository:** [https://github.com/TusharMis/build_with2.O](https://github.com/TusharMis/build_with2.O)
- **Blockchain Network:** Algorand Testnet (`algorand:testnet`)
- **Payment Facilitator:** GoPlausible Hosted Facilitator (`https://facilitator.goplausible.xyz`)
- **Recipient Address (AVM):** `ZMFK2OI7ZBD2U27ISERZC4S6LKM6WMFJPZQ4MYNJDZ2VNBNMBA67RA22AA`
- **Service Price:** `0.1 ALGO` (100,000 microAlgos)

---

## 📦 Monorepo Directory Structure

```text
build_with2.O/
├── backend/
│   ├── src/
│   │   ├── agent/                 # AI Agent & Semantic Router
│   │   │   ├── agent.service.js
│   │   │   ├── ai.service.js
│   │   │   └── prompts.js
│   │   ├── blockchain/            # Algorand Testnet Service (Algod & Indexer)
│   │   │   └── algorand.service.js
│   │   ├── config/                # Environment configuration
│   │   ├── data/                  # Cardiovascular healthcare dataset
│   │   │   └── sample_health_data.csv
│   │   ├── ml/                    # Classical Machine Learning baseline
│   │   │   └── classical.ml.service.js
│   │   ├── payment/               # x402 SDK & GoPlausible Client
│   │   │   └── x402.service.js
│   │   ├── qml/                   # Variational Quantum Classifier (VQC)
│   │   │   └── qml.service.js
│   │   ├── quantum/               # Multi-qubit Statevector Quantum Simulator
│   │   │   └── quantum.simulator.js
│   │   ├── routes/                # Express API Routes
│   │   │   ├── health.routes.js   # Gated POST /api/health/analyze (0.1 ALGO)
│   │   │   ├── quantum.routes.js  # /api/quantum/topics, circuit, predict
│   │   │   ├── agent.routes.js
│   │   │   └── paidService.routes.js
│   │   ├── tools/                 # Tool Registry (Free & Paid)
│   │   └── server.js              # Production server & static frontend serving
│   ├── qml_python/                # Python Qiskit Reference Implementation
│   │   └── qml_reference.py
│   ├── test_quantum_health.js     # Master 24-test verification suite
│   ├── test_six_prompts.js        # AI routing & web search test suite
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/            # React UI Components
│   │   │   ├── QuantumLearningLab.jsx  # 12 Interactive Quantum Topics
│   │   │   ├── QuantumCircuitLab.jsx   # Multi-Qubit Visual Circuit Builder
│   │   │   ├── AIQuantumTutor.jsx      # Conversational Quantum Tutor
│   │   │   ├── HealthcareAnalysis.jsx  # Real-World Disease Risk Analysis
│   │   │   ├── AgentDashboard.jsx      # AI Health Agent Workspace
│   │   │   ├── PaymentHistory.jsx      # On-Chain Audit Ledger
│   │   │   ├── PaymentModal.jsx        # x402 Atomic Wallet Payment Modal
│   │   │   ├── LandingHero.jsx         # Dashboard & Architecture Hub
│   │   │   └── Navbar.jsx              # Multi-Module Navigation
│   │   ├── context/               # Agent & Wallet State Providers
│   │   ├── services/              # API & Algorand Payment Clients
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── architecture.md            # Detailed Architecture Specifications
│   └── x402-flow.md               # Step-by-Step Payment Sequence
├── render.yaml                    # Automated Render Deployment Blueprint
├── package.json                   # Unified Root Scripts
└── README.md
```

---

## ⚡ Quick Start: Running Locally

### 1. Prerequisites
- **Node.js** >= 20.0.0
- **npm** >= 10.0.0

### 2. Clone and Install
```bash
git clone https://github.com/TusharMis/build_with2.O.git
cd build_with2.O

# Install root, backend, and frontend dependencies
npm run build
```

### 3. Configure Environment Variables
Create `.env` in the `backend/` directory (or use `.env.example`):
```env
PORT=5000
NODE_ENV=development
ALGORAND_NODE_URL=https://testnet-api.algonode.cloud
ALGORAND_INDEXER_URL=https://testnet-idx.algonode.cloud
ALGORAND_NETWORK=testnet
AVM_ADDRESS=ZMFK2OI7ZBD2U27ISERZC4S6LKM6WMFJPZQ4MYNJDZ2VNBNMBA67RA22AA
PAYMENT_AMOUNT=100000
FACILITATOR_URL=https://facilitator.goplausible.xyz
```

### 4. Start Backend & Frontend
```bash
# Start backend server
cd backend
npm start

# In a separate terminal, start frontend dev server
cd frontend
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🧪 Verification & Test Suite

The project includes an automated test suite verifying:
- Quantum Circuit Simulator (Hadamard, Pauli, CNOT, Bell State, 1024-shot sampling)
- Classical ML classification on high/low risk patients
- 4-Qubit Variational Quantum Classifier (VQC) expectation calculation
- AI Quantum Tutor semantic question answering
- x402 HTTP 402 gating, invalid payment rejection (HTTP 400), and confirmed Algorand Testnet verification (HTTP 200)

Run the master test suite:
```bash
cd backend
node test_quantum_health.js
```
**Output:**
```text
================================================================
📊 FINAL SUMMARY: 24 PASSED, 0 FAILED
================================================================
```

---

## 💳 Real Algorand Testnet x402 Payment Flow

### How to Fund Your Testnet Wallet
1. Open the app and connect your wallet (or use the pre-configured persistent Testnet Demo Wallet).
2. Copy your Testnet address (e.g. `6PG4YO...MH6I`).
3. Visit the official **[Algorand Testnet Dispenser](https://bank.testnet.algorand.network/)**.
4. Paste your address and request free Testnet ALGO.
5. Your balance will reflect immediately in the top navigation bar.

### Performing a Real Payment
1. Navigate to **"Healthcare Analysis"** in the top navigation bar.
2. Click **"Load: High Risk"** to populate 10 clinical vitals (Age 65, BP 160, Chol 265, Glu 160, BMI 34).
3. Click **"Run Quantum AI Analysis (0.1 ALGO via x402)"**.
4. The server returns **HTTP 402 Payment Required** and opens the payment modal.
5. Click **"Approve 0.1 ALGO Payment"**. The transaction is signed and broadcast to Algorand Testnet.
6. The backend verifies the transaction on Testnet block consensus and returns the full Classical ML + QML evaluation card with a clickable **Lora Algokit Explorer** link!

---

## 🔬 Scientific Honesty: Classical ML vs Quantum ML

We present an honest, scientifically grounded benchmark:
- **Classical ML (Logistic Regression)**: Achieves **84.5% Accuracy** (F1: 0.840) on tabular clinical indicators through fast, interpretable linear weighting.
- **Quantum ML (4-Qubit VQC)**: Achieves **81.2% Accuracy** (F1: 0.812) by mapping features to a 16-dimensional Hilbert space ($2^4$) via angle encoding and entangling CNOT circuits.
- **Conclusion**: On low-dimensional tabular datasets, classical ML remains highly competitive and computationally lightweight. QML provides unique non-linear feature entanglement representations essential for high-dimensional genomic, molecular, and multi-omic disease modeling.

---

## 🛡️ Medical & Research Disclaimer

> **Educational & Research Prototype — Not a Medical Diagnosis:**  
> This platform is an educational demonstration of Quantum Machine Learning, AI Agents, and x402 Web3 micropayments. It does **not** provide medical diagnosis, clinical prognosis, or treatment recommendations. Never use this prototype as a substitute for professional medical advice or physician diagnosis.

---

## 🏆 Hackathon Submission Checklist

- [x] **x402 Protocol**: Fully integrated with `@x402/core` & `@x402/avm`.
- [x] **Algorand Testnet**: Real on-chain transactions verified via Algod & Indexer.
- [x] **GoPlausible Facilitator**: Operational handshake and transaction verification.
- [x] **Interactive Quantum Learning Lab**: 12 complete topics with circuit presets.
- [x] **Quantum Circuit Lab**: Visual multi-qubit builder with statevector math & histograms.
- [x] **AI Quantum Tutor**: Conversational Q&A on quantum concepts.
- [x] **Classical ML & QML**: Tested side-by-side models on cardiovascular vitals.
- [x] **Agentic AI**: Autonomous intent routing and payment coordination.
- [x] **Payment History**: Immutable on-chain audit ledger.
- [x] **Render Deployment**: Single-command unified deployment blueprint.
- [x] **Zero Mocking**: No simulated blockchain transactions; real on-chain proofs only.
