'use client';

interface StressMeterProps {
  level: number;
}

export default function StressMeter({ level }: StressMeterProps) {
  const clampedLevel = Math.min(100, Math.max(0, level));

  const getColor = () => {
    if (clampedLevel < 30) return 'bg-[#2ecc71]';
    if (clampedLevel < 60) return 'bg-[#f39c12]';
    return 'bg-[#e74c3c]';
  };

  const getLabel = () => {
    if (clampedLevel < 20) return 'Calm';
    if (clampedLevel < 40) return 'Uneasy';
    if (clampedLevel < 60) return 'Nervous';
    if (clampedLevel < 80) return 'Agitated';
    return 'Panicking';
  };

  const getTextColor = () => {
    if (clampedLevel < 30) return 'text-[#2ecc71]';
    if (clampedLevel < 60) return 'text-[#f39c12]';
    return 'text-[#e74c3c]';
  };

  return (
    <div className="px-4 py-3 bg-[#14141f] border-b border-[#2a2a3e]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#888]">Suspect Stress Level</span>
        </div>
        <span className={`text-xs font-bold uppercase tracking-wider ${getTextColor()}`}>
          {getLabel()}
        </span>
      </div>
      <div className="w-full bg-[#2a2a3e] rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getColor()} ${clampedLevel >= 70 ? 'stress-high' : ''}`}
          style={{ width: `${clampedLevel}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-[#888]">0</span>
        <span className="text-[10px] text-[#888]">{clampedLevel}%</span>
        <span className="text-[10px] text-[#888]">100</span>
      </div>
    </div>
  );
}
