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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#14141f] border border-[#2a2a3e] rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-in shadow-2xl">
        {/* Confession badge */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#2ecc71]/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#2ecc71]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-1">🎉 Confession Secured!</h2>
        <p className="text-center text-[#888] mb-1">Dr. Vance has cracked under pressure.</p>
        <p className="text-center text-[#f39c12] font-semibold mb-6">
          Solved in {turnsTaken} turn{turnsTaken !== 1 ? 's' : ''}!
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs text-[#888] uppercase tracking-widest mb-2">
                Enter your detective name
              </label>
              <input
                id="name"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Detective..."
                maxLength={30}
                className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#2ecc71] transition-colors"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!playerName.trim() || isSubmitting}
              className="w-full bg-[#2ecc71] hover:bg-[#27ae60] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit to Leaderboard'}
            </button>
          </form>
        ) : (
          <div className="text-center text-[#2ecc71] font-semibold mb-4">
            ✅ Score submitted!
          </div>
        )}

        {/* Leaderboard */}
        <div className="mt-6 pt-6 border-t border-[#2a2a3e]">
          <h3 className="text-xs font-semibold text-[#f39c12] uppercase tracking-widest mb-3 text-center">
            🏆 Top 5 Detectives
          </h3>
          {fetchingLeaderboard ? (
            <p className="text-center text-[#888] text-sm">Loading...</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-center text-[#888] text-sm">No entries yet. Be the first!</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-[#1a1a2e] rounded-lg px-4 py-2.5 border border-[#2a2a3e]"
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-sm ${
                      idx === 0 ? 'text-[#f39c12]' : idx === 1 ? 'text-[#c0c0c0]' : idx === 2 ? 'text-[#cd7f32]' : 'text-[#888]'
                    }`}>
                      #{idx + 1}
                    </span>
                    <span className="text-white text-sm">{entry.player_name}</span>
                  </div>
                  <span className="text-[#2ecc71] text-sm font-mono font-bold">
                    {entry.turns_taken} turn{entry.turns_taken !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Play again */}
        <button
          onClick={() => window.location.reload()}
          className="w-full mt-4 bg-transparent border border-[#2a2a3e] hover:border-[#888] text-[#888] hover:text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
        >
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}
