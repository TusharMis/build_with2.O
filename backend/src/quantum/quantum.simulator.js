/**
 * Quantum Circuit Simulator for Quantum AI HealthLab
 * Implements exact statevector evolution for n-qubit systems with standard and parameterized gates.
 */

// Complex number helpers
const cNew = (re = 0, im = 0) => ({ re, im });
const cAdd = (a, b) => ({ re: a.re + b.re, im: a.im + b.im });
const cSub = (a, b) => ({ re: a.re - b.re, im: a.im - b.im });
const cMul = (a, b) => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re
});
const cMagSq = (a) => a.re * a.re + a.im * a.im;

export class QuantumCircuitSimulator {
  constructor(numQubits = 2) {
    if (numQubits < 1 || numQubits > 6) {
      throw new Error('Number of qubits must be between 1 and 6 for interactive simulation.');
    }
    this.numQubits = numQubits;
    this.dim = 1 << numQubits; // 2^n
    this.gates = [];
    this.reset();
  }

  /**
   * Resets circuit to ground state |0...0>
   */
  reset() {
    this.state = new Array(this.dim).fill(null).map((_, i) => (i === 0 ? cNew(1, 0) : cNew(0, 0)));
    this.gates = [];
  }

  /**
   * Apply a single qubit gate on a specific qubit
   * @param {Array<Array<{re: number, im: number}>>} u - 2x2 Unitary matrix
   * @param {number} qubit - Target qubit index (0 to n-1)
   */
  _applySingleQubitMatrix(u, qubit) {
    const newState = new Array(this.dim);
    const bit = 1 << qubit;

    for (let i = 0; i < this.dim; i++) {
      if ((i & bit) === 0) {
        const i0 = i;
        const i1 = i | bit;

        const v0 = this.state[i0];
        const v1 = this.state[i1];

        // [u00 u01] [v0]
        // [u10 u11] [v1]
        newState[i0] = cAdd(cMul(u[0][0], v0), cMul(u[0][1], v1));
        newState[i1] = cAdd(cMul(u[1][0], v0), cMul(u[1][1], v1));
      }
    }
    this.state = newState;
  }

  /**
   * Hadamard Gate (H)
   */
  h(qubit) {
    const s = 1 / Math.SQRT2;
    const u = [
      [cNew(s, 0), cNew(s, 0)],
      [cNew(s, 0), cNew(-s, 0)]
    ];
    this._applySingleQubitMatrix(u, qubit);
    this.gates.push({ gate: 'H', target: qubit });
    return this;
  }

  /**
   * Pauli-X (NOT) Gate
   */
  x(qubit) {
    const u = [
      [cNew(0, 0), cNew(1, 0)],
      [cNew(1, 0), cNew(0, 0)]
    ];
    this._applySingleQubitMatrix(u, qubit);
    this.gates.push({ gate: 'X', target: qubit });
    return this;
  }

  /**
   * Pauli-Y Gate
   */
  y(qubit) {
    const u = [
      [cNew(0, 0), cNew(0, -1)],
      [cNew(0, 1), cNew(0, 0)]
    ];
    this._applySingleQubitMatrix(u, qubit);
    this.gates.push({ gate: 'Y', target: qubit });
    return this;
  }

  /**
   * Pauli-Z Gate
   */
  z(qubit) {
    const u = [
      [cNew(1, 0), cNew(0, 0)],
      [cNew(0, 0), cNew(-1, 0)]
    ];
    this._applySingleQubitMatrix(u, qubit);
    this.gates.push({ gate: 'Z', target: qubit });
    return this;
  }

  /**
   * Rotation Y Gate: Ry(theta)
   */
  ry(qubit, theta) {
    const cos = Math.cos(theta / 2);
    const sin = Math.sin(theta / 2);
    const u = [
      [cNew(cos, 0), cNew(-sin, 0)],
      [cNew(sin, 0), cNew(cos, 0)]
    ];
    this._applySingleQubitMatrix(u, qubit);
    this.gates.push({ gate: 'Ry', target: qubit, theta });
    return this;
  }

  /**
   * Rotation Z Gate: Rz(theta)
   */
  rz(qubit, theta) {
    const half = theta / 2;
    const u = [
      [cNew(Math.cos(-half), Math.sin(-half)), cNew(0, 0)],
      [cNew(0, 0), cNew(Math.cos(half), Math.sin(half))]
    ];
    this._applySingleQubitMatrix(u, qubit);
    this.gates.push({ gate: 'Rz', target: qubit, theta });
    return this;
  }

  /**
   * Controlled-NOT (CNOT / CX) Gate
   */
  cnot(control, target) {
    if (control === target) throw new Error('Control and target qubits must differ.');
    const newState = [...this.state];
    const cBit = 1 << control;
    const tBit = 1 << target;

    for (let i = 0; i < this.dim; i++) {
      // If control bit is 1, flip target bit
      if ((i & cBit) !== 0 && (i & tBit) === 0) {
        const flipped = i | tBit;
        const temp = newState[i];
        newState[i] = newState[flipped];
        newState[flipped] = temp;
      }
    }
    this.state = newState;
    this.gates.push({ gate: 'CNOT', control, target });
    return this;
  }

  /**
   * Computes probability distribution over basis states
   */
  getProbabilities() {
    return this.state.map((amp, idx) => {
      const basis = idx.toString(2).padStart(this.numQubits, '0');
      const prob = cMagSq(amp);
      return {
        basisState: `|${basis}⟩`,
        binary: basis,
        probability: Math.round(prob * 10000) / 10000,
        amplitude: {
          re: Math.round(amp.re * 1000) / 1000,
          im: Math.round(amp.im * 1000) / 1000
        }
      };
    });
  }

  /**
   * Simulates shot-based measurements (e.g. 1024 shots)
   */
  measure(shots = 1024) {
    const probs = this.getProbabilities();
    const counts = {};
    probs.forEach(p => counts[p.binary] = 0);

    for (let s = 0; s < shots; s++) {
      const r = Math.random();
      let cum = 0;
      for (const p of probs) {
        cum += p.probability;
        if (r <= cum) {
          counts[p.binary]++;
          break;
        }
      }
    }

    return counts;
  }

  /**
   * Expectation value of Pauli Z on a given qubit: <Z_i>
   */
  expectationZ(qubit = 0) {
    const bit = 1 << qubit;
    let exp = 0;
    for (let i = 0; i < this.dim; i++) {
      const prob = cMagSq(this.state[i]);
      // If bit is 0, eigenvalue is +1; if bit is 1, eigenvalue is -1
      const eigenvalue = (i & bit) === 0 ? 1 : -1;
      exp += eigenvalue * prob;
    }
    return Math.round(exp * 10000) / 10000;
  }

  /**
   * Generates readable ASCII circuit representation
   */
  toAscii() {
    const lines = Array.from({ length: this.numQubits }, (_, i) => `q[${i}]: ──`);
    this.gates.forEach(g => {
      if (g.gate === 'CNOT') {
        lines.forEach((l, q) => {
          if (q === g.control) lines[q] += '──●──';
          else if (q === g.target) lines[q] += '──⊕──';
          else lines[q] += '─────';
        });
      } else {
        lines.forEach((l, q) => {
          if (q === g.target) lines[q] += `──[${g.gate}]──`;
          else lines[q] += '────────';
        });
      }
    });
    return lines.map(l => l + '──[M]').join('\n');
  }
}
