import { categories, suggestedNotes, suggestedNotesAr } from "./constants";
import { calculateCategoryAverages } from "./scoring";
import type { CategoryKey, CategoryScores, Evaluation, ReportData, SkillScores } from "./types";

const categoryFocus: Record<CategoryKey, string> = {
  technique: "technical repetition and cleaner contact quality",
  positioning: "court positioning, net control, and recovery habits",
  transition: "first-step urgency and transition decisions",
  fitness: "footwork, reaction speed, and rally endurance",
  tactics: "shot selection, point construction, and partner coordination"
};

function selectedNotesFor(category: CategoryKey, notes?: Record<CategoryKey, string[]>) {
  return (notes?.[category] ?? []).map((item) => {
    const index = Number(item.split(":")[1]);
    if (item.startsWith(`${category}:`) && Number.isFinite(index)) {
      return suggestedNotes[category][index] ?? suggestedNotesAr[category][index] ?? item;
    }
    return item;
  });
}

export function generateReportData(params: {
  playerId: string;
  evaluationId: string;
  finalScore: number;
  level: string;
  style: string;
  categoryScores: CategoryScores;
  skillScores: SkillScores;
  manualNotes: Record<CategoryKey, string>;
  notes?: Record<CategoryKey, string[]>;
}): ReportData {
  const averages = calculateCategoryAverages(params.skillScores);
  const sorted = [...categories].sort((a, b) => averages[b.key] - averages[a.key]);
  const strongest = sorted.slice(0, 2);
  const weakest = [...sorted].reverse().slice(0, 3);
  const justifications = categories.reduce((acc, category) => {
    const lowSkills = category.skills.filter((skill) => params.skillScores[category.key][skill.id] <= 2);
    const highSkills = category.skills.filter((skill) => params.skillScores[category.key][skill.id] >= 4);
    acc[category.key] = [
      ...highSkills.slice(0, 2).map((skill) => `${skill.name} is a current strength inside ${category.label.toLowerCase()}.`),
      ...lowSkills.slice(0, 2).map((skill) => `${skill.name} needs more repetition under pressure.`),
      ...selectedNotesFor(category.key, params.notes).slice(0, 1).map((note) => `Coach observation: ${note}`),
      params.manualNotes[category.key] ? `Coach note: ${params.manualNotes[category.key]}` : `${category.philosophy}`
    ].slice(0, 3);
    return acc;
  }, {} as Record<CategoryKey, string[]>);

  return {
    reportId: `${params.evaluationId}-report`,
    playerId: params.playerId,
    evaluationId: params.evaluationId,
    generatedSummary: `You are currently profiled as a ${params.style}. Your strongest indicators are ${strongest.map((item) => item.label.toLowerCase()).join(" and ")}, while the next jump will come from sharper ${categoryFocus[weakest[0].key]}. The report reflects live rating patterns plus selected coach observations.`,
    strengths: strongest.flatMap((category) =>
      category.skills
        .filter((skill) => params.skillScores[category.key][skill.id] >= 4)
        .slice(0, 2)
        .map((skill) => skill.name)
    ).slice(0, 4),
    weaknesses: weakest.map((category) => {
      const lowSkills = category.skills.filter((skill) => params.skillScores[category.key][skill.id] <= 2).slice(0, 2);
      return lowSkills.length
        ? `Improve ${lowSkills.map((skill) => skill.name.toLowerCase()).join(" and ")} under pressure`
        : `Improve ${category.label.toLowerCase()} consistency under pressure`;
    }),
    trainingPriorities: weakest.map((category) => categoryFocus[category.key]),
    coachingInsight: `Your best performance appears when ${strongest[0].key === "positioning" ? "controlling the pace near the net" : `your ${strongest[0].label.toLowerCase()} habits stay repeatable`}. Build the next block around ${categoryFocus[weakest[0].key]} while keeping awareness ahead of random aggression.`,
    roadmap: {
      weekOneTwo: `Movement base: ${categoryFocus[weakest[0].key]}. Use controlled repetitions before raising speed.`,
      weekThreeFour: `Pressure layer: ${categoryFocus[weakest[1]?.key ?? weakest[0].key]}. Add match-like decision pressure and recovery targets.`
    },
    justifications
  };
}

export function buildEvaluation(input: Omit<Evaluation, "reportData"> & { reportData?: ReportData }): Evaluation {
  return {
    ...input,
    reportData: input.reportData ?? generateReportData({
      playerId: input.playerIds[0],
      evaluationId: input.id,
      finalScore: input.finalScore,
      level: input.level,
      style: input.style,
      categoryScores: input.categoryScores,
      skillScores: input.skillScores,
      manualNotes: input.manualNotes,
      notes: input.notes
    })
  };
}
