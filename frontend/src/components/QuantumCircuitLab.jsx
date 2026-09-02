import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Cpu, 
  Activity, 
  Sparkles, 
  Layers, 
  BarChart3,
  Info,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';

const AVAILABLE_GATES = [
  { id: 'H', label: 'H', name: 'Hadamard', desc: 'Creates 50/50 Superposition', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30' },
  { id: 'X', label: 'X', name: 'Pauli-X', desc: 'Bit Flip (|0⟩ ↔ |1⟩)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30' },
  { id: 'Y', label: 'Y', name: 'Pauli-Y', desc: 'Bit & Phase Flip', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30' },
  { id: 'Z', label: 'Z', name: 'Pauli-Z', desc: 'Phase Flip (|1⟩ → -|1⟩)', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30' },
  { id: 'CNOT', label: 'CX', name: 'CNOT', desc: 'Controlled-NOT (Entangling)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' }
];

export function QuantumCircuitLab({ initialPreset }) {
  const [numQubits, setNumQubits] = useState(initialPreset?.numQubits || 2);
  const [selectedGate, setSelectedGate] = useState('H');
  const [cnotControl, setCnotControl] = useState(0);
  const [circuitGates, setCircuitGates] = useState(
    initialPreset?.gates || [
      { gate: 'H', target: 0 },
      { gate: 'CNOT', control: 0, target: 1 }
    ]
  );
  const [simulationResult, setSimulationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialPreset) {
      setNumQubits(initialPreset.numQubits || 2);
      setCircuitGates(initialPreset.gates || []);
    }
  }, [initialPreset]);

  // Run simulation on change or mount
  useEffect(() => {
    handleRunCircuit();
  }, [numQubits, circuitGates]);

  const handleRunCircuit = async () => {
    setIsLoading(true);
    try {
      const res = await api.simulateCircuit({ numQubits, gates: circuitGates });
      setSimulationResult(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGate = (targetQubit) => {
    if (selectedGate === 'CNOT') {
      if (cnotControl === targetQubit) {
        alert('Control and target qubits must be different for a CNOT gate.');
        return;
      }
      setCircuitGates(prev => [...prev, { gate: 'CNOT', control: cnotControl, target: targetQubit }]);
    } else {
      setCircuitGates(prev => [...prev, { gate: selectedGate, target: targetQubit }]);
    }
  };

  const handleRemoveGate = (index) => {
    setCircuitGates(prev => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setCircuitGates([]);
  };

  const loadPreset = (presetName) => {
    if (presetName === 'bell') {
      setNumQubits(2);
      setCircuitGates([
        { gate: 'H', target: 0 },
        { gate: 'CNOT', control: 0, target: 1 }
      ]);
    } else if (presetName === 'ghz') {
      setNumQubits(3);
      setCircuitGates([
        { gate: 'H', target: 0 },
        { gate: 'CNOT', control: 0, target: 1 },
        { gate: 'CNOT', control: 1, target: 2 }
      ]);
    } else if (presetName === 'superposition') {
      setNumQubits(numQubits);
      setCircuitGates(Array.from({ length: numQubits }, (_, i) => ({ gate: 'H', target: i })));
    } else if (presetName === 'qml') {
      setNumQubits(4);
      setCircuitGates([
        { gate: 'H', target: 0 }, { gate: 'H', target: 1 }, { gate: 'H', target: 2 }, { gate: 'H', target: 3 },
        { gate: 'CNOT', control: 0, target: 1 }, { gate: 'CNOT', control: 1, target: 2 }, { gate: 'CNOT', control: 2, target: 3 },
        { gate: 'Z', target: 0 }, { gate: 'X', target: 3 }
      ]);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-medium">
          <Cpu className="w-3.5 h-3.5 text-teal-400" />
          <span>Interactive Quantum Circuit Lab</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Visual Quantum Circuit Builder & Simulator
        </h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Add gates, construct entangling operations, and observe real statevector probabilities and shot-based measurements in real time.
        </p>
      </div>

      {/* Control Strip & Presets */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Qubit Selector */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-400 font-medium">Qubits:</span>
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => {
                setNumQubits(n);
                setCircuitGates(prev => prev.filter(g => g.target < n && (g.control === undefined || g.control < n)));
              }}
              className={`w-8 h-8 rounded-lg font-mono font-semibold transition-all ${
                numQubits === n
                  ? 'bg-teal-500 text-black shadow-md shadow-teal-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Preset Circuits */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Presets:</span>
          <button
            onClick={() => loadPreset('bell')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors"
          >
            Bell State (|Φ⁺⟩)
          </button>
          <button
            onClick={() => loadPreset('ghz')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 transition-colors"
          >
            GHZ 3-Qubit
          </button>
          <button
            onClick={() => loadPreset('superposition')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 transition-colors"
          >
            All-H Superposition
          </button>
          <button
            onClick={() => loadPreset('qml')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
          >
            QML Feature Map
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Interactive Circuit Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Circuit Visualizer & Gate Palette */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gate Selection Palette */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              1. Select Gate to Place
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {AVAILABLE_GATES.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGate(g.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center space-x-2 ${
                    selectedGate === g.id
                      ? `${g.color} ring-2 ring-teal-400 shadow-md`
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-sm font-black">{g.label}</span>
                  <span className="text-[10px] font-sans font-normal opacity-80">{g.name}</span>
                </button>
              ))}
            </div>

            {selectedGate === 'CNOT' && numQubits > 1 && (
              <div className="flex items-center space-x-2 pt-2 text-xs text-slate-400">
                <span>Control Qubit:</span>
                <select
                  value={cnotControl}
                  onChange={(e) => setCnotControl(Number(e.target.value))}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-teal-300 font-mono"
                >
                  {Array.from({ length: numQubits }, (_, i) => (
                    <option key={i} value={i}>q[{i}]</option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500">Then click a different qubit wire below as target.</span>
              </div>
            )}
          </div>

          {/* Visual Qubit Wire Grid */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                2. Click Wire to Add [{selectedGate}] Gate
              </span>
              <span className="text-xs font-mono text-slate-400">Total Gates: {circuitGates.length}</span>
            </div>

            {/* Qubit Wires */}
            <div className="space-y-4 py-2">
              {Array.from({ length: numQubits }, (_, qIdx) => (
                <div key={qIdx} className="flex items-center space-x-3">
                  <div className="w-14 text-xs font-mono font-bold text-teal-400 shrink-0">
                    q[{qIdx}]: |0⟩
                  </div>

                  {/* Wire Line with clickable zone */}
                  <div className="relative flex-1 flex items-center h-10 bg-slate-950/70 border border-slate-800 rounded-xl px-4 group hover:border-teal-500/40 transition-colors">
                    <div className="absolute left-0 right-0 h-0.5 bg-slate-700/80 pointer-events-none" />

                    {/* Render Gates on this wire */}
                    <div className="relative z-10 flex items-center space-x-2 overflow-x-auto py-1">
                      {circuitGates.map((g, gIdx) => {
                        const isTarget = g.target === qIdx;
                        const isControl = g.gate === 'CNOT' && g.control === qIdx;
                        if (!isTarget && !isControl) return null;

                        return (
                          <div
                            key={gIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveGate(gIdx);
                            }}
                            title="Click to remove gate"
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-transform hover:scale-105 shadow-md flex items-center space-x-1 ${
                              isControl 
                                ? 'bg-amber-500 text-black'
                                : isTarget && g.gate === 'CNOT'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                            }`}
                          >
                            <span>{isControl ? '● (Ctrl)' : isTarget && g.gate === 'CNOT' ? `⊕ (from q${g.control})` : g.gate}</span>
                            <span className="text-[9px] opacity-60">×</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Gate Button at end of wire */}
                    <button
                      onClick={() => handleAddGate(qIdx)}
                      className="ml-auto relative z-10 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-teal-500/10 hover:bg-teal-500 text-teal-300 hover:text-black border border-teal-500/30 transition-all shrink-0"
                    >
                      + Add Gate
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Circuit ASCII View */}
            {simulationResult?.circuitAscii && (
              <div className="p-3 bg-black/60 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                  ASCII Circuit Architecture
                </span>
                <pre className="font-mono text-xs text-teal-300 whitespace-pre overflow-x-auto">
                  {simulationResult.circuitAscii}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Simulation Output & Measurement Probabilities */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-teal-400" />
                <span>Quantum State Probabilities</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">1024 Shots</span>
            </div>

            {/* Probability Bars */}
            <div className="space-y-3">
              {simulationResult?.probabilities?.map((p, idx) => {
                const percentage = Math.round(p.probability * 100);
                const shotsCount = simulationResult.measurementCounts?.[p.binary] || 0;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-teal-300 font-bold">{p.basisState}</span>
                      <span className="text-slate-400">{shotsCount} shots ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-black/50 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation Note */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-teal-300 font-semibold">
                <Info className="w-3.5 h-3.5" />
                <span>Wavefunction Mechanics:</span>
              </div>
              <p className="leading-relaxed">
                Probabilities reflect the squared amplitude magnitude (|α|²) of each basis state. Shot measurement simulates projective quantum measurement over 1024 repetitions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
