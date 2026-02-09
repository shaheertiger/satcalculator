import { useState, useMemo } from 'react';
import { GraduationCap, ChevronRight, Search, Filter } from 'lucide-react';

interface College {
  name: string;
  sat25: number;
  sat75: number;
  tier: 'reach' | 'target' | 'safety';
}

const COLLEGES: Omit<College, 'tier'>[] = [
  // Ivy League & Top 10
  { name: 'MIT', sat25: 1520, sat75: 1580 },
  { name: 'Harvard University', sat25: 1500, sat75: 1580 },
  { name: 'Stanford University', sat25: 1500, sat75: 1570 },
  { name: 'Yale University', sat25: 1490, sat75: 1560 },
  { name: 'Princeton University', sat25: 1500, sat75: 1570 },
  { name: 'Columbia University', sat25: 1490, sat75: 1560 },
  { name: 'University of Chicago', sat25: 1500, sat75: 1570 },
  { name: 'Caltech', sat25: 1530, sat75: 1570 },
  { name: 'University of Pennsylvania', sat25: 1490, sat75: 1560 },
  { name: 'Brown University', sat25: 1480, sat75: 1560 },
  { name: 'Dartmouth College', sat25: 1470, sat75: 1560 },
  { name: 'Cornell University', sat25: 1460, sat75: 1550 },
  // Top 20
  { name: 'Duke University', sat25: 1470, sat75: 1560 },
  { name: 'Northwestern University', sat25: 1460, sat75: 1550 },
  { name: 'Johns Hopkins University', sat25: 1470, sat75: 1560 },
  { name: 'Rice University', sat25: 1460, sat75: 1560 },
  { name: 'Vanderbilt University', sat25: 1460, sat75: 1550 },
  { name: 'Washington University in St. Louis', sat25: 1470, sat75: 1560 },
  { name: 'Notre Dame', sat25: 1420, sat75: 1540 },
  { name: 'Emory University', sat25: 1420, sat75: 1530 },
  // Top 30
  { name: 'Carnegie Mellon University', sat25: 1440, sat75: 1560 },
  { name: 'Georgetown University', sat25: 1410, sat75: 1530 },
  { name: 'University of Southern California', sat25: 1410, sat75: 1530 },
  { name: 'Wake Forest University', sat25: 1370, sat75: 1490 },
  { name: 'Tufts University', sat25: 1420, sat75: 1530 },
  { name: 'University of North Carolina at Chapel Hill', sat25: 1350, sat75: 1500 },
  // Top 50
  { name: 'UCLA', sat25: 1370, sat75: 1530 },
  { name: 'University of Michigan', sat25: 1360, sat75: 1520 },
  { name: 'NYU', sat25: 1370, sat75: 1520 },
  { name: 'UC Berkeley', sat25: 1340, sat75: 1520 },
  { name: 'Boston University', sat25: 1350, sat75: 1510 },
  { name: 'University of Virginia', sat25: 1360, sat75: 1510 },
  { name: 'Georgia Tech', sat25: 1370, sat75: 1510 },
  { name: 'Boston College', sat25: 1380, sat75: 1510 },
  { name: 'William & Mary', sat25: 1350, sat75: 1500 },
  { name: 'University of Rochester', sat25: 1350, sat75: 1500 },
  { name: 'Brandeis University', sat25: 1330, sat75: 1490 },
  { name: 'Case Western Reserve University', sat25: 1340, sat75: 1490 },
  { name: 'Northeastern University', sat25: 1390, sat75: 1520 },
  { name: 'Tulane University', sat25: 1330, sat75: 1480 },
  { name: 'UC Santa Barbara', sat25: 1280, sat75: 1470 },
  { name: 'UC San Diego', sat25: 1310, sat75: 1490 },
  { name: 'UC Davis', sat25: 1210, sat75: 1430 },
  { name: 'UC Irvine', sat25: 1230, sat75: 1440 },
  { name: 'Lehigh University', sat25: 1310, sat75: 1450 },
  { name: 'Rensselaer Polytechnic Institute', sat25: 1330, sat75: 1480 },
  { name: 'Pepperdine University', sat25: 1280, sat75: 1430 },
  { name: 'University of Wisconsin-Madison', sat25: 1300, sat75: 1460 },
  { name: 'University of Illinois Urbana-Champaign', sat25: 1310, sat75: 1480 },
  { name: 'Purdue University', sat25: 1190, sat75: 1420 },
  { name: 'Villanova University', sat25: 1350, sat75: 1480 },
  { name: 'Santa Clara University', sat25: 1310, sat75: 1450 },
  // Top 75
  { name: 'University of Florida', sat25: 1300, sat75: 1470 },
  { name: 'University of Texas at Austin', sat25: 1230, sat75: 1470 },
  { name: 'University of Georgia', sat25: 1270, sat75: 1420 },
  { name: 'University of Maryland', sat25: 1310, sat75: 1470 },
  { name: 'Texas A&M University', sat25: 1180, sat75: 1380 },
  { name: 'University of Washington', sat25: 1240, sat75: 1440 },
  { name: 'Fordham University', sat25: 1290, sat75: 1430 },
  { name: 'Southern Methodist University', sat25: 1310, sat75: 1450 },
  { name: 'Syracuse University', sat25: 1220, sat75: 1380 },
  { name: 'George Washington University', sat25: 1300, sat75: 1440 },
  { name: 'University of Connecticut', sat25: 1230, sat75: 1380 },
  { name: 'Clemson University', sat25: 1240, sat75: 1390 },
  { name: 'University of Pittsburgh', sat25: 1250, sat75: 1410 },
  { name: 'Rutgers University', sat25: 1210, sat75: 1390 },
  { name: 'University of Minnesota', sat25: 1270, sat75: 1430 },
  { name: 'Virginia Tech', sat25: 1220, sat75: 1390 },
  { name: 'Indiana University Bloomington', sat25: 1120, sat75: 1330 },
  { name: 'Stevens Institute of Technology', sat25: 1350, sat75: 1480 },
  { name: 'Worcester Polytechnic Institute', sat25: 1310, sat75: 1460 },
  { name: 'Drexel University', sat25: 1190, sat75: 1370 },
  // Top 100
  { name: 'Ohio State University', sat25: 1220, sat75: 1420 },
  { name: 'Penn State University', sat25: 1180, sat75: 1370 },
  { name: 'University of Iowa', sat25: 1120, sat75: 1320 },
  { name: 'University of South Carolina', sat25: 1150, sat75: 1330 },
  { name: 'University of Tennessee', sat25: 1130, sat75: 1320 },
  { name: 'Auburn University', sat25: 1140, sat75: 1310 },
  { name: 'University of Colorado Boulder', sat25: 1150, sat75: 1350 },
  { name: 'University of Alabama', sat25: 1100, sat75: 1310 },
  { name: 'North Carolina State University', sat25: 1250, sat75: 1390 },
  { name: 'Colorado School of Mines', sat25: 1310, sat75: 1450 },
  { name: 'Baylor University', sat25: 1200, sat75: 1370 },
  { name: 'University of Delaware', sat25: 1150, sat75: 1330 },
  { name: 'Iowa State University', sat25: 1100, sat75: 1310 },
  { name: 'University of Massachusetts Amherst', sat25: 1240, sat75: 1390 },
  { name: 'Loyola Marymount University', sat25: 1230, sat75: 1370 },
  // Accessible tier
  { name: 'University of Arizona', sat25: 1100, sat75: 1320 },
  { name: 'Arizona State University', sat25: 1080, sat75: 1310 },
  { name: 'Michigan State University', sat25: 1100, sat75: 1300 },
  { name: 'University of Oregon', sat25: 1080, sat75: 1290 },
  { name: 'University of Kansas', sat25: 1040, sat75: 1270 },
  { name: 'University of Nebraska-Lincoln', sat25: 1060, sat75: 1280 },
  { name: 'University of Oklahoma', sat25: 1070, sat75: 1290 },
  { name: 'University of Kentucky', sat25: 1060, sat75: 1270 },
  { name: 'Louisiana State University', sat25: 1060, sat75: 1260 },
  { name: 'University of Mississippi', sat25: 1030, sat75: 1240 },
  { name: 'University of Arkansas', sat25: 1050, sat75: 1260 },
  { name: 'University of Nevada, Reno', sat25: 1020, sat75: 1240 },
  { name: 'San Diego State University', sat25: 1130, sat75: 1310 },
  { name: 'Florida State University', sat25: 1200, sat75: 1350 },
  { name: 'Temple University', sat25: 1090, sat75: 1280 },
  { name: 'Portland State University', sat25: 980, sat75: 1220 },
  { name: 'University of Hawaii at Manoa', sat25: 1040, sat75: 1240 },
];

