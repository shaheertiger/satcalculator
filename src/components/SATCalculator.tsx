import { useState, useMemo } from 'react';
import { ModuleDifficulty } from '../types';
import type { SATState } from '../types';
import { PRACTICE_TESTS, MAX_QUESTIONS } from '../constants';
import { getFullScore } from '../utils/scoring';
import ModuleInput from './ModuleInput';
import ScoreHistory from './ScoreHistory';
import SuperscoreCalculator from './SuperscoreCalculator';
import CollegeMatch from './CollegeMatch';
import {
  Calculator,
  BookOpen,
  HelpCircle,
  Target,
  BarChart3,
  BrainCircuit,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from 'recharts';

const SATCalculator: React.FC = () => {
  const [state, setState] = useState<SATState>({
    rwM1: 20,
    rwM2: 18,
    mathM1: 15,
    mathM2: 12,
    rwDifficulty: ModuleDifficulty.UNKNOWN,
    mathDifficulty: ModuleDifficulty.UNKNOWN,
    practiceTest: 0
  });

  const finalScore = useMemo(() => getFullScore(state), [state]);

  const chartData = useMemo(() => {
    const data = [];
    for (let i = 400; i <= 1600; i += 20) {
      const mean = 1050;
      const stdDev = 200;
      const val = Math.exp(-0.5 * Math.pow((i - mean) / stdDev, 2));
      data.push({ score: i, density: val });
    }
    return data;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Controls */}
      <div className="lg:col-span-5 space-y-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-800 font-heading">Input Raw Scores</h2>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-end mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <h3 className="font-semibold text-slate-700 font-heading">Reading & Writing</h3>
                </div>
                <select
                  value={state.rwDifficulty}
                  onChange={(e) => setState(prev => ({ ...prev, rwDifficulty: e.target.value as ModuleDifficulty }))}
                  className="text-xs font-medium border-slate-200 rounded p-1 outline-none text-slate-500 bg-slate-50"
                >
                  <option value={ModuleDifficulty.UNKNOWN}>Auto-Detect Diff</option>
                  <option value={ModuleDifficulty.HARD}>Hard Module 2</option>
                  <option value={ModuleDifficulty.EASY}>Easy Module 2</option>
                </select>
              </div>
              <div className="space-y-4">
                <ModuleInput
                  label="Module 1"
                  value={state.rwM1}
                  max={MAX_QUESTIONS.RW_MODULE}
                  onChange={(val) => setState(p => ({ ...p, rwM1: val }))}
                  color="blue"
                />
                <ModuleInput
                  label="Module 2"
                  value={state.rwM2}
                  max={MAX_QUESTIONS.RW_MODULE}
                  onChange={(val) => setState(p => ({ ...p, rwM2: val }))}
                  color="blue"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-semibold text-slate-700 font-heading">Mathematics</h3>
                </div>
                <select
                  value={state.mathDifficulty}
                  onChange={(e) => setState(prev => ({ ...prev, mathDifficulty: e.target.value as ModuleDifficulty }))}
                  className="text-xs font-medium border-slate-200 rounded p-1 outline-none text-slate-500 bg-slate-50"
                >
                  <option value={ModuleDifficulty.UNKNOWN}>Auto-Detect Diff</option>
                  <option value={ModuleDifficulty.HARD}>Hard Module 2</option>
                  <option value={ModuleDifficulty.EASY}>Easy Module 2</option>
                </select>
              </div>
              <div className="space-y-4">
                <ModuleInput
                  label="Module 1"
                  value={state.mathM1}
                  max={MAX_QUESTIONS.MATH_MODULE}
                  onChange={(val) => setState(p => ({ ...p, mathM1: val }))}
                  color="emerald"
                />
                <ModuleInput
                  label="Module 2"
                  value={state.mathM2}
                  max={MAX_QUESTIONS.MATH_MODULE}
                  onChange={(val) => setState(p => ({ ...p, mathM2: val }))}
                  color="emerald"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-600 mb-2">Select Curve Baseline</label>
              <select
                value={state.practiceTest}
                onChange={(e) => setState(prev => ({ ...prev, practiceTest: parseInt(e.target.value) }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                {PRACTICE_TESTS.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className="bg-slate-800 p-6 rounded-2xl text-white">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            <h4 className="font-bold font-heading">Pro Tip: IRT Matters</h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            The Digital SAT uses Item Response Theory. This means getting harder questions wrong hurts your score less than missing easy ones. Our calculator estimates the curve based on the latest Bluebook data.
          </p>
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="lg:col-span-7 space-y-6">
        <section className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <button className="text-slate-400 hover:text-indigo-600 transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mb-8">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-2 block">Estimated Total Score</span>
            <div className="text-7xl font-black text-slate-900 tracking-tight mb-2 font-heading" aria-live="polite">
              {finalScore.total}
            </div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full text-indigo-700 text-sm font-semibold">
              <span>Range: {finalScore.totalRange[0]} - {finalScore.totalRange[1]}</span>
              <div className="w-1 h-1 bg-indigo-300 rounded-full"></div>
              <span>Percentile: ~{(finalScore.rw.percentile + finalScore.math.percentile) / 2}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-blue-800 uppercase">Reading & Writing</span>
                <BarChart3 className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{finalScore.rw.scaled}</div>
              <div className="text-xs text-blue-600 font-medium">Confidence: {finalScore.rw.range[0]}-{finalScore.rw.range[1]}</div>
            </div>
            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-emerald-800 uppercase">Mathematics</span>
                <BarChart3 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{finalScore.math.scaled}</div>
              <div className="text-xs text-emerald-600 font-medium">Confidence: {finalScore.math.range[0]}-{finalScore.math.range[1]}</div>
            </div>
          </div>

          {/* Chart Visualizer */}
          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="score" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={() => ['', 'Population Density']}
                />
                <Area
                  type="monotone"
                  dataKey="density"
                  stroke="#4f46e5"
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
                <ReferenceLine x={finalScore.total} stroke="#ef4444" strokeWidth={2} label={{ position: 'top', value: 'You', fill: '#ef4444', fontSize: 12, fontWeight: 700 }} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-2 mt-2">
              <span>400</span>
              <span>600</span>
              <span>800</span>
              <span>1000 (Avg)</span>
              <span>1200</span>
              <span>1400</span>
              <span>1600</span>
            </div>
          </div>
        </section>

        {/* Educational Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 font-heading">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Why calculators are "just estimates"
          </h3>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              Since the SAT went digital in 2023, the scoring algorithm has become <strong>multistage adaptive</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-1 font-heading">Easy vs. Hard M2</h4>
                <p>If you don't perform well in Module 1, you are routed to an easier Module 2, which effectively caps your maximum possible score around 600-650.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-1 font-heading">Point Weights</h4>
                <p>Two students with 10 wrong answers can have scores that differ by 50+ points depending on which specific questions they missed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Score History */}
        <ScoreHistory
          currentTotal={finalScore.total}
          currentRW={finalScore.rw.scaled}
          currentMath={finalScore.math.scaled}
        />

        {/* College Match */}
        <CollegeMatch totalScore={finalScore.total} />
      </div>

      {/* Full-width Superscore Calculator */}
      <div className="lg:col-span-12">
        <SuperscoreCalculator />
      </div>
    </div>
  );
};

export default SATCalculator;
