
import React, { useState, useMemo } from 'react';
import { SATState, ModuleDifficulty } from './types';
import { PRACTICE_TESTS, MAX_QUESTIONS } from './constants';
import { getFullScore } from './utils/scoring';
import ModuleInput from './components/ModuleInput';
import { 
  Calculator, 
  BookOpen, 
  HelpCircle, 
  Target, 
  BarChart3,
  ExternalLink,
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

const App: React.FC = () => {
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

  // Mock data for the bell curve
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 400; i <= 1600; i += 20) {
      // Simple normal distribution approximation
      const mean = 1050;
      const stdDev = 200;
      const val = Math.exp(-0.5 * Math.pow((i - mean) / stdDev, 2));
      data.push({ score: i, density: val });
    }
    return data;
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">satcalculator<span className="text-indigo-600">.co</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Digital SAT Guide</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Practice Tests</a>
          </nav>
          <div className="flex items-center gap-4">
            {/* Sign In removed */}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-800">Input Raw Scores</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <h3 className="font-semibold text-slate-700">Reading & Writing</h3>
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
                      <h3 className="font-semibold text-slate-700">Mathematics</h3>
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
                <h4 className="font-bold">Pro Tip: IRT Matters</h4>
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
                <h1 className="text-7xl font-black text-slate-900 tracking-tight mb-2">
                  {finalScore.total}
                </h1>
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
                      formatter={(val: number) => [``, 'Population Density']}
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
              
              {/* AI Section Removed */}
            </section>

            {/* Educational / Comparison Table */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Why calculators are "just estimates"
              </h3>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  Since the SAT went digital in 2023, the scoring algorithm has become <strong>multistage adaptive</strong>. 
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-1">Easy vs. Hard M2</h4>
                    <p>If you don't perform well in Module 1, you are routed to an easier Module 2, which effectively caps your maximum possible score around 600-650.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-1">Point Weights</h4>
                    <p>Two students with 10 wrong answers can have scores that differ by 50+ points depending on which specific questions they missed.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                <div className="w-6 h-6 gradient-bg rounded flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-800 tracking-tight">satcalculator.co</span>
              </div>
              <p className="text-sm text-slate-500">The most accurate Digital SAT score estimator based on real practice data.</p>
            </div>
            <div>
              <h5 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">Resources</h5>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Digital SAT 101</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Study Schedules</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Vocabulary Lists</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">Tools</h5>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Score Calculator</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">ACT Converter</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Super Score Tracker</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">Contact</h5>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Support Center</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Partner Program</a></li>
                <li><a href="#" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">Instagram <ExternalLink className="w-3 h-3" /></a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">© {new Date().getFullYear()} satcalculator.co. All rights reserved. SAT® is a registered trademark of the College Board.</p>
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
