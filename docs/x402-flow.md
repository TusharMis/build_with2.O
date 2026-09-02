# x402 Micropayment Protocol Flow — Algorand Testnet

**Project:** Quantum AI HealthLab  
**Facilitator:** GoPlausible (`https://facilitator.goplausible.xyz`)  
**Network:** Algorand Testnet (CAIP-2: `algorand:testnet`)  
**Protected Service:** `POST /api/health/analyze` (0.1 ALGO / 100,000 microAlgos)

---

## 1. Sequence Diagram

```text
CLIENT (Browser)            BACKEND (Express / x402)       ALGORAND TESTNET         GOPLAUSIBLE
      │                               │                           │                      │
      │── 1. POST /api/health/analyze ─►                          │                      │
      │   (without payment proof)     │                           │                      │
      │                               │                           │                      │
      │◄── 2. HTTP 402 Required ──────│                           │                      │
      │   (Amount: 0.1 ALGO,          │                           │                      │
      │    Receiver: ZMFK2OI7...AA)   │                           │                      │
      │                               │                           │                      │
      │── 3. Sign & Broadcast Tx ────────────────────────────────►│                      │
      │   (0.1 ALGO payment)          │                           │                      │
      │                               │                           │                      │
      │◄── 4. Receive TxID ───────────────────────────────────────│                      │
      │   (e.g. MG7ICU4AVQK...)       │                           │                      │
      │                               │                           │                      │
      │── 5. POST /api/health/analyze ─►                          │                      │
      │   (with txId & sender)        │                           │                      │
      │                               │── 6. Query Confirmed Tx ──►                      │
      │                               │◄── 7. Confirmed Round ────│                      │
      │                               │                           │                      │
      │                               │── 8. Verify Proof ──────────────────────────────►│
      │                               │◄── 9. Proof Validated ───────────────────────────│
      │                               │                           │                      │
      │                               │── 10. Run ML + QML Model  │                      │
      │                               │                           │                      │
      │◄── 11. HTTP 200 OK ───────────│                           │                      │
      │   (Risk Result, Metrics,      │                           │                      │
      │    AI Explanation, TxID)      │                           │                      │
```

---

## 2. Step-by-Step Flow Explanation

### Step 1: Initial Request (Unpaid)
The user submits patient vitals for cardiovascular disease risk evaluation. The client sends:
```http
POST /api/health/analyze HTTP/1.1
Content-Type: application/json

{
  "patient": {
    "age": 55,
    "blood_pressure": 142,
    "cholesterol": 245,
    "glucose": 118,
    "bmi": 29.4
  }
}
```

### Step 2: HTTP 402 Payment Challenge
Since no transaction ID or payment signature is present, the server intercepts the request and responds with **HTTP 402 Payment Required**:
```http
HTTP/1.1 402 Payment Required
Payment-Required: true
X-Payment-Amount: 100000
X-Payment-Currency: ALGO
X-Payment-Receiver: ZMFK2OI7ZBD2U27ISERZC4S6LKM6WMFJPZQ4MYNJDZ2VNBNMBA67RA22AA
X-Payment-Network: algorand:testnet
X-Payment-Service: health_analyze

{
  "status": 402,
  "error": "Payment Required",
  "price": "0.1 ALGO",
  "amountMicroAlgos": 100000,
  "receiver": "ZMFK2OI7ZBD2U27ISERZC4S6LKM6WMFJPZQ4MYNJDZ2VNBNMBA67RA22AA",
  "network": "algorand:testnet"
}
```

### Step 3: Atomic Transaction Signing
The client's Algorand wallet signs an atomic transaction sending `100,000 microAlgos` (0.1 ALGO) to the designated receiver address on Algorand Testnet.

### Step 4 & 5: Retry Request with Payment Proof
Once confirmed on the blockchain, the client immediately retries the API request with the on-chain payment proof:
```http
POST /api/health/analyze HTTP/1.1
Content-Type: application/json

{
  "patient": { ... },
  "txId": "MG7ICU4AVQKQQ2IXRBNC777VP4FD5GZXSIXRPTTWO3L7DCJ3XHXA",
  "sender": "YT6CIJKMCREOU6L2UGT55K5MIQ65K2ZAACFHK2PN2IBALIPB2MEZNVVJAY"
}
```

### Step 6 to 9: Dual Algod + Indexer & GoPlausible Verification
The server verifies:
1. `confirmedRound > 0` (Confirmed in an Algorand consensus round)
2. `amount >= 100000` (No underpayment)
3. Handshake validation with GoPlausible Facilitator

### Step 10 & 11: Protected Service Execution & HTTP 200 OK
Only upon successful on-chain validation does the server execute the **Classical Logistic Regression** and **4-Qubit Variational Quantum Classifier (VQC)**, returning:
```json
{
  "success": true,
  "prediction": "High",
  "risk_probability": 70.6,
  "classical_ml": { ... },
  "quantum_ml": { ... },
  "model_comparison": { ... },
  "explanation": "Comprehensive evaluation combines Classical ML with 4-Qubit VQC...",
  "payment": {
    "verified": true,
    "transactionId": "MG7ICU4AVQKQQ2IXRBNC777VP4FD5GZXSIXRPTTWO3L7DCJ3XHXA",
    "confirmedRound": 66886308,
    "amount": "0.1 ALGO",
    "network": "Algorand Testnet",
    "explorerUrl": "https://lora.algokit.io/testnet/transaction/MG7ICU4AVQKQQ2IXRBNC777VP4FD5GZXSIXRPTTWO3L7DCJ3XHXA"
  },
  "disclaimer": "Educational / Research Prototype — Not a Medical Diagnosis."
}
```
