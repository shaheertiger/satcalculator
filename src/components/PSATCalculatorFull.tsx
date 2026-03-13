import { useState, useMemo } from 'react';
import { FileText, Award } from 'lucide-react';

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

  // Selection Index calculation
  const selectionIndex = Math.round((rwClamped / 760 * 38 * 2 + mathClamped / 760 * 38) + 48);
  const clampedIndex = Math.min(228, Math.max(48, selectionIndex));

  // Approximate percentile based on total score
  const total = rwClamped + mathClamped;
  let percentile: number;
  if (total >= 1500) percentile = 99;
  else if (total >= 1400) percentile = 96;
  else if (total >= 1300) percentile = 90;
  else if (total >= 1200) percentile = 81;
  else if (total >= 1100) percentile = 67;
  else if (total >= 1000) percentile = 49;
  else if (total >= 900) percentile = 30;
  else if (total >= 800) percentile = 15;
  else if (total >= 700) percentile = 5;
  else percentile = 1;

  return {
    rw: rwClamped,
    math: mathClamped,
    total,
    selectionIndex: clampedIndex,
    rwRaw,
    mathRaw,
    percentile,
  };
};

const NMSQT_CUTOFFS: { state: string; cutoff: number }[] = [
  { state: 'National Average', cutoff: 212 },
  { state: 'Alabama', cutoff: 208 },
  { state: 'Arizona', cutoff: 211 },
  { state: 'California', cutoff: 217 },
  { state: 'Colorado', cutoff: 213 },
  { state: 'Connecticut', cutoff: 220 },
  { state: 'Florida', cutoff: 214 },
  { state: 'Georgia', cutoff: 215 },
  { state: 'Illinois', cutoff: 215 },
  { state: 'Maryland', cutoff: 219 },
  { state: 'Massachusetts', cutoff: 220 },
  { state: 'Michigan', cutoff: 212 },
  { state: 'Minnesota', cutoff: 214 },
  { state: 'Mississippi', cutoff: 205 },
  { state: 'New Jersey', cutoff: 220 },
  { state: 'New York', cutoff: 217 },
  { state: 'North Carolina', cutoff: 214 },
  { state: 'Ohio', cutoff: 213 },
  { state: 'Oregon', cutoff: 213 },
  { state: 'Pennsylvania', cutoff: 216 },
  { state: 'South Carolina', cutoff: 210 },
  { state: 'Texas', cutoff: 215 },
  { state: 'Virginia', cutoff: 218 },
  { state: 'Washington', cutoff: 217 },
  { state: 'Wisconsin', cutoff: 211 },
  { state: 'Wyoming', cutoff: 203 },
];

const PSATCalculatorFull: React.FC = () => {
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

  const updateScore = (field: keyof PSATScores, max: number, value: string) => {
    setScores(p => ({ ...p, [field]: Math.min(max, Math.max(0, parseInt(value) || 0)) }));
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-5 h-5 text-teal-500" />
        <h3 className="text-lg font-bold text-slate-800 font-heading">PSAT/NMSQT Score Calculator</h3>
      </div>
      <p className="text-sm text-slate-500 mb-4 sm:mb-6">
        Enter the number of correct answers for each module to estimate your PSAT/NMSQT score (320&ndash;1520) and National Merit Selection Index.
      </p>

      {/* Score Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div>
          <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Reading & Writing</label>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-500">Module 1</label>
                <span className="text-xs text-slate-400">{scores.rwM1} / {PSAT_MAX_RW}</span>
              </div>
              <input
                type="range"
                min={0}
                max={PSAT_MAX_RW}
                value={scores.rwM1}
                onChange={e => updateScore('rwM1', PSAT_MAX_RW, e.target.value)}
                className="w-full accent-blue-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-500">Module 2</label>
                <span className="text-xs text-slate-400">{scores.rwM2} / {PSAT_MAX_RW}</span>
              </div>
              <input
                type="range"
                min={0}
                max={PSAT_MAX_RW}
                value={scores.rwM2}
                onChange={e => updateScore('rwM2', PSAT_MAX_RW, e.target.value)}
                className="w-full accent-blue-500"
              />
            </div>
            <div className="text-center bg-blue-50 rounded-lg py-2">
              <span className="text-xs text-blue-600 font-semibold">Raw: {result.rwRaw} / {PSAT_MAX_RW * 2}</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Mathematics</label>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-500">Module 1</label>
                <span className="text-xs text-slate-400">{scores.mathM1} / {PSAT_MAX_MATH}</span>
              </div>
              <input
                type="range"
                min={0}
                max={PSAT_MAX_MATH}
                value={scores.mathM1}
                onChange={e => updateScore('mathM1', PSAT_MAX_MATH, e.target.value)}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-500">Module 2</label>
                <span className="text-xs text-slate-400">{scores.mathM2} / {PSAT_MAX_MATH}</span>
              </div>
              <input
                type="range"
                min={0}
                max={PSAT_MAX_MATH}
                value={scores.mathM2}
                onChange={e => updateScore('mathM2', PSAT_MAX_MATH, e.target.value)}
                className="w-full accent-emerald-500"
              />
            </div>
            <div className="text-center bg-emerald-50 rounded-lg py-2">
              <span className="text-xs text-emerald-600 font-semibold">Raw: {result.mathRaw} / {PSAT_MAX_MATH * 2}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Results */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 sm:p-5 border border-teal-100 mb-4">
        <div className="text-center mb-3">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">Estimated PSAT Score</span>
          <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading mt-1">{result.total}</div>
          <div className="text-sm text-slate-500 mt-1">out of 1520</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center bg-white/60 rounded-lg p-2">
            <div className="text-xs text-blue-600 font-semibold uppercase">R&W</div>
            <div className="text-lg sm:text-xl font-bold text-slate-800">{result.rw}</div>
          </div>
          <div className="text-center bg-white/60 rounded-lg p-2">
            <div className="text-xs text-emerald-600 font-semibold uppercase">Math</div>
            <div className="text-lg sm:text-xl font-bold text-slate-800">{result.math}</div>
          </div>
          <div className="text-center bg-white/60 rounded-lg p-2">
            <div className="text-xs text-purple-600 font-semibold uppercase">Percentile</div>
            <div className="text-lg sm:text-xl font-bold text-slate-800">{result.percentile}th</div>
          </div>
        </div>
      </div>

      {/* National Merit Section */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-slate-700">National Merit Scholarship Eligibility</span>
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
        PSAT/NMSQT scores range from 320&ndash;1520. Selection Index cutoffs are approximate and vary by state each year.
        Official cutoffs are determined by NMSC after scores are released.
      </p>
    </div>
  );
};

export default PSATCalculatorFull;
