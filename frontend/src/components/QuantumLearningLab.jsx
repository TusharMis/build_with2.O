import React, { useState } from 'react';
import { 
  Atom, 
  Sparkles, 
  Cpu, 
  ArrowRight, 
  Layers, 
  Binary, 
  Network, 
  Activity, 
  BookOpen,
  Play,
  Zap,
  CheckCircle2
} from 'lucide-react';

const TOPICS = [
  {
    id: 'qubit',
    title: 'Qubit (Quantum Bit)',
    category: 'Fundamentals',
    icon: Atom,
    formula: '|ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1',
    beginnerExplanation: 'While a classical bit is strictly 0 or 1 (like a light switch), a qubit can exist in a continuum of states between 0 and 1 until observed.',
    example: 'Photon polarization or electron spin representing quantum information on a 3D Bloch sphere.',
    circuitPreset: { numQubits: 1, gates: [] }
  },
  {
    id: 'superposition',
    title: 'Quantum Superposition',
    category: 'Fundamentals',
    icon: Sparkles,
    formula: 'H|0⟩ = (|0⟩ + |1⟩)/√2',
    beginnerExplanation: 'Superposition allows a quantum processor to explore vast combinations of possibilities concurrently rather than one-by-one.',
    example: 'A spinning coin is neither heads nor tails until it stops; during spin it explores both probabilities simultaneously.',
    circuitPreset: { numQubits: 1, gates: [{ gate: 'H', target: 0 }] }
  },
  {
    id: 'entanglement',
    title: 'Quantum Entanglement',
    category: 'Phenomena',
    icon: Network,
    formula: '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2',
    beginnerExplanation: 'When two qubits become entangled, the state of one instantly dictates the state of the other, regardless of the distance between them.',
    example: 'Measuring qubit 0 to be 0 guarantees qubit 1 collapses to 0 with 100% certainty in a Bell state.',
    circuitPreset: { numQubits: 2, gates: [{ gate: 'H', target: 0 }, { gate: 'CNOT', control: 0, target: 1 }] }
  },
  {
    id: 'measurement',
    title: 'Quantum Measurement',
    category: 'Phenomena',
    icon: Activity,
    formula: 'P(|i⟩) = |⟨i|ψ⟩|²',
    beginnerExplanation: 'Observation forces a delicate quantum superposition to collapse into a classical binary 0 or 1 outcome based on probability.',
    example: 'Measuring an equal superposition over 1024 repetitions yields approximately 512 zeros and 512 ones.',
    circuitPreset: { numQubits: 1, gates: [{ gate: 'H', target: 0 }] }
  },
  {
    id: 'hadamard',
    title: 'Hadamard Gate (H)',
    category: 'Gates',
    icon: Cpu,
    formula: 'H = (1/√2) [[1, 1], [1, -1]]',
    beginnerExplanation: 'The primary gateway to quantum computing. It converts definite classical states into 50/50 quantum superpositions.',
    example: 'Applying H to |0⟩ creates equal superposition; applying H a second time returns to |0⟩.',
    circuitPreset: { numQubits: 1, gates: [{ gate: 'H', target: 0 }] }
  },
  {
    id: 'pauli-x',
    title: 'Pauli-X (Quantum NOT)',
    category: 'Gates',
    icon: Binary,
    formula: 'X = [[0, 1], [1, 0]],   X|0⟩ = |1⟩',
    beginnerExplanation: 'The quantum bit-flip gate. It rotates the qubit by 180 degrees around the X-axis of the Bloch sphere, turning |0⟩ into |1⟩.',
    example: 'Used for state preparation, initializing inputs to |1⟩, and conditional quantum logic.',
    circuitPreset: { numQubits: 1, gates: [{ gate: 'X', target: 0 }] }
  },
  {
    id: 'pauli-y',
    title: 'Pauli-Y Gate',
    category: 'Gates',
    icon: Cpu,
    formula: 'Y = [[0, -i], [i, 0]],   Y|0⟩ = i|1⟩',
    beginnerExplanation: 'Combines a bit-flip and a phase-flip with an imaginary unit i. Essential for universal single-qubit rotations.',
    example: 'Constructing arbitrary Hamiltonian dynamics and quantum chemistry simulations.',
    circuitPreset: { numQubits: 1, gates: [{ gate: 'Y', target: 0 }] }
  },
  {
    id: 'pauli-z',
    title: 'Pauli-Z (Phase Flip)',
    category: 'Gates',
    icon: Cpu,
    formula: 'Z = [[1, 0], [0, -1]],   Z|1⟩ = -|1⟩',
    beginnerExplanation: 'Leaves state |0⟩ unchanged but inverts the phase of state |1⟩, introducing a 180-degree phase shift.',
    example: 'Forms the core of quantum phase kickback in Grover search and Deutsch-Jozsa algorithms.',
    circuitPreset: { numQubits: 1, gates: [{ gate: 'H', target: 0 }, { gate: 'Z', target: 0 }] }
  },
  {
    id: 'cnot',
    title: 'Controlled-NOT (CNOT)',
    category: 'Gates',
    icon: Network,
    formula: 'CNOT|c, t⟩ = |c, c ⊕ t⟩',
    beginnerExplanation: 'A two-qubit entangling gate. Flips the target qubit if and only if the control qubit is |1⟩.',
    example: 'Transforms |10⟩ into |11⟩, but leaves |00⟩ unchanged. Generates multi-qubit entanglement.',
    circuitPreset: { numQubits: 2, gates: [{ gate: 'X', target: 0 }, { gate: 'CNOT', control: 0, target: 1 }] }
  },
  {
    id: 'circuit',
    title: 'Quantum Circuit Architecture',
    category: 'Algorithms',
    icon: Layers,
    formula: '|ψ_final⟩ = U_k ... U_2 U_1 |00...0⟩',
    beginnerExplanation: 'A sequence of unitary quantum gates applied to an array of qubits over time steps, culminating in measurement.',
    example: 'Quantum circuits are the quantum equivalent of software code in binary computers.',
    circuitPreset: { numQubits: 3, gates: [{ gate: 'H', target: 0 }, { gate: 'CNOT', control: 0, target: 1 }, { gate: 'CNOT', control: 1, target: 2 }] }
  },
  {
    id: 'algorithm',
    title: 'Quantum Speedup Principle',
    category: 'Algorithms',
    icon: Zap,
    formula: 'O(√N) [Grover] vs O(N) [Classical]',
    beginnerExplanation: 'Uses constructive quantum interference to amplify correct answers while destructive interference cancels wrong ones.',
    example: 'Shor algorithm factors integers exponentially faster; Grover searches unstructured databases quadratically faster.',
    circuitPreset: { numQubits: 2, gates: [{ gate: 'H', target: 0 }, { gate: 'H', target: 1 }, { gate: 'Z', target: 0 }, { gate: 'H', target: 0 }] }
  },
  {
    id: 'qml',
    title: 'Quantum Machine Learning (QML)',
    category: 'QML',
    icon: Atom,
    formula: 'f(x; θ) = ⟨0| U†(x) W†(θ) M W(θ) U(x) |0⟩',
    beginnerExplanation: 'Maps classical patient features into a 16-dimensional quantum Hilbert space to detect subtle non-linear disease correlations.',
    example: 'In our healthcare module, 10 vital patient biomarkers are encoded into a 4-qubit entangled ansatz.',
    circuitPreset: { 
      numQubits: 4, 
      gates: [
        { gate: 'H', target: 0 }, { gate: 'H', target: 1 }, { gate: 'H', target: 2 }, { gate: 'H', target: 3 },
        { gate: 'CNOT', control: 0, target: 1 }, { gate: 'CNOT', control: 2, target: 3 }
      ] 
    }
  }
];

