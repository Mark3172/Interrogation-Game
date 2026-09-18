'use client';

import { useState, useRef, useEffect } from 'react';
import StressMeter from './StressMeter';
import ConfessionModal from './ConfessionModal';

interface Message {
  role: 'user' | 'suspect';
  content: string;
  timestamp: string;
  mode?: 'gemini' | 'openrouter' | 'demo';
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stressLevel, setStressLevel] = useState(10);
  const [confessed, setConfessed] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [shaking, setShaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading || confessed) return;

    const newUserMessage: Message = { role: 'user', content: text, timestamp: getTimestamp() };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setTurnCount((prev) => prev + 1);

    try {
      const res = await fetch('/api/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();

      // Trigger shake on high stress jumps
      if (data.stress_level > stressLevel + 20) {
        triggerShake();
      }

      const suspectMessage: Message = {
        role: 'suspect',
        content: data.suspect_dialogue,
        timestamp: getTimestamp(),
        mode: data.mode || 'demo',
      };

      setMessages((prev) => [...prev, suspectMessage]);
      setStressLevel(data.stress_level);

      if (data.confessed) {
        setConfessed(true);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'suspect',
        content: '*Static crackles* ... I\'m not saying anything more until my lawyer arrives.',
        timestamp: getTimestamp(),
        mode: 'demo',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full bg-[#07070d] ${shaking ? 'shake' : ''}`}>
      {/* Header */}
      <div className="px-5 py-3.5 bg-[#0a0a14] border-b border-[#1e1e35] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#e74c3c] rec-dot" />
            <span className="text-[10px] font-bold text-[#e74c3c] tracking-[0.2em] uppercase">REC</span>
          </div>
          <div className="w-px h-4 bg-[#1e1e35]" />
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-[#888]">Interrogation Room B</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#444] tracking-wider">TURN</span>
            <span className="text-sm text-white font-mono font-bold">{turnCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#444] tracking-wider">TIME</span>
            <span className="text-[10px] text-[#666] font-mono">{getTimestamp()}</span>
          </div>
        </div>
      </div>

      {/* Stress Meter */}
      <StressMeter level={stressLevel} />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll relative">
        {/* Top fade gradient */}
        <div className="sticky top-0 h-8 bg-gradient-to-b from-[#07070d] to-transparent z-10 pointer-events-none" />

        <div className="px-5 pb-4 space-y-4">
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-[#111122] border border-[#1e1e35] flex items-center justify-center mb-5">
                <svg className="w-9 h-9 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Begin Interrogation</h3>
              <p className="text-[#555] text-sm max-w-sm leading-relaxed">
                Dr. Vance is seated across the table under a single overhead light. The recording device is running.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2ecc71]" />
                <p className="text-[#2ecc71] text-xs font-semibold tracking-wider uppercase">
                  Suspect is ready for questioning
                </p>
              </div>
              <div className="mt-8 space-y-2">
                <p className="text-[10px] text-[#333] uppercase tracking-widest">Suggested openers</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'Where were you last night?',
                    'Tell me about the lab.',
                    'Do you know about the broken window?',
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(suggestion)}
                      className="px-3 py-1.5 rounded-lg bg-[#111122] border border-[#1e1e35] text-xs text-[#666] hover:text-white hover:border-[#2a2a4e] transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'suspect' && (
                <div className="w-8 h-8 rounded-lg bg-[#1e1e35] flex items-center justify-center text-[10px] font-bold text-[#f39c12] mr-2.5 flex-shrink-0 mt-1 border border-[#2a2a4e]">
                  DV
                </div>
              )}
              <div className="max-w-[75%]">
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white rounded-br-sm shadow-[0_2px_16px_rgba(37,99,235,0.2)]'
                      : 'bg-[#111122] text-[#ccc] border border-[#1e1e35] rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
                <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start pl-1'}`}>
                  <span className="text-[10px] text-[#333] font-mono">{msg.timestamp}</span>
                  {msg.role === 'user' && (
                    <span className="text-[10px] text-[#333]">✓</span>
                  )}
                  {msg.role === 'suspect' && msg.mode && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider font-semibold ${
                      msg.mode === 'openrouter'
                        ? 'bg-purple-950/70 text-purple-300 border border-purple-800/50'
                        : msg.mode === 'gemini'
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50'
                        : 'bg-amber-950/70 text-amber-300 border border-amber-800/50'
                    }`}>
                      {msg.mode === 'openrouter' ? '⚡ OpenRouter Live AI' : msg.mode === 'gemini' ? '🤖 Gemini Live AI' : '📝 Scripted Demo'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="w-8 h-8 rounded-lg bg-[#1e1e35] flex items-center justify-center text-[10px] font-bold text-[#f39c12] mr-2.5 flex-shrink-0 border border-[#2a2a4e]">
                DV
              </div>
              <div className="bg-[#111122] border border-[#1e1e35] rounded-2xl rounded-bl-sm px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-[#555] rounded-full typing-dot" />
                  <div className="w-1.5 h-1.5 bg-[#555] rounded-full typing-dot" />
                  <div className="w-1.5 h-1.5 bg-[#555] rounded-full typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#1e1e35] bg-[#0a0a14]">
        {confessed && (
          <div className="mb-3 px-4 py-2.5 rounded-xl bg-[#2ecc71]/5 border border-[#2ecc71]/20 text-center">
            <span className="text-[#2ecc71] text-xs font-bold tracking-wider uppercase">✅ Interrogation Complete — Confession Obtained</span>
          </div>
        )}
        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={confessed ? 'Case closed.' : 'Type your question, detective...'}
            disabled={confessed || isLoading}
            className="flex-1 bg-[#111122] border border-[#1e1e35] rounded-xl px-4 py-3 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#2563eb]/50 focus:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || confessed}
            className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-[0_2px_16px_rgba(37,99,235,0.15)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span className="hidden sm:inline text-sm">Send</span>
          </button>
        </form>
      </div>

      {/* Confession Modal */}
      {confessed && (
        <ConfessionModal turnsTaken={turnCount} onClose={() => {}} />
      )}
    </div>
  );
}
