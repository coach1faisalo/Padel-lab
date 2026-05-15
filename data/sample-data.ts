import { buildEvaluation } from "@/lib/report-generator";
import { calculateCategoryScores, calculateFinalScore, createDefaultSkillScores, detectPlayingStyle, getPlayerLevel } from "@/lib/scoring";
import type { AppData } from "@/lib/types";

const sampleScores = createDefaultSkillScores(4);
sampleScores.positioning.postShotRecovery = 3;
sampleScores.transition.offToDef = 2;
sampleScores.fitness.endurance = 3;

const categoryScores = calculateCategoryScores(sampleScores);
const finalScore = calculateFinalScore(categoryScores);
const level = getPlayerLevel(finalScore);
const style = detectPlayingStyle(categoryScores, sampleScores);

export const sampleData: AppData = {
  players: [
    { id: "player-1", name: "Omar Al-Nasser", createdAt: new Date().toISOString() },
    { id: "player-2", name: "Mariam Khaled", createdAt: new Date().toISOString() },
    { id: "player-3", name: "Yousef Salem", createdAt: new Date().toISOString() }
  ],
  evaluations: [
    buildEvaluation({
      id: "eval-1",
      playerIds: ["player-1"],
      evaluationType: "match",
      matchType: "Competitive",
      categoryScores,
      skillScores: sampleScores,
      notes: {
        technique: ["Ball control is strongest when the contact point stays in front."],
        positioning: ["You control the net effectively during attacking points."],
        transition: ["Your transition recovery needs more urgency."],
        fitness: ["Footwork quality drops late in longer rallies."],
        tactics: ["Shot selection improves when you build before attacking."]
      },
      manualNotes: {
        technique: "",
        positioning: "Strong net confidence. Needs cleaner recovery after forced lobs.",
        transition: "",
        fitness: "",
        tactics: ""
      },
      finalScore,
      level,
      style,
      createdAt: new Date().toISOString()
    })
  ]
};
