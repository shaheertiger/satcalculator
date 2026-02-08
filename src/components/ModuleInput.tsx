interface ModuleInputProps {
  label: string;
  value: number;
  max: number;
  onChange: (val: number) => void;
  color: string;
}

const ModuleInput: React.FC<ModuleInputProps> = ({ label, value, max, onChange, color }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
        <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-500">Max: {max}</span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`flex-grow h-2 rounded-lg appearance-none cursor-pointer accent-${color}-600 bg-slate-200`}
        />
        <div className="w-12 text-center">
          <input
            type="number"
            min="0"
            max={max}
            value={value}
            onChange={(e) => onChange(Math.min(max, Math.max(0, parseInt(e.target.value) || 0)))}
            className="w-full text-lg font-bold text-slate-800 border-none focus:ring-0 p-0 text-right bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default ModuleInput;
