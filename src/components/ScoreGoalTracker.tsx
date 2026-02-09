import { useState, useEffect } from 'react';
import { Target, Trophy, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

interface GoalData {
  targetScore: number;
  targetCollege: string;
}

const GOAL_STORAGE_KEY = 'sat_score_goal';

const POPULAR_COLLEGES: { name: string; avg: number }[] = [
  { name: 'MIT', avg: 1550 },
  { name: 'Harvard', avg: 1540 },
  { name: 'Stanford', avg: 1535 },
  { name: 'Yale', avg: 1525 },
  { name: 'Princeton', avg: 1535 },
  { name: 'Columbia', avg: 1525 },
  { name: 'Duke', avg: 1515 },
  { name: 'Northwestern', avg: 1505 },
  { name: 'UCLA', avg: 1450 },
  { name: 'UC Berkeley', avg: 1430 },
  { name: 'NYU', avg: 1445 },
  { name: 'University of Michigan', avg: 1440 },
  { name: 'Georgia Tech', avg: 1440 },
  { name: 'University of Virginia', avg: 1435 },
  { name: 'Boston University', avg: 1430 },
  { name: 'University of Florida', avg: 1385 },
  { name: 'UT Austin', avg: 1350 },
  { name: 'Ohio State', avg: 1320 },
  { name: 'Penn State', avg: 1275 },
  { name: 'Arizona State', avg: 1195 },
];

interface ScoreGoalTrackerProps {
  currentTotal: number;
}

const ScoreGoalTracker: React.FC<ScoreGoalTrackerProps> = ({ currentTotal }) => {
  const [goal, setGoal] = useState<GoalData | null>(null);
  const [targetInput, setTargetInput] = useState(1400);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GOAL_STORAGE_KEY);
      if (stored) {
        setGoal(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const saveGoal = () => {
    const newGoal: GoalData = {
      targetScore: targetInput,
      targetCollege: selectedCollege,
    };
    setGoal(newGoal);
    localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(newGoal));
  };

  const clearGoal = () => {
    setGoal(null);
    localStorage.removeItem(GOAL_STORAGE_KEY);
  };

  const handleCollegeSelect = (collegeName: string) => {
    setSelectedCollege(collegeName);
    const college = POPULAR_COLLEGES.find(c => c.name === collegeName);
    if (college) {
      setTargetInput(college.avg);
    }
  };

  const gap = goal ? goal.targetScore - currentTotal : 0;
  const progress = goal ? Math.min(100, Math.max(0, ((currentTotal - 400) / (goal.targetScore - 400)) * 100)) : 0;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-rose-500" />
          <h3 className="text-lg font-bold text-slate-800 font-heading">Score Goal Tracker</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {!isExpanded && goal && (
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-grow bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-700 whitespace-nowrap">{currentTotal} / {goal.targetScore}</span>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4">
          <p className="text-sm text-slate-500 mb-4">
            Set a target score to track your progress. Optionally pick a dream school to auto-fill its average admitted score.
          </p>

          {goal ? (
            <div className="space-y-4">
              {/* Progress display */}
              <div className="bg-gradient-to-br from-indigo-50 to-rose-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Progress to Goal</span>
                  {goal.targetCollege && (
                    <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{goal.targetCollege}</span>
                  )}
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <div className="text-3xl font-black text-slate-900 font-heading">{currentTotal}</div>
                  <div className="text-sm text-slate-500 mb-1">/ {goal.targetScore} target</div>
                </div>
                <div className="bg-white/60 rounded-full h-3 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{Math.round(progress)}% there</span>
                  {gap > 0 ? (
                    <span className="font-medium text-rose-600">{gap} points to go</span>
                  ) : (
                    <span className="font-medium text-emerald-600 flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> Goal reached!
                    </span>
                  )}
                </div>
              </div>

              {/* Suggested improvements */}
              {gap > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-bold text-slate-700">To close the {gap}-point gap:</span>
                  </div>
                  <ul className="text-sm text-slate-600 space-y-1.5">
                    {gap <= 50 && <li>Focus on eliminating careless errors — review missed questions carefully.</li>}
                    {gap > 50 && gap <= 150 && <li>Target your weaker section (R&W or Math) for the biggest gains.</li>}
                    {gap > 150 && <li>Create a structured study plan covering both sections systematically.</li>}
                    <li>Take timed practice tests weekly to build stamina and accuracy.</li>
                    {gap > 100 && <li>Consider focusing on high-frequency question types first for quick wins.</li>}
                  </ul>
                </div>
              )}

              <button
                onClick={clearGoal}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Reset goal
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Dream School (optional)</label>
                <select
                  value={selectedCollege}
                  onChange={e => handleCollegeSelect(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                >
                  <option value="">Select a college...</option>
                  {POPULAR_COLLEGES.map(c => (
                    <option key={c.name} value={c.name}>{c.name} (avg: {c.avg})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Target Score</label>
                <input
                  type="number"
                  min={400}
                  max={1600}
                  step={10}
                  value={targetInput}
                  onChange={e => setTargetInput(Math.min(1600, Math.max(400, parseInt(e.target.value) || 400)))}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>
              <button
                onClick={saveGoal}
                className="w-full bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Set Goal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScoreGoalTracker;
