# Quantum AI HealthLab — System Architecture

**Project Tagline:** *"Learn Quantum. Build Quantum AI. Apply It to Healthcare."*  
**Hackathon:** Build With Bharat 2.0

---

## 1. High-Level Architecture

```text
                                 USER / CLINICAL RESEARCHER
                                              │
                                              ▼
                                REACT DASHBOARD & AGENTIC UI
                       (Modern Multi-Module Workspace, Vite + Tailwind)
                                              │
               ┌──────────────────────────────┼──────────────────────────────┐
               ▼                              ▼                              ▼
      QUANTUM LEARNING LAB           QUANTUM CIRCUIT LAB             AI QUANTUM TUTOR
    (12 Interactive Modules)      (1-4 Qubit State Simulator)     (Conversational Q&A)
               │                              │                              │
               └──────────────────────────────┼──────────────────────────────┘
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
                               (Challenge: 0.1 ALGO / 100k μA)
                                              │
                                              ▼
                                   ALGORAND TESTNET WALLET
                                  (Atomic Payment Signed)
                                              │
                                              ▼
                                   GoPlausible Facilitator
                                              │
                                              ▼
                                ON-CHAIN TESTNET VERIFICATION
                              (Dual Algod + Indexer Validation)
                                              │
                                              ▼
                                HYBRID ML + QML DISEASE ENGINE
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
              Classical ML Baseline                           Quantum ML (QML)
           (Logistic Regression: 84.5% Acc)                (4-Qubit VQC: 81.2% Acc)
                      │                                               │
                      └───────────────────────┬───────────────────────┘
                                              │
                                              ▼
                                 HEALTH RISK ANALYSIS REPORT
                                • Combined Risk Probability
                                • Side-by-Side Model Comparison
                                • AI Contextual Explanation
                                • Verified Algorand TxID (Lora Explorer)
```

---

## 2. Key Modules & Subsystems

### Module 1: Dashboard
- Central hub displaying all 7 capabilities: Quantum Learning, Circuit Lab, AI Tutor, Classical ML, Quantum ML, AI Agent, and x402 Micropayments on Algorand Testnet.
- Status badges showing active Algorand node connectivity and GoPlausible facilitator handshake.

### Module 2: Quantum Learning Lab
- 12 interactive topics:
  1. Qubit (Quantum Bit)
  2. Quantum Superposition
  3. Quantum Entanglement
  4. Quantum Measurement
  5. Hadamard Gate ($H$)
  6. Pauli-$X$ Gate
  7. Pauli-$Y$ Gate
  8. Pauli-$Z$ Gate
  9. Controlled-NOT Gate ($\text{CNOT}$)
  10. Quantum Circuit Architecture
  11. Quantum Speedup Principle
  12. Quantum Machine Learning (QML)
- Each topic features mathematical formulas, intuitive explanations, physical analogies, and a one-click **"Try in Circuit Lab"** action.

### Module 3: Quantum Circuit Lab
- Visual, interactive multi-qubit circuit builder supporting 1 to 4 qubits.
- Gate palette: $H$, $X$, $Y$, $Z$, $\text{CNOT}$.
- Real-time simulation returning exact statevector probabilities ($|\alpha|^2$) and 1024-shot measurement histograms.
- Built-in circuit presets: Bell State ($|\Phi^+\rangle$), GHZ 3-qubit entanglement, All-H Superposition, and QML 4-Qubit Feature Map.

### Module 4: AI Quantum Tutor
- Conversational tutor answering conceptual and mathematical quantum questions.
- Integrated with Google Gemini API and a rich local fallback engine.

### Module 5: Healthcare Disease-Risk Prediction (Real-World Application)
- Real clinical indicators: Age, Gender, Systolic BP, Cholesterol, Glucose, BMI, Resting Heart Rate, Smoking Status, Diabetes, Physical Activity.
- One-click presets: High Risk, Moderate Risk, Low Risk.
- Prominent educational disclaimer banner: *"Educational / Research Prototype — Not a Medical Diagnosis."*

### Module 6 & 7: Classical ML vs Quantum ML
- **Classical ML Baseline**: L2-regularized Logistic Regression calibrated on cardiovascular risk datasets (Validation Accuracy: 84.5%, F1 Score: 0.840).
- **Quantum ML (QML)**: 4-Qubit Variational Quantum Classifier (VQC) with angle feature encoding, entangling CNOT chains, parameterized ansatz rotations ($R_y(\theta), R_z(\theta)$), and Pauli-$Z_0$ expectation readout (Validation Accuracy: 81.2%, F1 Score: 0.812).
- Honest scientific comparison highlighting linear clinical weighting vs. multi-dimensional Hilbert space entanglement.

### Module 8 & 9: AI Health Agent & x402 Micropayment Gating
- Protected endpoint: `POST /api/health/analyze`.
- Requires 0.1 ALGO (100,000 microAlgos) on Algorand Testnet.
- Client wallet signs atomic transaction; GoPlausible facilitator and dual Algod + Indexer consensus verify payment on-chain before executing ML/QML analysis.
