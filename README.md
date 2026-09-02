# Agentic Solutions: Powered by x402 on Algorand
### 🏆 Build With Bharat 2.0 Hackathon MVP (Live x402 on Algorand Testnet)

An autonomous AI Agent application that evaluates natural language requests, determines required actions, and enforces the **official x402 Micropayment Protocol** on the **Algorand Testnet** verified and settled on-chain.

---

## 🌟 Hackathon Architecture Overview

* **x402 Micropayment Protocol**: Uses official `@x402/core` and `@x402/avm` packages for HTTP 402 Payment Required negotiation.
* **Blockchain Settlement Network**: Algorand Testnet (`testnet-v1.0`).
* **Facilitator Integration**: GoPlausible Facilitator (`https://facilitator.goplausible.xyz`).
* **Native ALGO Micropayments**: Standardized to **0.1 ALGO ($100{,}000\text{ microAlgos}$)** native Testnet transfers.
* **Real On-Chain Verification**: Verified against live Algorand nodes (`Algodv2`) and Algorand Indexer (`Indexer`).
* **Zero Fake Transactions**: No simulated transaction IDs or hardcoded fake successes. Every paid unlock is tied to an immutable on-chain transaction round.

---

## 🤖 AI Agent & Service Tiers

| Service Name | Service ID | Pricing Tier | Gating Mechanism | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Quick Research & Text Summarizer** | `free_summary` | **FREE (0 ALGO)** | None (Open Access) | Analyzes input text and generates structured 3-point technical summaries. |
| **Algorand Smart Contract Auditor** | `contract_audit` | **0.1 ALGO** | **HTTP 402 x402 Payment** | Static and opcode budget security analysis for PyTeal and TEAL smart contracts. |
| **Deep Market & On-Chain Intel** | `market_intel` | **0.1 ALGO** | **HTTP 402 x402 Payment** | Live Algorand Testnet node performance metrics and ecosystem liquidity analysis. |

---

## ⚡ Integrated Flow Architecture

```text
User Request (Natural Language)
    │
    ▼
Autonomous AI Agent Intent Evaluation
    │
    ├──► Free Request ("Summarize x402...") ──► Executes Immediately (0 ALGO) ──► Returns AI Summary
    │
    └──► Paid Request ("Audit smart contract...")
             │
             ▼
         HTTP 402 Payment Required (Price: 0.1 ALGO)
             │
             ▼
         Frontend Checks Wallet Balance (>= 0.101 ALGO)
             │
             ▼
         Client Wallet Signs Payment Transaction
             │
             ▼
         Broadcast to Algorand Testnet Node
             │
             ▼
         Wait for Block Confirmation (Consensus Round)
             │
             ▼
         Backend Dual Algod + Indexer Verification
             │
             ├── If Valid (>= 0.1 ALGO confirmed) ──► Unlocks AI Service ──► Returns Report + Tx Proof
             └── If Rejected / Unconfirmed ────────► Service Remains Strictly Locked
```

---

## 🛡️ Payment Failure Handling Matrix

| Scenario | Trigger Condition | System Behavior | Service Access |
| :--- | :--- | :--- | :--- |
| **Insufficient Balance** | Wallet balance $< 0.101\text{ ALGO}$ | Displays amber notice with direct dispenser link; "Sign & Pay" button disabled. | 🔒 **Locked** |
| **User Rejection** | User cancels/rejects wallet signing | Catches `PaymentCancelledError` and shows "Payment Cancelled" banner. | 🔒 **Locked** |
| **Submission Failure** | Node broadcast error or pool rejection | Displays node error diagnostics. | 🔒 **Locked** |
| **Verification Failure** | TxID not found, underpayment, or unconfirmed round | Backend returns `400 Bad Request` with `PAYMENT_VERIFICATION_FAILED`. | 🔒 **Locked** |
| **Settlement Timeout** | Block confirmation times out on Testnet | Displays "Settlement Failed" notice. | 🔒 **Locked** |
| **Successful Payment** | Confirmed on-chain transaction $\ge 0.1\text{ ALGO}$ | Verifies round & amount, returns `200 OK`, unlocks service, links to Lora Explorer. | 🔓 **Unlocked** |

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)
```bash
PORT=5000
NODE_ENV=development

# Algorand Testnet Node (Algonode API Cluster)
ALGORAND_NODE_URL=https://testnet-api.algonode.cloud
ALGORAND_INDEXER_URL=https://testnet-idx.algonode.cloud
ALGORAND_NETWORK=testnet

# Receiver Public Address
AVM_ADDRESS=ZMFK2OI7ZBD2U27ISERZC4S6LKM6WMFJPZQ4MYNJDZ2VNBNMBA67RA22AA

# Hosted Facilitator
FACILITATOR_URL=https://facilitator.goplausible.xyz

# Optional: Server-side AI API Keys (Optional — built-in contextual NLP engine runs zero-config)
# GEMINI_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here
```

### Frontend (`frontend/.env`)
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ALGORAND_NETWORK=testnet
VITE_ALGORAND_EXPLORER_URL=https://lora.algokit.io/testnet
VITE_GOPLAUSIBLE_FACILITATOR_URL=https://facilitator.goplausible.xyz
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Files
```bash
# In backend/
cp .env.example .env

# In frontend/
cp .env.example .env
```

### 3. Run Development Servers
```bash
# Terminal 1 (Backend - Port 5000):
cd backend
npm start

# Terminal 2 (Frontend - Port 3000):
cd frontend
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Automated Test Verification

Run the automated verification suites in `backend/`:

```bash
# Test 1: Full Paid Flow & Real On-Chain Verification
node test_paid_flow.js

# Test 2: Comprehensive Payment Failure Suite
node test_payment_failures.js

# Test 3: Wallet Persistence & Reconnect Lifecycle
node test_wallet_lifecycle.js
```

---

## 🔍 Known MVP Scope & Honest Labels

1. **Testnet Micropayments**: Configured for **Algorand Testnet** native ALGO ($0.1\text{ ALGO}$).
2. **AI Intelligence Engine**: Supports Gemini and OpenAI server-side API keys with an intelligent built-in domain NLP synthesizer when keys are not configured.
3. **Market Intelligence Data**: Network block rounds and average block times are fetched live from the Algorand Testnet node. Ecosystem liquidity pair depth is computed from benchmark AMM models.
