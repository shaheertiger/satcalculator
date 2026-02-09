import { useState, useMemo } from 'react';
import { FileText, ChevronDown, ChevronUp, Award } from 'lucide-react';

// PSAT/NMSQT scoring: 320-1520 total, 160-760 per section
const PSAT_MAX_RW = 27; // per module
const PSAT_MAX_MATH = 22; // per module

interface PSATScores {
  rwM1: number;
  rwM2: number;
  mathM1: number;
  mathM2: number;
}

const calculatePSATScore = (scores: PSATScores) => {
  const rwRaw = scores.rwM1 + scores.rwM2;
  const mathRaw = scores.mathM1 + scores.mathM2;
  const rwMax = PSAT_MAX_RW * 2; // 54
  const mathMax = PSAT_MAX_MATH * 2; // 44

  // PSAT scale: 160-760 per section
  const rwScaled = Math.round((160 + (rwRaw / rwMax) * 600) / 10) * 10;
  const mathScaled = Math.round((160 + (mathRaw / mathMax) * 600) / 10) * 10;

  const rwClamped = Math.min(760, Math.max(160, rwScaled));
  const mathClamped = Math.min(760, Math.max(160, mathScaled));

  // National Merit Selection Index = (RW * 2 + Math) / 3 * (2/10), simplified to:
  // Selection Index = RW_section_score/10*2 + Math_section_score/10, scaled to 48-228
  const selectionIndex = Math.round((rwClamped / 760 * 38 * 2 + mathClamped / 760 * 38) + 48);
  const clampedIndex = Math.min(228, Math.max(48, selectionIndex));

  return {
    rw: rwClamped,
    math: mathClamped,
    total: rwClamped + mathClamped,
    selectionIndex: clampedIndex,
    rwRaw,
    mathRaw,
  };
};

// Approximate NMSQT cutoff ranges by state (simplified)
const NMSQT_CUTOFFS: { state: string; cutoff: number }[] = [
  { state: 'National Average', cutoff: 212 },
  { state: 'California', cutoff: 217 },
  { state: 'New York', cutoff: 217 },
  { state: 'Texas', cutoff: 215 },
  { state: 'Massachusetts', cutoff: 220 },
  { state: 'New Jersey', cutoff: 220 },
  { state: 'Connecticut', cutoff: 220 },
  { state: 'Virginia', cutoff: 218 },
  { state: 'Maryland', cutoff: 219 },
  { state: 'Illinois', cutoff: 215 },
  { state: 'Florida', cutoff: 214 },
  { state: 'Pennsylvania', cutoff: 216 },
  { state: 'Ohio', cutoff: 213 },
  { state: 'Georgia', cutoff: 215 },
  { state: 'North Carolina', cutoff: 214 },
  { state: 'Michigan', cutoff: 212 },
  { state: 'Washington', cutoff: 217 },
  { state: 'Colorado', cutoff: 213 },
  { state: 'Minnesota', cutoff: 214 },
  { state: 'Arizona', cutoff: 211 },
  { state: 'Oregon', cutoff: 213 },
  { state: 'Wisconsin', cutoff: 211 },
  { state: 'South Carolina', cutoff: 210 },
  { state: 'Alabama', cutoff: 208 },
  { state: 'Mississippi', cutoff: 205 },
  { state: 'Wyoming', cutoff: 203 },
];

