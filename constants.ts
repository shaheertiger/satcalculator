
import { ScoringCurve } from './types';

export const PRACTICE_TESTS: ScoringCurve[] = [
  { id: 1, name: "Bluebook Practice Test 1", rwMax: 54, mathMax: 44 },
  { id: 2, name: "Bluebook Practice Test 2", rwMax: 54, mathMax: 44 },
  { id: 3, name: "Bluebook Practice Test 3", rwMax: 54, mathMax: 44 },
  { id: 4, name: "Bluebook Practice Test 4", rwMax: 54, mathMax: 44 },
  { id: 5, name: "Bluebook Practice Test 5", rwMax: 54, mathMax: 44 },
  { id: 6, name: "Bluebook Practice Test 6", rwMax: 54, mathMax: 44 },
  { id: 0, name: "General Estimate (Aggregated)", rwMax: 54, mathMax: 44 },
];

export const MAX_QUESTIONS = {
  RW_MODULE: 27,
  MATH_MODULE: 22
};

// Simplified curve lookup logic coefficients (for modeling purposes)
// In a real production app, these would be precise JSON tables from Bluebook data
export const BASE_SCORE = 200;
export const MAX_SECTION = 800;