export function QuantumLearningLab({ onTryCircuit }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTopic, setActiveTopic] = useState(TOPICS[0]);

  const categories = ['All', 'Fundamentals', 'Phenomena', 'Gates', 'Algorithms', 'QML'];

  const filteredTopics = selectedCategory === 'All' 
    ? TOPICS 
    : TOPICS.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-medium">
          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
          <span>Interactive Quantum Learning Lab</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Master Quantum Concepts & QML
        </h1>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
          From fundamental qubits to Variational Quantum Classifiers applied to healthcare. Explore interactive concepts with one-click simulator testing.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-teal-500 text-black font-semibold shadow-md shadow-teal-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Topics List */}
        <div className="md:col-span-1 space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
          {filteredTopics.map(topic => {
            const Icon = topic.icon;
            const isSelected = activeTopic.id === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-teal-500/60 shadow-lg shadow-teal-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{topic.title}</h4>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{topic.category}</span>
                  </div>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-400' : 'text-slate-600'}`} />
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Topic Deep-Dive */}
        <div className="md:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                {activeTopic.category}
              </span>
              <h2 className="text-xl font-bold text-white mt-1.5">{activeTopic.title}</h2>
            </div>
            {onTryCircuit && (
              <button
                onClick={() => onTryCircuit(activeTopic.circuitPreset)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 shadow-md shadow-teal-500/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Try in Circuit Lab</span>
              </button>
            )}
          </div>

          {/* Mathematical Formula Box */}
          <div className="p-4 rounded-xl bg-black/50 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Mathematical Representation</span>
            <div className="font-mono text-sm text-teal-300 overflow-x-auto py-1">
              {activeTopic.formula}
            </div>
          </div>

          {/* Beginner-Friendly Explanation */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Intuitive Explanation</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              {activeTopic.beginnerExplanation}
            </p>
          </div>

          {/* Real-World Application / Physical Example */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Physical Realization & Application</h4>
            <div className="flex items-start space-x-2.5 p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>{activeTopic.example}</span>
            </div>
          </div>

          {/* Pre-configured Circuit Info */}
          <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/30 flex items-center justify-between text-xs text-teal-200">
            <span>Preset includes {activeTopic.circuitPreset.numQubits} qubit(s) and {activeTopic.circuitPreset.gates.length} gate(s).</span>
            {onTryCircuit && (
              <button
                onClick={() => onTryCircuit(activeTopic.circuitPreset)}
                className="text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-2 ml-2"
              >
                Launch Simulator →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
