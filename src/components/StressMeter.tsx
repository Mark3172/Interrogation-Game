'use client';

interface StressMeterProps {
  level: number;
}

export default function StressMeter({ level }: StressMeterProps) {
  const clampedLevel = Math.min(100, Math.max(0, level));

  const getBarColor = () => {
    if (clampedLevel < 25) return 'bg-[#2ecc71]';
    if (clampedLevel < 50) return 'bg-[#f39c12]';
    if (clampedLevel < 75) return 'bg-[#e67e22]';
    return 'bg-[#e74c3c]';
  };

  const getGlowColor = () => {
    if (clampedLevel < 25) return 'shadow-[0_0_12px_rgba(46,204,113,0.3)]';
    if (clampedLevel < 50) return 'shadow-[0_0_12px_rgba(243,156,18,0.3)]';
    if (clampedLevel < 75) return 'shadow-[0_0_12px_rgba(230,126,34,0.3)]';
    return 'shadow-[0_0_16px_rgba(231,76,60,0.4)]';
  };

  const getLabel = () => {
    if (clampedLevel < 15) return 'COMPOSED';
    if (clampedLevel < 30) return 'CALM';
    if (clampedLevel < 45) return 'UNEASY';
    if (clampedLevel < 60) return 'NERVOUS';
    if (clampedLevel < 75) return 'AGITATED';
    if (clampedLevel < 90) return 'DISTRESSED';
    return 'PANICKING';
  };

  const getTextColor = () => {
    if (clampedLevel < 25) return 'text-[#2ecc71]';
    if (clampedLevel < 50) return 'text-[#f39c12]';
    if (clampedLevel < 75) return 'text-[#e67e22]';
    return 'text-[#e74c3c]';
  };

  const getIcon = () => {
    if (clampedLevel < 30) return '🟢';
    if (clampedLevel < 60) return '🟡';
    if (clampedLevel < 80) return '🟠';
    return '🔴';
  };

  return (
    <div className="px-5 py-3 bg-[#0a0a14] border-b border-[#1e1e35]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs">{getIcon()}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#555]">Suspect Stress</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${getTextColor()}`}>
            {getLabel()}
          </span>
          <span className={`text-xs font-mono font-bold ${getTextColor()}`}>
            {clampedLevel}%
          </span>
        </div>
      </div>
      
      {/* Bar */}
      <div className="relative">
        {/* Tick marks */}
        <div className="absolute inset-0 flex justify-between px-[1px] z-10">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-[#0a0a14]/60" />
          ))}
        </div>
        
        <div className={`w-full bg-[#1a1a2e] rounded-sm h-3 overflow-hidden ${clampedLevel >= 70 ? getGlowColor() : ''}`}>
          <div
            className={`h-full rounded-sm transition-all duration-700 ease-out ${getBarColor()} ${
              clampedLevel >= 85 ? 'stress-critical' : clampedLevel >= 70 ? 'stress-high' : ''
            }`}
            style={{ width: `${clampedLevel}%` }}
          />
        </div>
      </div>

      {/* Danger zone markers */}
      <div className="flex justify-between mt-1.5">
        <span className="text-[8px] text-[#333] font-mono">SAFE</span>
        <span className="text-[8px] text-[#333] font-mono">|</span>
        <span className="text-[8px] text-[#333] font-mono">|</span>
        <span className="text-[8px] text-[#333] font-mono">|</span>
        <span className="text-[8px] text-[#e74c3c]/40 font-mono">DANGER</span>
      </div>
    </div>
  );
}
