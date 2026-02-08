import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { SATState, SectionScore } from '../types';
import { Send, Sparkles, Loader2 } from 'lucide-react';

interface AIAdvisorProps {
  state: SATState;
  score: { rw: SectionScore; math: SectionScore; total: number };
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ state, score }) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const getAdvice = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        I am a student studying for the Digital SAT.
        My current estimated scores are:
        - Total: ${score.total}
        - Reading & Writing: ${score.rw.scaled} (Raw: ${state.rwM1}/${state.rwM2} out of 27 each)
        - Math: ${score.math.scaled} (Raw: ${state.mathM1}/${state.mathM2} out of 22 each)

        The adaptive modules I selected were: RW Module 2 is ${state.rwDifficulty}, Math Module 2 is ${state.mathDifficulty}.

        Provide a concise, motivating, and highly specific strategy to improve my score.
        Focus on whether I should prioritize RW or Math based on these scores, and mention how the adaptive nature of the digital SAT might be affecting me.
        Limit to 3 punchy bullet points.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are an expert SAT tutor from satcalculator.co. Your tone is encouraging, professional, and data-driven.",
          temperature: 0.7,
        }
      });

      setAdvice(response.text || "I couldn't generate advice right now. Please try again later!");
    } catch (error) {
      console.error(error);
      setAdvice("Error connecting to the AI tutor. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-800 font-heading">AI Prep Strategy</h3>
      </div>

      {advice ? (
        <div className="prose prose-slate max-w-none">
          <div className="whitespace-pre-line text-slate-700 text-sm leading-relaxed mb-4">
            {advice}
          </div>
          <button
            onClick={() => setAdvice(null)}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            Clear and ask again
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center py-4">
          <p className="text-sm text-slate-500 mb-4 text-center">
            Analyze your scores with our AI engine to get a personalized improvement plan.
          </p>
          <button
            onClick={getAdvice}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Analyzing...' : 'Generate AI Strategy'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