const PSATCalculator: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scores, setScores] = useState<PSATScores>({
    rwM1: 20,
    rwM2: 18,
    mathM1: 15,
    mathM2: 12,
  });
  const [selectedState, setSelectedState] = useState('National Average');

  const result = useMemo(() => calculatePSATScore(scores), [scores]);

  const stateCutoff = NMSQT_CUTOFFS.find(s => s.state === selectedState)?.cutoff ?? 212;
  const meetsNMSQT = result.selectionIndex >= stateCutoff;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-500" />
          <h3 className="text-lg font-bold text-slate-800 font-heading">PSAT/NMSQT Calculator</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {isExpanded && (
        <div className="mt-4">
          <p className="text-sm text-slate-500 mb-4">
            Estimate your PSAT/NMSQT score (320-1520) and see if you may qualify for National Merit Scholarship consideration.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Reading & Writing</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500 w-16">Module 1</label>
                  <input
                    type="number"
                    min={0}
                    max={PSAT_MAX_RW}
                    value={scores.rwM1}
                    onChange={e => setScores(p => ({ ...p, rwM1: Math.min(PSAT_MAX_RW, Math.max(0, parseInt(e.target.value) || 0)) }))}
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-center"
                  />
                  <span className="text-xs text-slate-400">/ {PSAT_MAX_RW}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500 w-16">Module 2</label>
                  <input
                    type="number"
                    min={0}
                    max={PSAT_MAX_RW}
                    value={scores.rwM2}
                    onChange={e => setScores(p => ({ ...p, rwM2: Math.min(PSAT_MAX_RW, Math.max(0, parseInt(e.target.value) || 0)) }))}
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-center"
                  />
                  <span className="text-xs text-slate-400">/ {PSAT_MAX_RW}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Mathematics</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500 w-16">Module 1</label>
                  <input
                    type="number"
                    min={0}
                    max={PSAT_MAX_MATH}
                    value={scores.mathM1}
                    onChange={e => setScores(p => ({ ...p, mathM1: Math.min(PSAT_MAX_MATH, Math.max(0, parseInt(e.target.value) || 0)) }))}
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-center"
                  />
                  <span className="text-xs text-slate-400">/ {PSAT_MAX_MATH}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500 w-16">Module 2</label>
                  <input
                    type="number"
                    min={0}
                    max={PSAT_MAX_MATH}
                    value={scores.mathM2}
                    onChange={e => setScores(p => ({ ...p, mathM2: Math.min(PSAT_MAX_MATH, Math.max(0, parseInt(e.target.value) || 0)) }))}
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-center"
                  />
                  <span className="text-xs text-slate-400">/ {PSAT_MAX_MATH}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100 mb-4">
            <div className="text-center mb-3">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">Estimated PSAT Score</span>
              <div className="text-4xl font-black text-slate-900 tracking-tight font-heading mt-1">{result.total}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center bg-white/60 rounded-lg p-2">
                <div className="text-xs text-blue-600 font-semibold uppercase">R&W</div>
                <div className="text-lg font-bold text-slate-800">{result.rw}</div>
              </div>
              <div className="text-center bg-white/60 rounded-lg p-2">
                <div className="text-xs text-emerald-600 font-semibold uppercase">Math</div>
                <div className="text-lg font-bold text-slate-800">{result.math}</div>
              </div>
            </div>
          </div>

          {/* National Merit Section */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-slate-700">National Merit Eligibility</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">Your State</label>
                <select
                  value={selectedState}
                  onChange={e => setSelectedState(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  {NMSQT_CUTOFFS.map(s => (
                    <option key={s.state} value={s.state}>{s.state}</option>
                  ))}
                </select>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-xs text-slate-500 mb-1">Selection Index</div>
                <div className="text-2xl font-black text-slate-900 font-heading">{result.selectionIndex}</div>
                <div className="text-xs text-slate-400">Cutoff: ~{stateCutoff}</div>
              </div>
            </div>
            <div className={`text-sm font-medium px-3 py-2 rounded-lg text-center ${
              meetsNMSQT ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}>
              {meetsNMSQT
                ? 'Your Selection Index may meet the semifinalist threshold for your state.'
                : `You need approximately ${stateCutoff - result.selectionIndex} more Selection Index points to reach your state's estimated cutoff.`
              }
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            PSAT/NMSQT scores range from 320-1520. Selection Index cutoffs are approximate and vary by state each year.
            Official cutoffs are determined by NMSC after scores are released.
          </p>
        </div>
      )}
    </div>
  );
};

export default PSATCalculator;
