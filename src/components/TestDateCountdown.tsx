import { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface TestDate {
  date: string; // YYYY-MM-DD
  label: string;
  registrationDeadline: string; // YYYY-MM-DD
}

// 2025-2026 SAT test dates
const UPCOMING_DATES: TestDate[] = [
  { date: '2025-03-08', label: 'March 2025 SAT', registrationDeadline: '2025-02-21' },
  { date: '2025-05-03', label: 'May 2025 SAT', registrationDeadline: '2025-04-18' },
  { date: '2025-06-07', label: 'June 2025 SAT', registrationDeadline: '2025-05-22' },
  { date: '2025-08-23', label: 'August 2025 SAT', registrationDeadline: '2025-08-08' },
  { date: '2025-10-04', label: 'October 2025 SAT', registrationDeadline: '2025-09-19' },
  { date: '2025-11-01', label: 'November 2025 SAT', registrationDeadline: '2025-10-17' },
  { date: '2025-12-06', label: 'December 2025 SAT', registrationDeadline: '2025-11-21' },
  { date: '2026-03-14', label: 'March 2026 SAT', registrationDeadline: '2026-02-27' },
  { date: '2026-05-02', label: 'May 2026 SAT', registrationDeadline: '2026-04-17' },
  { date: '2026-06-06', label: 'June 2026 SAT', registrationDeadline: '2026-05-22' },
];

const TestDateCountdown: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const upcomingDates = useMemo(() => {
    return UPCOMING_DATES.filter(d => new Date(d.date) > now);
  }, [now]);

  const nextTest = upcomingDates[0];

  const getDaysUntil = (dateStr: string) => {
    const target = new Date(dateStr);
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!nextTest) return null;

  const daysUntilNext = getDaysUntil(nextTest.date);
  const daysUntilRegDeadline = getDaysUntil(nextTest.registrationDeadline);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-slate-800 font-heading">SAT Test Dates</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {/* Compact view - always show next test */}
      {!isExpanded && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-slate-600">{nextTest.label}</span>
          </div>
          <span className={`text-sm font-bold ${daysUntilNext <= 30 ? 'text-red-600' : daysUntilNext <= 60 ? 'text-orange-600' : 'text-slate-700'}`}>
            {daysUntilNext} days
          </span>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-500 mb-3">
            Upcoming SAT test dates and registration deadlines for 2025-2026.
          </p>

          {/* Next test highlight */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block mb-1">Next Test</span>
            <div className="text-lg font-bold text-slate-900">{nextTest.label}</div>
            <div className="text-sm text-slate-600 mt-1">{formatDate(nextTest.date)}</div>
            <div className="flex items-center gap-4 mt-3">
              <div>
                <div className="text-2xl font-black text-orange-600 font-heading">{daysUntilNext}</div>
                <div className="text-xs text-slate-500">days until test</div>
              </div>
              <div className="h-8 w-px bg-orange-200"></div>
              <div>
                <div className={`text-lg font-bold ${daysUntilRegDeadline <= 0 ? 'text-red-500' : daysUntilRegDeadline <= 7 ? 'text-red-600' : 'text-slate-700'}`}>
                  {daysUntilRegDeadline <= 0 ? 'Passed' : `${daysUntilRegDeadline} days`}
                </div>
                <div className="text-xs text-slate-500">registration deadline</div>
              </div>
            </div>
          </div>

          {/* All upcoming dates */}
          <div className="space-y-1.5">
            {upcomingDates.slice(1).map(d => {
              const days = getDaysUntil(d.date);
              const regDays = getDaysUntil(d.registrationDeadline);
              return (
                <div key={d.date} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div>
                    <div className="text-sm font-medium text-slate-700">{d.label}</div>
                    <div className="text-xs text-slate-400">{formatDate(d.date)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-700">{days} days</div>
                    <div className={`text-xs ${regDays <= 0 ? 'text-red-400' : regDays <= 14 ? 'text-orange-500' : 'text-slate-400'}`}>
                      Reg: {regDays <= 0 ? 'closed' : `${regDays}d left`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDateCountdown;
