import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Atom, 
  CheckCircle2, 
  BookOpen, 
  Cpu, 
  Loader2,
  Info
} from 'lucide-react';
import { api } from '../services/api';

const QUICK_QUESTIONS = [
  'What is superposition?',
  'What is a qubit?',
  'Explain CNOT gate',
  'Why is QML useful in healthcare?',
  'Difference between ML and QML',
  'What is quantum entanglement?'
];

export function AIQuantumTutor() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'tutor',
      text: 'Greetings! I am your AI Quantum Tutor. Ask me anything about qubits, superposition, entanglement, quantum gates, or Quantum Machine Learning algorithms applied to healthcare.',
      keyTakeaways: [
        'Ask conceptual questions like "What is superposition?"',
        'Explore gate mechanics like Hadamard, Pauli, and CNOT',
        'Discover how QML variational classifiers analyze patient disease risk'
      ],
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend || textToSend.trim() === '') return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.sendAgentChat({
        message: textToSend,
        selectedToolId: 'quantum_explain'
      });

      if (response.isSuccess && response.data?.result?.data) {
        const d = response.data.result.data;
        const tutorMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'tutor',
          text: d.answer || d.summary,
          keyTakeaways: d.keyTakeaways || [],
          details: d.details,
          modelUsed: d.modelUsed || 'AI Quantum Tutor',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, tutorMsg]);
      } else {
        const errorMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'tutor',
          text: response.data?.error || 'Unable to process query. Please try again.',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (err) {
      console.error('Tutor chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'tutor',
          text: 'Connection error while contacting AI Quantum Tutor. Please check backend status.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-medium">
          <Atom className="w-3.5 h-3.5 text-teal-400" />
          <span>Intelligent Quantum Tutor</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AI Quantum Tutor
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
          Understand quantum physics, circuit mechanics, and Quantum Machine Learning in simple, intuitive language.
        </p>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-800 hover:border-teal-500/50 text-slate-300 hover:text-teal-300 transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Window */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 min-h-[450px] max-h-[600px] overflow-y-auto">
        {messages.map(m => {
          const isTutor = m.sender === 'tutor';
          return (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${isTutor ? '' : 'flex-row-reverse space-x-reverse'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isTutor ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-slate-700 text-white'
              }`}>
                {isTutor ? <Atom className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm space-y-3 leading-relaxed ${
                isTutor 
                  ? 'bg-slate-800/80 border border-slate-700/80 text-slate-100 shadow-md' 
                  : 'bg-teal-500 text-black font-medium'
              }`}>
                <p>{m.text}</p>

                {m.keyTakeaways && m.keyTakeaways.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-700/60">
                    <span className="text-[11px] font-semibold text-teal-300 uppercase tracking-wider block">
                      Core Concepts:
                    </span>
                    <ul className="space-y-1.5">
                      {m.keyTakeaways.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start space-x-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {m.modelUsed && (
                  <span className="text-[10px] font-mono text-slate-400 block pt-1">
                    Provided by {m.modelUsed}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-teal-400 py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI Quantum Tutor is formulating explanation...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question (e.g. 'What is quantum superposition?')..."
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-black font-semibold text-xs transition-all flex items-center space-x-1.5 shadow-md shadow-teal-500/20"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
