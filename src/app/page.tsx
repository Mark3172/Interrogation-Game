'use client';

import { useState } from 'react';
import CaseFile from '@/components/CaseFile';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [showCaseFile, setShowCaseFile] = useState(false);

  return (
    <main className="flex h-screen relative vignette">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <CaseFile />
      </div>

      {/* Mobile Case File Toggle */}
      <button
        onClick={() => setShowCaseFile(!showCaseFile)}
        className="lg:hidden fixed top-3 left-3 z-40 w-10 h-10 rounded-xl bg-[#0e0e1a] border border-[#1e1e35] flex items-center justify-center text-[#888] hover:text-white transition-colors shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showCaseFile ? 'M6 18L18 6M6 6l12 12' : 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'} />
        </svg>
      </button>

      {/* Mobile Case File Overlay */}
      {showCaseFile && (
        <div className="lg:hidden fixed inset-0 z-30 animate-fade-in">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowCaseFile(false)} />
          <div className="relative h-full w-[85%] max-w-[400px] animate-scale-in">
            <CaseFile />
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <ChatInterface />

      {/* Floating particles — ambient effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${15 + i * 15}%`,
              animationDuration: `${15 + i * 5}s`,
              animationDelay: `${i * 2}s`,
              bottom: '-10px',
            }}
          />
        ))}
      </div>
    </main>
  );
}
