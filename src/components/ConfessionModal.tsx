'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  player_name: string;
  turns_taken: number;
  created_at: string;
}

interface ConfessionModalProps {
  turnsTaken: number;
  onClose: () => void;
}

export default function ConfessionModal({ turnsTaken, onClose }: ConfessionModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchingLeaderboard, setFetchingLeaderboard] = useState(false);
  const [showStamp, setShowStamp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowStamp(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const fetchLeaderboard = async () => {
    setFetchingLeaderboard(true);
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setFetchingLeaderboard(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_name: playerName.trim(),
          turns_taken: turnsTaken,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        await fetchLeaderboard();
      }
    } catch (err) {
      console.error('Failed to submit score:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getMedal = (idx: number) => {
    if (idx === 0) return '🥇';
    if (idx === 1) return '🥈';
    if (idx === 2) return '🥉';
    return `#${idx + 1}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#0e0e1a] border border-[#1e1e35] rounded-2xl max-w-lg w-full mx-4 animate-scale-in shadow-[0_0_80px_rgba(46,204,113,0.1)] overflow-hidden">
        {/* Top accent line */}
        <div className="h-1 bg-gradient-to-r from-[#2ecc71] via-[#f39c12] to-[#2ecc71]" />

        <div className="p-8">
          {/* Case Closed Stamp */}
          <div className="relative flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-[#2ecc71]/10 border-2 border-[#2ecc71]/30 flex items-center justify-center">
              <svg className="w-12 h-12 text-[#2ecc71]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {showStamp && (
              <div className="absolute -top-2 -right-2 stamp-in">
                <div className="px-3 py-1.5 rounded border-2 border-[#e74c3c] bg-[#e74c3c]/10">
                  <span className="text-[#e74c3c] font-black text-xs tracking-[0.2em]">CASE CLOSED</span>
                </div>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-black text-center text-white mb-1 tracking-wide">
            Confession Secured
          </h2>
          <p className="text-center text-[#666] mb-1 text-sm">Dr. Vance has cracked under interrogation.</p>
          <div className="flex justify-center mb-6">
            <div className="px-4 py-1.5 rounded-full bg-[#f39c12]/10 border border-[#f39c12]/30">
              <span className="text-[#f39c12] font-bold text-sm">
                Solved in {turnsTaken} turn{turnsTaken !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-[10px] text-[#555] uppercase tracking-[0.15em] font-bold mb-2">
                  Enter your detective name
                </label>
                <input
                  id="name"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Detective..."
                  maxLength={30}
                  className="w-full bg-[#111122] border border-[#1e1e35] rounded-xl px-4 py-3.5 text-white placeholder-[#333] focus:outline-none focus:border-[#2ecc71]/50 focus:shadow-[0_0_20px_rgba(46,204,113,0.1)] transition-all text-sm"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!playerName.trim() || isSubmitting}
                className="w-full bg-gradient-to-r from-[#2ecc71] to-[#27ae60] hover:from-[#27ae60] hover:to-[#229954] disabled:opacity-40 disabled:cursor-not-allowed text-black font-black py-3.5 rounded-xl transition-all text-sm tracking-wide uppercase shadow-[0_0_20px_rgba(46,204,113,0.2)]"
              >
                {isSubmitting ? 'Submitting...' : '🏆 Submit to Leaderboard'}
              </button>
            </form>
          ) : (
            <div className="text-center py-3 px-4 rounded-xl bg-[#2ecc71]/10 border border-[#2ecc71]/20">
              <p className="text-[#2ecc71] font-bold">✅ Score recorded, detective!</p>
            </div>
          )}

          {/* Leaderboard */}
          <div className="mt-6 pt-6 border-t border-[#1e1e35]">
            <h3 className="text-[10px] font-bold text-[#f39c12] uppercase tracking-[0.15em] mb-4 text-center">
              🏆 Top 5 Detectives
            </h3>
            {fetchingLeaderboard ? (
              <div className="flex justify-center py-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#555] rounded-full typing-dot" />
                  <div className="w-2 h-2 bg-[#555] rounded-full typing-dot" />
                  <div className="w-2 h-2 bg-[#555] rounded-full typing-dot" />
                </div>
              </div>
            ) : leaderboard.length === 0 ? (
              <p className="text-center text-[#444] text-sm py-2">No entries yet. Be the first!</p>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 border transition-all ${
                      idx === 0
                        ? 'bg-[#f39c12]/5 border-[#f39c12]/20'
                        : 'bg-[#111122] border-[#1e1e35]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base w-8">{getMedal(idx)}</span>
                      <span className="text-white text-sm font-semibold">{entry.player_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#2ecc71] text-sm font-mono font-bold">{entry.turns_taken}</span>
                      <span className="text-[#444] text-xs">turns</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Play again */}
          <button
            onClick={() => window.location.reload()}
            className="w-full mt-5 bg-transparent border border-[#1e1e35] hover:border-[#555] hover:bg-[#111122] text-[#555] hover:text-white font-bold py-3 rounded-xl transition-all text-xs tracking-widest uppercase"
          >
            🔄 New Interrogation
          </button>
        </div>
      </div>
    </div>
  );
}
