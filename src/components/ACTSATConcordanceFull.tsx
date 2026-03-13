import { useState, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';

// Official College Board / ACT concordance table (2018 revision)
const CONCORDANCE_TABLE: { act: number; sat: number }[] = [
  { act: 36, sat: 1590 },
  { act: 35, sat: 1560 },
  { act: 34, sat: 1530 },
  { act: 33, sat: 1500 },
  { act: 32, sat: 1470 },
  { act: 31, sat: 1440 },
  { act: 30, sat: 1410 },
  { act: 29, sat: 1380 },
  { act: 28, sat: 1350 },
  { act: 27, sat: 1320 },
  { act: 26, sat: 1290 },
  { act: 25, sat: 1260 },
  { act: 24, sat: 1230 },
  { act: 23, sat: 1200 },
  { act: 22, sat: 1170 },
  { act: 21, sat: 1140 },
  { act: 20, sat: 1110 },
  { act: 19, sat: 1080 },
  { act: 18, sat: 1050 },
  { act: 17, sat: 1010 },
  { act: 16, sat: 970 },
  { act: 15, sat: 930 },
  { act: 14, sat: 890 },
  { act: 13, sat: 850 },
  { act: 12, sat: 810 },
  { act: 11, sat: 760 },
];

const getCompetitiveness = (sat: number): { label: string; color: string } => {
  if (sat >= 1530) return { label: 'Elite', color: 'text-purple-700' };
  if (sat >= 1400) return { label: 'Highly Competitive', color: 'text-emerald-700' };
  if (sat >= 1300) return { label: 'Very Competitive', color: 'text-blue-700' };
  if (sat >= 1200) return { label: 'Above Average', color: 'text-teal-700' };
  if (sat >= 1050) return { label: 'Average', color: 'text-amber-700' };
  return { label: 'Below Average', color: 'text-slate-500' };
};

const ACTSATConcordanceFull: React.FC = () => {
  const [direction, setDirection] = useState<'act-to-sat' | 'sat-to-act'>('sat-to-act');
  const [actInput, setActInput] = useState(28);
  const [satInput, setSatInput] = useState(1350);

  const actToSat = useMemo(() => {
    const entry = CONCORDANCE_TABLE.find(e => e.act === actInput);
    return entry?.sat ?? null;
  }, [actInput]);

  const satToAct = useMemo(() => {
    let closest = CONCORDANCE_TABLE[0];
    let minDiff = Math.abs(CONCORDANCE_TABLE[0].sat - satInput);
    for (const entry of CONCORDANCE_TABLE) {
      const diff = Math.abs(entry.sat - satInput);
      if (diff < minDiff) {
        closest = entry;
        minDiff = diff;
      }
    }
    return closest.act;
  }, [satInput]);

  const resultSat = direction === 'act-to-sat' ? actToSat : satInput;
  const resultAct = direction === 'act-to-sat' ? actInput : satToAct;
  const comp = resultSat ? getCompetitiveness(resultSat) : null;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <ArrowLeftRight className="w-5 h-5 text-violet-500" />
        <h3 className="text-lg font-bold text-slate-800 font-heading">SAT &harr; ACT Score Converter</h3>
      </div>
      <p className="text-sm text-slate-500 mb-4 sm:mb-6">
        Convert between SAT and ACT scores using the official concordance table from the College Board and ACT, Inc. Enter a score on either scale to see its equivalent.
      </p>

      {/* Direction Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setDirection('sat-to-act')}
          className={`flex-1 text-sm font-medium py-2.5 px-3 rounded-lg transition-colors ${
            direction === 'sat-to-act' ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          SAT &rarr; ACT
        </button>
        <button
          onClick={() => setDirection('act-to-sat')}
          className={`flex-1 text-sm font-medium py-2.5 px-3 rounded-lg transition-colors ${
            direction === 'act-to-sat' ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          ACT &rarr; SAT
        </button>
      </div>

      {/* Input */}
      {direction === 'sat-to-act' ? (
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">SAT Total Score</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={400}
              max={1600}
              step={10}
              value={satInput}
              onChange={e => setSatInput(parseInt(e.target.value))}
              className="flex-1 accent-violet-500"
            />
            <input
              type="number"
              min={400}
              max={1600}
              step={10}
              value={satInput}
              onChange={e => setSatInput(Math.min(1600, Math.max(400, parseInt(e.target.value) || 400)))}
              className="w-24 text-sm font-bold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-center outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            />
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">ACT Composite Score</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={11}
              max={36}
              step={1}
              value={actInput}
              onChange={e => setActInput(parseInt(e.target.value))}
              className="flex-1 accent-violet-500"
            />
            <input
              type="number"
              min={11}
              max={36}
              value={actInput}
              onChange={e => setActInput(Math.min(36, Math.max(11, parseInt(e.target.value) || 11)))}
              className="w-24 text-sm font-bold text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-center outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            />
          </div>
        </div>
      )}

      {/* Result */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 sm:p-5 border border-violet-100 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">SAT Score</span>
            <div className={`text-3xl sm:text-4xl font-black tracking-tight font-heading ${
              direction === 'sat-to-act' ? 'text-slate-400' : 'text-slate-900'
            }`}>
              {resultSat ?? '—'}
            </div>
            <span className="text-xs text-slate-400">out of 1600</span>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest block mb-1">ACT Score</span>
            <div className={`text-3xl sm:text-4xl font-black tracking-tight font-heading ${
              direction === 'act-to-sat' ? 'text-slate-400' : 'text-slate-900'
            }`}>
              {resultAct}
            </div>
            <span className="text-xs text-slate-400">out of 36</span>
          </div>
        </div>
        {comp && (
          <div className="text-center mt-3 pt-3 border-t border-violet-100">
            <span className={`text-sm font-semibold ${comp.color}`}>{comp.label}</span>
          </div>
        )}
      </div>

      {/* Quick Reference */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Quick Reference</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          {CONCORDANCE_TABLE.filter((_, i) => i % 2 === 0).map(entry => (
            <div key={entry.act} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
              <span className="text-slate-600">SAT <span className="font-semibold text-slate-800">{entry.sat}</span></span>
              <span className="text-slate-400">=</span>
              <span className="text-slate-600">ACT <span className="font-semibold text-violet-700">{entry.act}</span></span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        Based on the official College Board / ACT concordance tables (2018). These are approximate equivalences &mdash; individual college policies may vary.
      </p>
    </div>
  );
};

export default ACTSATConcordanceFull;
