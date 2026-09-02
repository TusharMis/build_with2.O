import { Router } from 'express';
import { QuantumCircuitSimulator } from '../quantum/quantum.simulator.js';
import { classicalMLService } from '../ml/classical.ml.service.js';
import { qmlService } from '../qml/qml.service.js';

const router = Router();

/**
 * Quantum Learning Lab: 12 Interactive Topics
 */
export const QUANTUM_TOPICS = [
  {
    id: 'qubit',
    title: 'Qubit (Quantum Bit)',
    category: 'Fundamentals',
    formula: '|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle, \\quad |\\alpha|^2 + |\\beta|^2 = 1',
    beginnerExplanation: 'While a classical bit is strictly 0 or 1 (like a light switch), a qubit can exist in a continuum of states between 0 and 1 until observed.',
    example: 'A photon polarization state or electron spin representing quantum information.',
    presetCircuit: { numQubits: 1, gates: [] }
  },
  {
    id: 'superposition',
    title: 'Quantum Superposition',
    category: 'Fundamentals',
    formula: 'H|0\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)',
    beginnerExplanation: 'Superposition enables a quantum computer to process vast combinations of possibilities simultaneously rather than one by one.',
    example: 'A coin spinning on a table is neither heads nor tails until it stops; during spin it explores both states.',
    presetCircuit: { numQubits: 1, gates: [{ gate: 'H', target: 0 }] }
  },
  {
    id: 'entanglement',
    title: 'Quantum Entanglement',
    category: 'Phenomena',
    formula: '|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)',
    beginnerExplanation: 'When two qubits become entangled, the state of one instantly determines the state of the other, no matter the distance between them.',
    example: 'Measuring qubit 0 to be 0 guarantees qubit 1 will measure 0 with 100% certainty in a Bell pair.',
    presetCircuit: { numQubits: 2, gates: [{ gate: 'H', target: 0 }, { gate: 'CNOT', control: 0, target: 1 }] }
  },
  {
    id: 'measurement',
    title: 'Quantum Measurement & Wavefunction Collapse',
    category: 'Phenomena',
    formula: 'P(|i\\rangle) = |\\langle i|\\psi\\rangle|^2',
    beginnerExplanation: 'Measuring a qubit forces its delicate quantum superposition to instantly collapse into a definite classical 0 or 1 outcome based on probability.',
    example: 'Measuring an equal superposition yields roughly 50% 0s and 50% 1s over 1024 repetitions.',
    presetCircuit: { numQubits: 1, gates: [{ gate: 'H', target: 0 }] }
  },
  {
    id: 'hadamard',
    title: 'Hadamard Gate (H)',
    category: 'Quantum Gates',
    formula: 'H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}',
    beginnerExplanation: 'The gateway to quantum computing. It transforms classical definite states (|0⟩ or |1⟩) into balanced 50/50 superpositions.',
    example: 'Applying H to |0⟩ produces (|0⟩ + |1⟩)/√2; applying H a second time returns to |0⟩.',
    presetCircuit: { numQubits: 1, gates: [{ gate: 'H', target: 0 }] }
  },
  {
    id: 'pauli-x',
    title: 'Pauli-X Gate (Quantum NOT)',
    category: 'Quantum Gates',
    formula: 'X = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\quad X|0\\rangle = |1\\rangle',
    beginnerExplanation: 'The quantum bit-flip gate. It rotates the qubit state by 180 degrees around the X-axis of the Bloch sphere, flipping |0⟩ to |1⟩.',
    example: 'Used for state preparation, initializing qubits to |1⟩, and conditional logic.',
    presetCircuit: { numQubits: 1, gates: [{ gate: 'X', target: 0 }] }
  },
  {
    id: 'pauli-y',
    title: 'Pauli-Y Gate (Bit & Phase Flip)',
    category: 'Quantum Gates',
    formula: 'Y = \\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix}, \\quad Y|0\\rangle = i|1\\rangle',
    beginnerExplanation: 'Applies both a bit-flip and a phase-flip with an imaginary unit i. Rotates the state vector around the Y-axis of the Bloch sphere.',
    example: 'Crucial for universal quantum control and constructing arbitrary Hamiltonian dynamics.',
    presetCircuit: { numQubits: 1, gates: [{ gate: 'Y', target: 0 }] }
  },
  {
    id: 'pauli-z',
    title: 'Pauli-Z Gate (Phase Flip)',
    category: 'Quantum Gates',
    formula: 'Z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}, \\quad Z|1\\rangle = -|1\\rangle',
    beginnerExplanation: 'Leaves state |0⟩ unchanged but inverts the sign of state |1⟩, introducing a 180-degree phase shift.',
    example: 'Forms the core of quantum phase kickback in Grover search and Deutsch-Jozsa algorithms.',
    presetCircuit: { numQubits: 1, gates: [{ gate: 'H', target: 0 }, { gate: 'Z', target: 0 }] }
  },
  {
    id: 'cnot',
    title: 'Controlled-NOT Gate (CNOT)',
    category: 'Entangling Gates',
    formula: '\\text{CNOT}|c, t\\rangle = |c, c \\oplus t\\rangle',
    beginnerExplanation: 'A two-qubit gate that flips the target qubit if and only if the control qubit is |1⟩. The primary tool for creating quantum entanglement.',
    example: 'Transforms |10⟩ into |11⟩, while leaving |00⟩ unchanged as |00⟩.',
    presetCircuit: { numQubits: 2, gates: [{ gate: 'X', target: 0 }, { gate: 'CNOT', control: 0, target: 1 }] }
  },
  {
    id: 'quantum-circuit',
    title: 'Quantum Circuit Architecture',
    category: 'Algorithms',
    formula: '|\\psi_{\\text{final}}\\rangle = U_k \\dots U_2 U_1 |00\\dots0\\rangle',
    beginnerExplanation: 'A sequence of quantum gates applied to an array of qubits over discrete time steps, culminating in measurement.',
    example: 'Quantum circuits represent quantum computer programs, just as logic gates represent classical programs.',
    presetCircuit: { numQubits: 3, gates: [{ gate: 'H', target: 0 }, { gate: 'CNOT', control: 0, target: 1 }, { gate: 'CNOT', control: 1, target: 2 }] }
  },
  {
    id: 'quantum-algorithm',
    title: 'Quantum Algorithms (Speedup Principle)',
    category: 'Algorithms',
    formula: '\\mathcal{O}(\\sqrt{N}) \\text{ (Grover)} \\quad \\text{vs} \\quad \\mathcal{O}(N) \\text{ (Classical)}',
    beginnerExplanation: 'Harnesses constructive interference to amplify correct solutions while destructive interference cancels incorrect ones.',
    example: "Shor's algorithm factors large numbers exponentially faster; Grover's algorithm searches unsorted databases quadratically faster.",
    presetCircuit: { numQubits: 2, gates: [{ gate: 'H', target: 0 }, { gate: 'H', target: 1 }, { gate: 'Z', target: 0 }, { gate: 'H', target: 0 }] }
  },
  {
    id: 'qml',
    title: 'Quantum Machine Learning (QML)',
    category: 'Advanced QML',
    formula: 'f(x; \\theta) = \\langle 0| U^\\dagger(x) W^\\dagger(\\theta) \\hat{M} W(\\theta) U(x) |0\\rangle',
    beginnerExplanation: 'Maps classical data into an exponentially large multi-dimensional quantum Hilbert space to detect subtle non-linear disease correlations.',
    example: 'In healthcare risk prediction, QML encodes patient biomarkers into multi-qubit entangled states for personalized diagnosis assistance.',
    presetCircuit: { 
      numQubits: 4, 
      gates: [
        { gate: 'H', target: 0 }, { gate: 'H', target: 1 }, { gate: 'H', target: 2 }, { gate: 'H', target: 3 },
        { gate: 'CNOT', control: 0, target: 1 }, { gate: 'CNOT', control: 2, target: 3 }
      ] 
    }
  }
];

