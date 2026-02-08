
export enum ModuleDifficulty {
  EASY = 'easy',
  HARD = 'hard',
  UNKNOWN = 'unknown'
}

export interface SectionScore {
  raw: number;
  scaled: number;
  range: [number, number];
  percentile: number;
}

export interface SATState {
  rwM1: number;
  rwM2: number;
  mathM1: number;
  mathM2: number;
  rwDifficulty: ModuleDifficulty;
  mathDifficulty: ModuleDifficulty;
  practiceTest: number; // 1-6
}

export interface ScoringCurve {
  id: number;
  name: string;
  rwMax: number;
  mathMax: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
