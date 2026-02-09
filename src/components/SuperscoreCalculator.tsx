import { useState } from 'react';
import { Trophy, Plus, X } from 'lucide-react';

interface TestAttempt {
  id: string;
  label: string;
  rw: number;
  math: number;
}

const SuperscoreCalculator: React.FC = () => {
  const [attempts, setAttempts] = useState<TestAttempt[]>([
    { id: '1', label: 'Attempt 1', rw: 600, math: 580 },
    { id: '2', label: 'Attempt 2', rw: 570, math: 620 },
  ]);

  const addAttempt = () => {
    setAttempts(prev => [
      ...prev,
      { id: Date.now().toString(), label: `Attempt ${prev.length + 1}`, rw: 500, math: 500 },
    ]);
  };

  const removeAttempt = (id: string) => {
    if (attempts.length <= 2) return;
    setAttempts(prev => prev.filter(a => a.id !== id));
  };

  const updateAttempt = (id: string, field: 'rw' | 'math', value: number) => {
    const clamped = Math.min(800, Math.max(200, Math.round(value / 10) * 10));
    setAttempts(prev => prev.map(a => a.id === id ? { ...a, [field]: clamped } : a));
  };

  const updateLabel = (id: string, value: string) => {
    setAttempts(prev => prev.map(a => a.id === id ? { ...a, label: value } : a));
  };

  const bestRW = Math.max(...attempts.map(a => a.rw));
  const bestMath = Math.max(...attempts.map(a => a.math));
  const superscore = bestRW + bestMath;
  const bestSingleTotal = Math.max(...attempts.map(a => a.rw + a.math));
  const improvement = superscore - bestSingleTotal;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-slate-800 font-heading">Superscore Calculator</h3>
      </div>
      <p className="text-sm text-slate-500 mb-4 sm:mb-6">
        Many colleges accept your <strong>superscore</strong> &mdash; the combination of your highest section scores from different test dates.
        Enter your section scores from each attempt below.
      </p>

      {/* Attempts */}
      <div className="space-y-3 mb-4">
        {attempts.map((attempt) => (
          <div key={attempt.id} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            {/* Desktop: single row */}
            <div className="hidden sm:flex items-center gap-3">
              <input
                type="text"
                value={attempt.label}
                onChange={e => updateLabel(attempt.id, e.target.value)}
                className="w-28 text-sm font-medium bg-transparent border-none outline-none text-slate-700 truncate"
                maxLength={20}
              />
              <div className="flex-1 flex items-center gap-2">
                <label className="text-xs text-blue-500 font-semibold whitespace-nowrap">R&W</label>
                <input
                  type="number"
                  min={200}
                  max={800}
                  step={10}
                  value={attempt.rw}
                  onChange={e => updateAttempt(attempt.id, 'rw', parseInt(e.target.value) || 200)}
                  className="w-20 text-sm font-bold text-slate-800 border border-slate-200 rounded-lg px-2 py-1.5 text-center outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div className="flex-1 flex items-center gap-2">
                <label className="text-xs text-emerald-500 font-semibold whitespace-nowrap">Math</label>
                <input
                  type="number"
                  min={200}
                  max={800}
                  step={10}
                  value={attempt.math}
                  onChange={e => updateAttempt(attempt.id, 'math', parseInt(e.target.value) || 200)}
                  className="w-20 text-sm font-bold text-slate-800 border border-slate-200 rounded-lg px-2 py-1.5 text-center outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
              <div className="text-sm font-bold text-slate-400 w-12 text-right">
                {attempt.rw + attempt.math}
              </div>
              {attempts.length > 2 && (
                <button onClick={() => removeAttempt(attempt.id)} className="text-slate-300 hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {/* Mobile: stacked layout */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  value={attempt.label}
                  onChange={e => updateLabel(attempt.id, e.target.value)}
                  className="text-sm font-medium bg-transparent border-none outline-none text-slate-700 flex-1 min-w-0"
                  maxLength={20}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-500">{attempt.rw + attempt.math}</span>
                  {attempts.length > 2 && (
                    <button onClick={() => removeAttempt(attempt.id)} className="text-slate-300 hover:text-red-400 transition-colors p-1">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2">
                  <label className="text-xs text-blue-500 font-semibold">R&W</label>
                  <input
                    type="number"
                    min={200}
                    max={800}
                    step={10}
                    value={attempt.rw}
                    onChange={e => updateAttempt(attempt.id, 'rw', parseInt(e.target.value) || 200)}
                    className="w-full text-sm font-bold text-slate-800 border border-slate-200 rounded-lg px-2 py-2 text-center outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <label className="text-xs text-emerald-500 font-semibold">Math</label>
                  <input
                    type="number"
                    min={200}
                    max={800}
                    step={10}
                    value={attempt.math}
                    onChange={e => updateAttempt(attempt.id, 'math', parseInt(e.target.value) || 200)}
                    className="w-full text-sm font-bold text-slate-800 border border-slate-200 rounded-lg px-2 py-2 text-center outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addAttempt}
        className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors mb-6"
      >
        <Plus className="w-4 h-4" />
        Add another attempt
      </button>

      {/* Result */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 sm:p-5 border border-amber-100">
        <div className="text-center mb-3">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Your Superscore</span>
          <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading mt-1">{superscore}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="text-center">
            <div className="text-xs text-blue-600 font-semibold uppercase">Best R&W</div>
            <div className="text-lg sm:text-xl font-bold text-slate-800">{bestRW}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-emerald-600 font-semibold uppercase">Best Math</div>
            <div className="text-lg sm:text-xl font-bold text-slate-800">{bestMath}</div>
          </div>
        </div>
        {improvement > 0 && (
          <div className="text-center text-sm text-amber-700 font-medium">
            Superscoring gives you <strong>+{improvement} points</strong> over your best single sitting ({bestSingleTotal}).
          </div>
        )}
        {improvement === 0 && (
          <div className="text-center text-sm text-slate-500">
            Your best single sitting already matches your superscore.
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperscoreCalculator;
