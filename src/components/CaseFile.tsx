'use client';

export default function CaseFile() {
  return (
    <aside className="w-full lg:w-[380px] bg-[#14141f] border-r border-[#2a2a3e] flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-[#2a2a3e]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#e74c3c]/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-[#e74c3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">CASE FILE</h1>
            <p className="text-xs text-[#888] uppercase tracking-widest">Classified</p>
          </div>
        </div>
      </div>

      {/* Crime */}
      <div className="p-6 border-b border-[#2a2a3e]">
        <h2 className="text-xs font-semibold text-[#e74c3c] uppercase tracking-widest mb-3">Crime</h2>
        <p className="text-sm text-[#e0e0e0] leading-relaxed">
          Prototype gadget stolen from a locked lab at Nexus Technologies R&D facility.
        </p>
      </div>

      {/* Suspect */}
      <div className="p-6 border-b border-[#2a2a3e]">
        <h2 className="text-xs font-semibold text-[#f39c12] uppercase tracking-widest mb-3">Suspect</h2>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#2a2a3e] flex items-center justify-center text-lg font-bold text-[#f39c12]">
            DV
          </div>
          <div>
            <p className="text-white font-semibold">Dr. Evelyn Vance</p>
            <p className="text-xs text-[#888]">Senior Research Scientist</p>
          </div>
        </div>
      </div>

      {/* Key Facts */}
      <div className="p-6 flex-1">
        <h2 className="text-xs font-semibold text-[#2ecc71] uppercase tracking-widest mb-4">Key Evidence</h2>
        <div className="space-y-3">
          <div className="bg-[#1a1a2e] rounded-lg p-4 border border-[#2a2a3e]">
            <div className="flex items-start gap-3">
              <span className="text-[#2ecc71] font-bold text-sm mt-0.5">01</span>
              <div>
                <p className="text-sm text-[#e0e0e0] font-medium">Biometric Access</p>
                <p className="text-xs text-[#888] mt-1">The lab door requires a biometric scan to enter. Only authorized personnel can access the room.</p>
              </div>
            </div>
          </div>
          <div className="bg-[#1a1a2e] rounded-lg p-4 border border-[#2a2a3e]">
            <div className="flex items-start gap-3">
              <span className="text-[#2ecc71] font-bold text-sm mt-0.5">02</span>
              <div>
                <p className="text-sm text-[#e0e0e0] font-medium">Broken Window</p>
                <p className="text-xs text-[#888] mt-1">The lab window was found broken. Glass shatter pattern indicates it was broken from the <span className="text-[#e74c3c] font-semibold">inside</span>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer tip */}
      <div className="p-4 border-t border-[#2a2a3e]">
        <p className="text-xs text-[#888] text-center italic">
          💡 Use the evidence to find contradictions in the suspect&apos;s story.
        </p>
      </div>
    </aside>
  );
}