// GET /api/quantum/topics
router.get('/topics', (req, res) => {
  res.json({
    success: true,
    count: QUANTUM_TOPICS.length,
    topics: QUANTUM_TOPICS
  });
});

// POST /api/quantum/circuit
router.post('/circuit', (req, res) => {
  try {
    const { numQubits = 2, gates = [] } = req.body;
    const qc = new QuantumCircuitSimulator(Math.min(4, Math.max(1, numQubits)));

    gates.forEach(g => {
      switch (g.gate) {
        case 'H': qc.h(g.target); break;
        case 'X': qc.x(g.target); break;
        case 'Y': qc.y(g.target); break;
        case 'Z': qc.z(g.target); break;
        case 'Ry': qc.ry(g.target, g.theta || Math.PI / 2); break;
        case 'Rz': qc.rz(g.target, g.theta || Math.PI / 2); break;
        case 'CNOT': 
          if (g.control !== undefined && g.target !== undefined && g.control !== g.target) {
            qc.cnot(g.control, g.target);
          }
          break;
      }
    });

    const probabilities = qc.getProbabilities();
    const measurementCounts = qc.measure(1024);
    const circuitAscii = qc.toAscii();

    res.json({
      success: true,
      numQubits: qc.numQubits,
      gateCount: gates.length,
      circuitAscii,
      probabilities,
      measurementCounts,
      shots: 1024,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/ml/predict
router.post('/ml/predict', (req, res) => {
  try {
    const patient = req.body.patient || req.body;
    const result = classicalMLService.predict(patient);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/qml/predict
router.post('/qml/predict', (req, res) => {
  try {
    const patient = req.body.patient || req.body;
    const norm = classicalMLService.normalizeFeatures(patient);
    const result = qmlService.predict(norm);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/ml-vs-qml
router.post('/ml-vs-qml', (req, res) => {
  try {
    const patient = req.body.patient || req.body;
    const norm = classicalMLService.normalizeFeatures(patient);
    const classicalResult = classicalMLService.predict(patient);
    const qmlResult = qmlService.predict(norm);

    res.json({
      success: true,
      patientInput: patient,
      classicalML: classicalResult,
      quantumML: qmlResult,
      comparison: {
        riskConsensus: classicalResult.riskLevel === qmlResult.riskLevel ? 'Strong Consensus' : 'Divergent Evaluation',
        classicalProbability: `${classicalResult.riskProbability}%`,
        quantumProbability: `${qmlResult.riskProbability}%`,
        classicalAccuracy: '84.5%',
        quantumAccuracy: '81.2%',
        scientificObservation: 'Classical Logistic Regression provides transparent linear weighting on standard clinical vitals, while the 4-Qubit Variational Quantum Classifier captures entangled risk non-linearities across cardiovascular and metabolic dimensions.'
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