interface CollegeMatchProps {
  totalScore: number;
}

const CollegeMatch: React.FC<CollegeMatchProps> = ({ totalScore }) => {
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState<'all' | 'safety' | 'target' | 'reach'>('all');

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

  const filtered = useMemo(() => {
    let results = matches;
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(m => m.name.toLowerCase().includes(q));
    }
    if (filterTier !== 'all') {
      results = results.filter(m => m.tier === filterTier);
    }
    return results;
  }, [matches, search, filterTier]);

  const safetySchools = filtered.filter(m => m.tier === 'safety');
  const targetSchools = filtered.filter(m => m.tier === 'target');
  const reachSchools = filtered.filter(m => m.tier === 'reach');

  const tierConfig = {
    target: { label: 'Target Schools', desc: 'Your score is within their middle 50%', color: 'emerald', bg: 'bg-emerald-50', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700' },
    safety: { label: 'Safety Schools', desc: 'Your score is above their 75th percentile', color: 'blue', bg: 'bg-blue-50', border: 'border-blue-100', badge: 'bg-blue-100 text-blue-700' },
    reach: { label: 'Reach Schools', desc: 'Your score is below their 25th percentile', color: 'amber', bg: 'bg-amber-50', border: 'border-amber-100', badge: 'bg-amber-100 text-amber-700' },
  };

  const renderTier = (schools: College[], tierKey: 'safety' | 'target' | 'reach') => {
    const config = tierConfig[tierKey];
    if (schools.length === 0) return null;
    return (
      <div className="mb-4 sm:mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded self-start ${config.badge}`}>
            {config.label}
          </span>
          <span className="text-xs text-slate-400">{config.desc}</span>
        </div>
        <div className="space-y-1.5">
          {schools.map(school => (
            <div
              key={school.name}
              className={`flex items-center justify-between px-3 sm:px-4 py-2.5 rounded-lg ${config.bg} ${config.border} border`}
            >
              <span className="text-sm font-medium text-slate-700 truncate mr-2">{school.name}</span>
              <div className="flex items-center gap-1 sm:gap-2 text-xs text-slate-500 flex-shrink-0">
                <span>{school.sat25}-{school.sat75}</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-800 font-heading">College Match</h3>
      </div>
      <p className="text-sm text-slate-500 mb-3">
        See how your estimated score of <strong>{totalScore}</strong> compares to the middle 50% SAT range at {COLLEGES.length}+ colleges.
        SAT is just one factor in admissions.
      </p>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search colleges..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {(['all', 'safety', 'target', 'reach'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                filterTier === tier
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {tier === 'all' ? 'All' : tier.charAt(0).toUpperCase() + tier.slice(1)}
            </button>
          ))}
        </div>
      </div>

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
