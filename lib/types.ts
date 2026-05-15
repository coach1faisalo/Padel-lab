export type EvaluationType = "match" | "session";
export type MatchType = "Friendly" | "Competitive" | "Tournament";
export type CategoryKey = "technique" | "positioning" | "transition" | "fitness" | "tactics";
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Player {
  id: string;
  name: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  nameAr: string;
}

export interface CategoryDefinition {
  key: CategoryKey;
  label: string;
  labelAr: string;
  weight: number;
  accent: string;
  philosophy: string;
  philosophyAr: string;
  skills: Skill[];
}

export type SkillScores = Record<CategoryKey, Record<string, Rating>>;
export type CategoryScores = Record<CategoryKey, number>;

export interface Evaluation {
  id: string;
  playerIds: string[];
  evaluationType: EvaluationType;
  matchType: MatchType;
  categoryScores: CategoryScores;
  skillScores: SkillScores;
  notes: Record<CategoryKey, string[]>;
  manualNotes: Record<CategoryKey, string>;
  finalScore: number;
  level: string;
  style: string;
  reportData: ReportData;
  createdAt: string;
}

export interface ReportData {
  reportId: string;
  playerId: string;
  evaluationId: string;
  generatedSummary: string;
  strengths: string[];
  weaknesses: string[];
  trainingPriorities: string[];
  coachingInsight: string;
  roadmap: {
    weekOneTwo: string;
    weekThreeFour: string;
  };
  justifications: Record<CategoryKey, string[]>;
}

export interface DraftEvaluation {
  playerIds: string[];
  evaluationType: EvaluationType;
  matchType: MatchType;
  skillScores: SkillScores;
  notes: Record<CategoryKey, string[]>;
  manualNotes: Record<CategoryKey, string>;
}

export interface AppData {
  players: Player[];
  evaluations: Evaluation[];
}
