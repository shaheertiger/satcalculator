import { useState, useEffect } from 'react';
import { History, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export interface ScoreEntry {
  id: string;
  date: string;
  total: number;
  rw: number;
  math: number;
  label?: string;
}

const STORAGE_KEY = 'sat_score_history';

const loadHistory = (): ScoreEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveHistory = (entries: ScoreEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

interface ScoreHistoryProps {
  currentTotal: number;
  currentRW: number;
  currentMath: number;
}

const ScoreHistory: React.FC<ScoreHistoryProps> = ({ currentTotal, currentRW, currentMath }) => {
  const [history, setHistory] = useState<ScoreEntry[]>([]);
  const [label, setLabel] = useState('');

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addEntry = () => {
    const entry: ScoreEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      total: currentTotal,
      rw: currentRW,
      math: currentMath,
      label: label.trim() || undefined,
    };
    const updated = [...history, entry];
    setHistory(updated);
    saveHistory(updated);
    setLabel('');
  };

  const removeEntry = (id: string) => {
    const updated = history.filter(e => e.id !== id);
    setHistory(updated);
    saveHistory(updated);
  };

  const clearAll = () => {
    setHistory([]);
    saveHistory([]);
  };

  const getTrend = () => {
    if (history.length < 2) return null;
    const last = history[history.length - 1].total;
    const prev = history[history.length - 2].total;
    const diff = last - prev;
    if (diff > 0) return { icon: TrendingUp, text: `+${diff} pts`, color: 'text-emerald-600' };
    if (diff < 0) return { icon: TrendingDown, text: `${diff} pts`, color: 'text-red-500' };
    return { icon: Minus, text: 'No change', color: 'text-slate-400' };
  };

  const trend = getTrend();

  const chartData = history.map((e, i) => ({
    name: e.label || `#${i + 1}`,
    total: e.total,
    rw: e.rw,
    math: e.math,
  }));

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-800 font-heading">Score History</h3>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors py-1 px-2"
          >
            Clear all
          </button>
        )}
      </div>

      <p className="text-sm text-slate-500 mb-3 sm:mb-4">
        Save your scores from each practice test to track your progress over time.
      </p>

      {/* Save current score */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Label (e.g. Practice Test 3)"
          className="flex-grow text-sm border border-slate-200 rounded-lg px-3 py-2.5 sm:py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          maxLength={40}
        />
        <button
          onClick={addEntry}
          className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          Save {currentTotal}
        </button>
      </div>

      {/* Trend indicator */}
      {trend && (
        <div className={`flex items-center gap-1.5 text-sm font-medium mb-4 ${trend.color}`}>
          <trend.icon className="w-4 h-4" />
          <span>{trend.text} from last saved score</span>
        </div>
      )}

      {/* Chart */}
      {history.length >= 2 && (
        <div className="h-48 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis domain={[400, 1600]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '13px',
                }}
              />
              <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} name="Total" />
              <Line type="monotone" dataKey="rw" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 3 }} name="R&W" />
              <Line type="monotone" dataKey="math" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 3 }} name="Math" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History table - desktop */}
      {history.length > 0 && (
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-2 pr-2">Date</th>
                <th className="pb-2 pr-2">Label</th>
                <th className="pb-2 pr-2 text-right">R&W</th>
                <th className="pb-2 pr-2 text-right">Math</th>
                <th className="pb-2 pr-2 text-right">Total</th>
                <th className="pb-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {history.map(entry => (
                <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-2 pr-2 text-slate-500">{entry.date}</td>
                  <td className="py-2 pr-2 text-slate-700 font-medium">{entry.label || '-'}</td>
                  <td className="py-2 pr-2 text-right text-blue-600 font-semibold">{entry.rw}</td>
                  <td className="py-2 pr-2 text-right text-emerald-600 font-semibold">{entry.math}</td>
                  <td className="py-2 pr-2 text-right text-slate-800 font-bold">{entry.total}</td>
                  <td className="py-2">
                    <button onClick={() => removeEntry(entry.id)} className="text-slate-300 hover:text-red-400 transition-colors p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* History cards - mobile */}
      {history.length > 0 && (
        <div className="sm:hidden space-y-2">
          {history.map(entry => (
            <div key={entry.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-800">{entry.total}</div>
                <div className="text-xs text-slate-500 truncate">{entry.label || entry.date}</div>
              </div>
              <div className="flex items-center gap-3 ml-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-blue-600">{entry.rw}</div>
                  <div className="text-xs font-semibold text-emerald-600">{entry.math}</div>
                </div>
                <button onClick={() => removeEntry(entry.id)} className="text-slate-300 hover:text-red-400 transition-colors p-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length === 0 && (
        <div className="text-center py-6 text-slate-400 text-sm">
          No scores saved yet. Click "Save" above to start tracking your progress.
        </div>
      )}
    </div>
  );
};

export default ScoreHistory;
