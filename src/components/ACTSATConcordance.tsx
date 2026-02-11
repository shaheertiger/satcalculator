import { useState, useMemo } from 'react';
import { ArrowLeftRight, ChevronDown, ChevronUp } from 'lucide-react';

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

interface Props {
  defaultDirection?: 'act-to-sat' | 'sat-to-act';
}

const ACTSATConcordance: React.FC<Props> = ({ defaultDirection = 'act-to-sat' }) => {
  const [direction, setDirection] = useState<'act-to-sat' | 'sat-to-act'>(defaultDirection);
  const [actInput, setActInput] = useState(28);
  const [satInput, setSatInput] = useState(1350);
  const [isExpanded, setIsExpanded] = useState(false);

  const actToSat = useMemo(() => {
    const entry = CONCORDANCE_TABLE.find(e => e.act === actInput);
    return entry?.sat ?? null;
  }, [actInput]);

  const satToAct = useMemo(() => {
    // Find the closest ACT score for a given SAT
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

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-violet-500" />
          <h3 className="text-lg font-bold text-slate-800 font-heading">ACT / SAT Concordance</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {isExpanded && (
        <div className="mt-4">
          <p className="text-sm text-slate-500 mb-4">
            Convert between ACT and SAT scores using the official concordance table. Useful for comparing your scores across both tests.
          </p>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setDirection('act-to-sat')}
              className={`flex-1 text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                direction === 'act-to-sat' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ACT → SAT
            </button>
            <button
              onClick={() => setDirection('sat-to-act')}
              className={`flex-1 text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                direction === 'sat-to-act' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              SAT → ACT
            </button>
          </div>

          {direction === 'act-to-sat' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">ACT Composite Score</label>
                <input
                  type="number"
                  min={11}
                  max={36}
                  value={actInput}
                  onChange={e => setActInput(Math.min(36, Math.max(11, parseInt(e.target.value) || 11)))}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                />
              </div>
              <div className="bg-violet-50 rounded-xl p-4 border border-violet-100 text-center">
                <span className="text-xs font-bold text-violet-600 uppercase tracking-wider block mb-1">Equivalent SAT Score</span>
                <div className="text-3xl font-black text-slate-900 font-heading">
                  {actToSat !== null ? actToSat : '—'}
                </div>
                {actToSat !== null && (
                  <span className="text-xs text-slate-500">ACT {actInput} ≈ SAT {actToSat}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">SAT Total Score</label>
                <input
                  type="number"
                  min={400}
                  max={1600}
                  step={10}
                  value={satInput}
                  onChange={e => setSatInput(Math.min(1600, Math.max(400, parseInt(e.target.value) || 400)))}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                />
              </div>
              <div className="bg-violet-50 rounded-xl p-4 border border-violet-100 text-center">
                <span className="text-xs font-bold text-violet-600 uppercase tracking-wider block mb-1">Equivalent ACT Score</span>
                <div className="text-3xl font-black text-slate-900 font-heading">
                  {satToAct}
                </div>
                <span className="text-xs text-slate-500">SAT {satInput} ≈ ACT {satToAct}</span>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            Based on the official College Board / ACT concordance tables. These are approximate equivalences — colleges may interpret scores differently.
          </p>
        </div>
      )}
    </div>
  );
};

export default ACTSATConcordance;
