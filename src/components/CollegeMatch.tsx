import { useMemo } from 'react';
import { GraduationCap, ChevronRight } from 'lucide-react';

interface College {
  name: string;
  sat25: number;
  sat75: number;
  tier: 'reach' | 'target' | 'safety';
}

const COLLEGES: Omit<College, 'tier'>[] = [
  { name: 'MIT', sat25: 1520, sat75: 1580 },
  { name: 'Harvard University', sat25: 1500, sat75: 1580 },
  { name: 'Stanford University', sat25: 1500, sat75: 1570 },
  { name: 'Yale University', sat25: 1490, sat75: 1560 },
  { name: 'Princeton University', sat25: 1500, sat75: 1570 },
  { name: 'Columbia University', sat25: 1490, sat75: 1560 },
  { name: 'University of Chicago', sat25: 1500, sat75: 1570 },
  { name: 'Duke University', sat25: 1470, sat75: 1560 },
  { name: 'Northwestern University', sat25: 1460, sat75: 1550 },
  { name: 'Johns Hopkins University', sat25: 1470, sat75: 1560 },
  { name: 'Rice University', sat25: 1460, sat75: 1560 },
  { name: 'Vanderbilt University', sat25: 1460, sat75: 1550 },
  { name: 'Carnegie Mellon University', sat25: 1440, sat75: 1560 },
  { name: 'Georgetown University', sat25: 1410, sat75: 1530 },
  { name: 'UCLA', sat25: 1370, sat75: 1530 },
  { name: 'University of Michigan', sat25: 1360, sat75: 1520 },
  { name: 'NYU', sat25: 1370, sat75: 1520 },
  { name: 'UC Berkeley', sat25: 1340, sat75: 1520 },
  { name: 'Boston University', sat25: 1350, sat75: 1510 },
  { name: 'University of Virginia', sat25: 1360, sat75: 1510 },
  { name: 'Georgia Tech', sat25: 1370, sat75: 1510 },
  { name: 'University of Florida', sat25: 1300, sat75: 1470 },
  { name: 'University of Texas at Austin', sat25: 1230, sat75: 1470 },
  { name: 'Ohio State University', sat25: 1220, sat75: 1420 },
  { name: 'Penn State University', sat25: 1180, sat75: 1370 },
  { name: 'University of Arizona', sat25: 1100, sat75: 1320 },
  { name: 'Arizona State University', sat25: 1080, sat75: 1310 },
  { name: 'Michigan State University', sat25: 1100, sat75: 1300 },
  { name: 'University of Oregon', sat25: 1080, sat75: 1290 },
  { name: 'University of Kansas', sat25: 1040, sat75: 1270 },
];

interface CollegeMatchProps {
  totalScore: number;
}

const CollegeMatch: React.FC<CollegeMatchProps> = ({ totalScore }) => {
  const matches = useMemo(() => {
    return COLLEGES.map(c => {
      let tier: College['tier'];
      if (totalScore >= c.sat75) {
        tier = 'safety';
      } else if (totalScore >= c.sat25) {
        tier = 'target';
      } else {
        tier = 'reach';
      }
      return { ...c, tier };
    });
  }, [totalScore]);

  const safetySchools = matches.filter(m => m.tier === 'safety');
  const targetSchools = matches.filter(m => m.tier === 'target');
  const reachSchools = matches.filter(m => m.tier === 'reach');

  const tierConfig = {
    target: { label: 'Target Schools', desc: 'Your score is within their middle 50%', color: 'emerald', bg: 'bg-emerald-50', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700' },
    safety: { label: 'Safety Schools', desc: 'Your score is above their 75th percentile', color: 'blue', bg: 'bg-blue-50', border: 'border-blue-100', badge: 'bg-blue-100 text-blue-700' },
    reach: { label: 'Reach Schools', desc: 'Your score is below their 25th percentile', color: 'amber', bg: 'bg-amber-50', border: 'border-amber-100', badge: 'bg-amber-100 text-amber-700' },
  };

  const renderTier = (schools: College[], tierKey: 'safety' | 'target' | 'reach') => {
    const config = tierConfig[tierKey];
    if (schools.length === 0) return null;
    return (
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${config.badge}`}>
            {config.label}
          </span>
          <span className="text-xs text-slate-400">{config.desc}</span>
        </div>
        <div className="space-y-1.5">
          {schools.map(school => (
            <div
              key={school.name}
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg ${config.bg} ${config.border} border`}
            >
              <span className="text-sm font-medium text-slate-700">{school.name}</span>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{school.sat25} - {school.sat75}</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-800 font-heading">College Match</h3>
      </div>
      <p className="text-sm text-slate-500 mb-5">
        See how your estimated score of <strong>{totalScore}</strong> compares to the middle 50% SAT range at popular colleges.
        SAT is just one factor in admissions.
      </p>

      {renderTier(targetSchools, 'target')}
      {renderTier(safetySchools, 'safety')}
      {renderTier(reachSchools, 'reach')}

      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        Score ranges shown are the 25th-75th percentile of admitted students. Admissions decisions involve many factors beyond test scores, including GPA, extracurriculars, and essays. Data is approximate and based on recent admissions cycles.
      </p>
    </div>
  );
};

export default CollegeMatch;
