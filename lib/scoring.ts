import { categories } from "./constants";
import type { CategoryKey, CategoryScores, Rating, SkillScores } from "./types";

export function createDefaultSkillScores(value: Rating = 3): SkillScores {
  return categories.reduce((acc, category) => {
    acc[category.key] = category.skills.reduce<Record<string, Rating>>((skills, skill) => {
      skills[skill.id] = value;
      return skills;
    }, {});
    return acc;
  }, {} as SkillScores);
}

export function calculateCategoryAverages(skillScores: SkillScores): Record<CategoryKey, number> {
  return categories.reduce((acc, category) => {
    const scores = category.skills.map((skill) => skillScores[category.key]?.[skill.id] ?? 1);
    acc[category.key] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return acc;
  }, {} as Record<CategoryKey, number>);
}

export function calculateCategoryScores(skillScores: SkillScores): CategoryScores {
  const averages = calculateCategoryAverages(skillScores);
  return categories.reduce((acc, category) => {
    acc[category.key] = Math.round(((averages[category.key] / 5) * category.weight) * 10) / 10;
    return acc;
  }, {} as CategoryScores);
}

export function calculateFinalScore(categoryScores: CategoryScores): number {
  return Math.round(Object.values(categoryScores).reduce((sum, score) => sum + score, 0));
}

export function getPlayerLevel(score: number): string {
  if (score >= 90) return "Advanced";
  if (score >= 85) return "Upper Intermediate";
  if (score >= 70) return "Intermediate";
  if (score >= 50) return "Lower Intermediate";
  return "Beginner";
}

export function detectPlayingStyle(categoryScores: CategoryScores, skillScores: SkillScores): string {
  const positioningRating = (categoryScores.positioning / 40) * 5;
  const tacticsRating = (categoryScores.tactics / 10) * 5;
  const fitnessRating = (categoryScores.fitness / 20) * 5;
  const transitionRating = (categoryScores.transition / 10) * 5;
  const techniqueRating = (categoryScores.technique / 20) * 5;
  const netControl = skillScores.positioning.netControl;
  const defensive = skillScores.positioning.defensivePositioning;

  if (positioningRating >= 4 && tacticsRating >= 4 && netControl >= 4) return "Smart Net Controller";
  if (positioningRating >= 4 && netControl >= 4) return "Net Controller";
  if (fitnessRating >= 4 && transitionRating >= 4) return "Fast Transition Player";
  if (techniqueRating >= 4 && tacticsRating < 3.5) return "Technical Player";
  if (defensive >= 4 && positioningRating >= 3.5) return "Defensive Player";
  if (tacticsRating >= 4) return "Tactical Thinker";
  if (techniqueRating >= 4 && skillScores.tactics.shotSelection >= 4) return "Aggressive Attacker";
  return "Smart Builder";
}
