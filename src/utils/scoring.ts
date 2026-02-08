import type { SATState, SectionScore } from '../types';
import { ModuleDifficulty } from '../types';
import { MAX_QUESTIONS } from '../constants';

const calculateSection = (
  m1: number,
  m2: number,
  difficulty: ModuleDifficulty,
  type: 'RW' | 'MATH'
): SectionScore => {
  const maxM1 = type === 'RW' ? MAX_QUESTIONS.RW_MODULE : MAX_QUESTIONS.MATH_MODULE;
  const maxM2 = type === 'RW' ? MAX_QUESTIONS.RW_MODULE : MAX_QUESTIONS.MATH_MODULE;
  const totalMax = maxM1 + maxM2;
  const rawTotal = m1 + m2;

  let multiplier = 600 / totalMax;

  if (difficulty === ModuleDifficulty.EASY && m1 > maxM1 * 0.7) {
    multiplier *= 0.85;
  } else if (difficulty === ModuleDifficulty.HARD) {
    multiplier *= 1.05;
  }

  let scaled = Math.round(200 + (rawTotal * multiplier));
  scaled = Math.min(800, Math.max(200, scaled));
  scaled = Math.round(scaled / 10) * 10;

  const percentile = Math.min(99, Math.max(1, Math.round(100 / (1 + Math.exp(-0.015 * (scaled - 500))))));

  return {
    raw: rawTotal,
    scaled,
    range: [Math.max(200, scaled - 40), Math.min(800, scaled + 30)],
    percentile
  };
};

export const getFullScore = (state: SATState) => {
  const rw = calculateSection(state.rwM1, state.rwM2, state.rwDifficulty, 'RW');
  const math = calculateSection(state.mathM1, state.mathM2, state.mathDifficulty, 'MATH');

  return {
    rw,
    math,
    total: rw.scaled + math.scaled,
    totalRange: [rw.range[0] + math.range[0], Math.min(1600, rw.range[1] + math.range[1])]
  };
};
