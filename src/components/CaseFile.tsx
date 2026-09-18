'use client';

import { useState } from 'react';

export default function CaseFile() {
  const [activeTab, setActiveTab] = useState<'case' | 'evidence'>('case');

  return (
    <aside className="w-full lg:w-[400px] bg-[#0e0e1a] border-r border-[#1e1e35] flex flex-col h-full overflow-hidden noise">
      {/* Top Bar */}
      <div className="px-5 py-4 border-b border-[#1e1e35] bg-[#0a0a14]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#e74c3c]/10 rounded-lg flex items-center justify-center border border-[#e74c3c]/20">
              <svg className="w-4 h-4 text-[#e74c3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-widest uppercase">Case File</h1>
              <p className="text-[10px] text-[#e74c3c] font-semibold tracking-[0.2em] uppercase">NX-7742 • Classified</p>
            </div>
          </div>
          <div className="px-2 py-1 rounded border border-[#e74c3c]/30 bg-[#e74c3c]/5">
            <span className="text-[9px] font-bold text-[#e74c3c] tracking-widest">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1e1e35]">
        <button
          onClick={() => setActiveTab('case')}
          className={`flex-1 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all ${
            activeTab === 'case'
              ? 'text-[#f39c12] border-b-2 border-[#f39c12] bg-[#f39c12]/5'
              : 'text-[#555] hover:text-[#888]'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex-1 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all ${
            activeTab === 'evidence'
              ? 'text-[#2ecc71] border-b-2 border-[#2ecc71] bg-[#2ecc71]/5'
              : 'text-[#555] hover:text-[#888]'
          }`}
        >
          Evidence
        </button>
      </div>

      <div className="flex-1 overflow-y-auto chat-scroll">
        {activeTab === 'case' ? (
          <div className="p-5 space-y-4">
            {/* Crime Section */}
            <div className="rounded-xl bg-[#111122] border border-[#1e1e35] overflow-hidden">
              <div className="px-4 py-2.5 bg-[#e74c3c]/5 border-b border-[#1e1e35]">
                <span className="text-[10px] font-bold text-[#e74c3c] tracking-[0.15em] uppercase">⚠ Crime Report</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-[#ccc] leading-relaxed">
                  Prototype gadget <span className="text-white font-semibold">&quot;Project Chimera&quot;</span> stolen from the
                  <span className="text-[#f39c12] font-semibold"> locked R&D Lab 7</span> at Nexus Technologies.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] text-[#666]">Reported:</span>
                  <span className="text-[10px] text-[#888] font-mono">2024-11-15 03:42 AM</span>
                </div>
              </div>
            </div>

            {/* Suspect Profile */}
            <div className="rounded-xl bg-[#111122] border border-[#1e1e35] overflow-hidden">
              <div className="px-4 py-2.5 bg-[#f39c12]/5 border-b border-[#1e1e35]">
                <span className="text-[10px] font-bold text-[#f39c12] tracking-[0.15em] uppercase">👤 Suspect Profile</span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#1e1e35] to-[#2a2a4e] flex items-center justify-center border border-[#2a2a4e] flex-shrink-0">
                    <span className="text-xl font-bold text-[#f39c12]">DV</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">Dr. Evelyn Vance</p>
                    <p className="text-xs text-[#888] mt-0.5">Senior Research Scientist</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#f39c12]/10 border border-[#f39c12]/20 text-[9px] font-bold text-[#f39c12] tracking-wider">HIGH PRIORITY</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-[#0e0e1a] rounded-lg p-2.5">
                    <p className="text-[9px] text-[#555] uppercase tracking-wider">Clearance</p>
                    <p className="text-xs text-white font-semibold mt-0.5">Level 4</p>
                  </div>
                  <div className="bg-[#0e0e1a] rounded-lg p-2.5">
                    <p className="text-[9px] text-[#555] uppercase tracking-wider">Department</p>
                    <p className="text-xs text-white font-semibold mt-0.5">R&D Lab 7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Suspect's Alibi */}
            <div className="rounded-xl bg-[#111122] border border-[#1e1e35] overflow-hidden">
              <div className="px-4 py-2.5 bg-[#2563eb]/5 border-b border-[#1e1e35]">
                <span className="text-[10px] font-bold text-[#2563eb] tracking-[0.15em] uppercase">🗣 Suspect&apos;s Alibi</span>
              </div>
              <div className="p-4">
                <div className="border-l-2 border-[#2563eb]/30 pl-3">
                  <p className="text-sm text-[#999] italic leading-relaxed">
                    &ldquo;I was outside having a smoke break when I heard the window shatter. I ran back and saw the mess. That&apos;s all I know.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Evidence 1 */}
            <div className="rounded-xl bg-[#111122] border border-[#1e1e35] overflow-hidden">
              <div className="px-4 py-2.5 bg-[#2ecc71]/5 border-b border-[#1e1e35] flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#2ecc71] tracking-[0.15em] uppercase">Evidence #1</span>
                <span className="text-[9px] text-[#555] font-mono">EV-001</span>
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2ecc71]/10 border border-[#2ecc71]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-lg">🔒</span>
                  </div>
                  <div>
                    <p className="text-sm text-white font-semibold">Biometric Access Control</p>
                    <p className="text-xs text-[#888] mt-1.5 leading-relaxed">
                      The lab door is secured with a <span className="text-[#2ecc71] font-semibold">biometric scanner</span>. Only authorized personnel can enter. Access logs show Dr. Vance entered at <span className="text-white font-mono text-[11px]">02:15 AM</span> and did not badge out.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence 2 — KEY EVIDENCE */}
            <div className="rounded-xl bg-[#111122] border border-[#e74c3c]/30 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#e74c3c]/5 rounded-bl-full" />
              <div className="px-4 py-2.5 bg-[#e74c3c]/5 border-b border-[#e74c3c]/20 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#e74c3c] tracking-[0.15em] uppercase">⚡ Evidence #2 — Critical</span>
                <span className="text-[9px] text-[#555] font-mono">EV-002</span>
              </div>
              <div className="p-4 relative">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#e74c3c]/10 border border-[#e74c3c]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-lg">🪟</span>
                  </div>
                  <div>
                    <p className="text-sm text-white font-semibold">Window Shatter Analysis</p>
                    <p className="text-xs text-[#888] mt-1.5 leading-relaxed">
                      Forensic analysis confirms the lab window was broken from the <span className="text-[#e74c3c] font-bold uppercase">inside</span>. Glass fragments were found on the exterior ground. This contradicts any theory of external entry.
                    </p>
                    <div className="mt-3 px-3 py-2 rounded-lg bg-[#e74c3c]/5 border border-[#e74c3c]/10">
                      <p className="text-[10px] text-[#e74c3c] font-semibold">💡 KEY INSIGHT: If the window broke from inside, someone was IN the lab.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence 3 */}
            <div className="rounded-xl bg-[#111122] border border-[#1e1e35] overflow-hidden">
              <div className="px-4 py-2.5 bg-[#2ecc71]/5 border-b border-[#1e1e35] flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#2ecc71] tracking-[0.15em] uppercase">Evidence #3</span>
                <span className="text-[9px] text-[#555] font-mono">EV-003</span>
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2ecc71]/10 border border-[#2ecc71]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-lg">🚬</span>
                  </div>
                  <div>
                    <p className="text-sm text-white font-semibold">Cigarette Butts</p>
                    <p className="text-xs text-[#888] mt-1.5 leading-relaxed">
                      Fresh cigarette butts found at the designated smoking area. Matches Dr. Vance&apos;s brand. However, <span className="text-[#f39c12] font-semibold">time of disposal is unverified</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#1e1e35] bg-[#0a0a14]">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-[#444] tracking-wider">
            NEXUS PD • HOMICIDE DIV.
          </p>
          <p className="text-[10px] text-[#444] font-mono">
            v2.1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
