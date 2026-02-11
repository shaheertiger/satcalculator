import { useState } from 'react';
import { Calculator } from 'lucide-react';

const ACTNoScienceCalculator: React.FC = () => {
    const [english, setEnglish] = useState<number | ''>(25);
    const [math, setMath] = useState<number | ''>(26);
    const [reading, setReading] = useState<number | ''>(28);

    const calculateScore = () => {
        const e = typeof english === 'number' ? english : 0;
        const m = typeof math === 'number' ? math : 0;
        const r = typeof reading === 'number' ? reading : 0;

        // Average of 3 sections
        const rawAvg = (e + m + r) / 3;
        // Round to nearest whole number
        return Math.round(rawAvg);
    };

    const score = calculateScore();

    const handleInput = (setter: any, value: string) => {
        if (value === '') {
            setter('');
            return;
        }
        const num = parseInt(value);
        if (!isNaN(num)) {
            setter(Math.min(36, Math.max(1, num)));
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                    <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 font-heading">ACT Score Calculator (No Science)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">English</label>
                    <input
                        type="number"
                        min="1"
                        max="36"
                        value={english}
                        onChange={(e) => handleInput(setEnglish, e.target.value)}
                        className="w-full text-lg font-bold text-center border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="1-36"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Math</label>
                    <input
                        type="number"
                        min="1"
                        max="36"
                        value={math}
                        onChange={(e) => handleInput(setMath, e.target.value)}
                        className="w-full text-lg font-bold text-center border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="1-36"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Reading</label>
                    <input
                        type="number"
                        min="1"
                        max="36"
                        value={reading}
                        onChange={(e) => handleInput(setReading, e.target.value)}
                        className="w-full text-lg font-bold text-center border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="1-36"
                    />
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-6 text-center border border-indigo-100">
                <span className="block text-sm font-bold text-indigo-400 uppercase tracking-widest mb-1">Estimated Composite</span>
                <div className="text-5xl font-black text-slate-900 font-heading">
                    {score}
                </div>
                <p className="text-sm text-slate-500 mt-2">
                    Calculated as the rounded average of English, Math, and Reading.
                </p>
            </div>
        </div>
    );
};

export default ACTNoScienceCalculator;
