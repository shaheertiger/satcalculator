import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

interface ScoreShareExportProps {
  total: number;
  rw: number;
  math: number;
  percentile: number;
}

const ScoreShareExport: React.FC<ScoreShareExportProps> = ({ total, rw, math, percentile }) => {
  const [copied, setCopied] = useState(false);

  const shareText = `My estimated Digital SAT score: ${total}/1600 (R&W: ${rw}, Math: ${math}) — ~${percentile}th percentile. Calculated at satcalculator.co`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 600, 320);

    // Header bar
    ctx.fillStyle = '#4f46e5';
    ctx.fillRect(0, 0, 600, 6);

    // Title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('My Digital SAT Score Estimate', 300, 45);

    // Total score
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 64px Inter, system-ui, sans-serif';
    ctx.fillText(String(total), 300, 125);

    // Range label
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Inter, system-ui, sans-serif';
    ctx.fillText(`~${percentile}th percentile`, 300, 155);

    // Section scores
    ctx.font = 'bold 14px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`Reading & Writing: ${rw}`, 200, 200);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`Math: ${math}`, 430, 200);

    // Divider
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 230);
    ctx.lineTo(550, 230);
    ctx.stroke();

    // Footer
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.fillText('satcalculator.co — Free Digital SAT Score Calculator', 300, 260);
    ctx.fillText(`Generated ${new Date().toLocaleDateString()}`, 300, 280);

    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sat-score-${total}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        title="Copy score summary"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <button
        onClick={handleExportImage}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        title="Download score card as image"
      >
        <Download className="w-3.5 h-3.5" />
        Save Image
      </button>
    </div>
  );
};

export default ScoreShareExport;
