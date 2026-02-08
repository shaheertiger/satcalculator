
import { SATState, SectionScore, ModuleDifficulty } from '../types';
import { MAX_QUESTIONS } from '../constants';

/**
 * Calculates a scaled score based on raw inputs.
 * Uses a simulated curve that penalizes harder if you are on the "Easy" second module.
 */
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
  
  // Base scaling factor
  let multiplier = 600 / totalMax;
  let penalty = 0;

  // Adaptive routing logic simulation
  // If user got low M1 but Hard M2 (unlikely) or high M1 but Easy M2 (penalty)
  if (difficulty === ModuleDifficulty.EASY && m1 > maxM1 * 0.7) {
    // Punish high raw scores on easy modules (cap is lower)
    multiplier *= 0.85;
  } else if (difficulty === ModuleDifficulty.HARD) {
    // Reward hard module participation
    multiplier *= 1.05;
  }

  let scaled = Math.round(200 + (rawTotal * multiplier));
  scaled = Math.min(800, Math.max(200, scaled));
  
  // Ensure increments of 10
  scaled = Math.round(scaled / 10) * 10;

  // Percentile approximation (simplified sigmoid)
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
