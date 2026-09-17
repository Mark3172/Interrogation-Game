'use client';

import { useState, useRef, useEffect } from 'react';
import StressMeter from './StressMeter';
import ConfessionModal from './ConfessionModal';

interface Message {
  role: 'user' | 'suspect';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stressLevel, setStressLevel] = useState(10);
  const [confessed, setConfessed] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading || confessed) return;

    const newUserMessage: Message = { role: 'user', content: text };
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
          history: updatedMessages,
        }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();

      const suspectMessage: Message = {
        role: 'suspect',
        content: data.suspect_dialogue,
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
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0f]">
      {/* Header */}
      <div className="px-6 py-4 bg-[#14141f] border-b border-[#2a2a3e] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#e74c3c] animate-pulse" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">Interrogation Room</h2>
          <span className="text-xs text-[#888]">REC</span>
        </div>
        <div className="text-xs text-[#888]">
          Turn: <span className="text-white font-mono">{turnCount}</span>
        </div>
      </div>

      {/* Stress Meter */}
      <StressMeter level={stressLevel} />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll p-6 space-y-4">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-[#2a2a3e] flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Interrogation Ready</h3>
            <p className="text-[#888] text-sm max-w-xs">
              Dr. Vance is seated across the table. Begin your questioning to uncover the truth about the stolen prototype.
            </p>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'suspect' && (
              <div className="w-8 h-8 rounded-full bg-[#2a2a3e] flex items-center justify-center text-xs font-bold text-[#f39c12] mr-2 flex-shrink-0 mt-1">
                DV
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-[#2563eb] text-white rounded-br-md'
                  : 'bg-[#1a1a2e] text-[#e0e0e0] border border-[#2a2a3e] rounded-bl-md'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="w-8 h-8 rounded-full bg-[#2a2a3e] flex items-center justify-center text-xs font-bold text-[#f39c12] mr-2 flex-shrink-0">
              DV
            </div>
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#888] rounded-full typing-dot" />
                <div className="w-2 h-2 bg-[#888] rounded-full typing-dot" />
                <div className="w-2 h-2 bg-[#888] rounded-full typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#2a2a3e] bg-[#14141f]">
        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={confessed ? 'Case closed.' : 'Ask your question, detective...'}
            disabled={confessed || isLoading}
            className="flex-1 bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl px-4 py-3 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#2563eb] transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || confessed}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="hidden sm:inline">Send</span>
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
