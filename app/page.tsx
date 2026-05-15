"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell, type ViewKey } from "@/components/AppShell";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { EvaluationFlow } from "@/components/evaluation/EvaluationFlow";
import { PlayerManager } from "@/components/players/PlayerManager";
import { ReportView } from "@/components/reports/ReportView";
import { generateReportData } from "@/lib/report-generator";
import { calculateCategoryScores, calculateFinalScore, detectPlayingStyle, getPlayerLevel } from "@/lib/scoring";
import { loadAppData, loadDraft, saveDraft, saveEvaluation, savePlayer } from "@/lib/storage";
import type { AppData, DraftEvaluation, Evaluation, Player } from "@/lib/types";

export default function Home() {
  const [data, setData] = useState<AppData>({ players: [], evaluations: [] });
  const [view, setView] = useState<ViewKey>("dashboard");
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftEvaluation | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loaded = loadAppData();
    setData(loaded);
    setSelectedEvaluationId(loaded.evaluations[0]?.id ?? null);
    setDraft(loadDraft());
  }, []);

  const selectedEvaluation = useMemo(
    () => data.evaluations.find((evaluation) => evaluation.id === selectedEvaluationId) ?? data.evaluations[0] ?? null,
    [data.evaluations, selectedEvaluationId]
  );
  const selectedPlayer = selectedEvaluation ? data.players.find((player) => player.id === selectedEvaluation.playerIds[0]) : undefined;

  function addPlayer(name: string) {
    const player: Player = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() };
    const next = savePlayer(player);
    setData(next);
  }

  function persistDraft(nextDraft: DraftEvaluation) {
    saveDraft(nextDraft);
    setDraft(nextDraft);
  }

  function finalizeEvaluation(nextDraft: DraftEvaluation) {
    const categoryScores = calculateCategoryScores(nextDraft.skillScores);
    const finalScore = calculateFinalScore(categoryScores);
    const level = getPlayerLevel(finalScore);
    const style = detectPlayingStyle(categoryScores, nextDraft.skillScores);
    const id = crypto.randomUUID();
    const evaluation: Evaluation = {
      id,
      playerIds: nextDraft.playerIds,
      evaluationType: nextDraft.evaluationType,
      matchType: nextDraft.matchType,
      categoryScores,
      skillScores: nextDraft.skillScores,
      notes: nextDraft.notes,
      manualNotes: nextDraft.manualNotes,
      finalScore,
      level,
      style,
      createdAt: new Date().toISOString(),
      reportData: generateReportData({
        playerId: nextDraft.playerIds[0],
        evaluationId: id,
        finalScore,
        level,
        style,
        categoryScores,
        skillScores: nextDraft.skillScores,
        manualNotes: nextDraft.manualNotes
      })
    };
    const next = saveEvaluation(evaluation);
    setData(next);
    setSelectedEvaluationId(id);
    setDraft(null);
    setView("report");
  }

  return (
    <AppShell view={view} onView={setView}>
      {view === "dashboard" && (
        <Dashboard
          data={data}
          search={search}
          onSearch={setSearch}
          onNewEvaluation={() => setView("evaluation")}
          onSelectEvaluation={(id) => {
            setSelectedEvaluationId(id);
            setView("report");
          }}
        />
      )}
      {view === "players" && <PlayerManager players={data.players} onAddPlayer={addPlayer} />}
      {view === "evaluation" && <EvaluationFlow data={data} initialDraft={draft} onSaveDraft={persistDraft} onFinalize={finalizeEvaluation} onAddPlayer={addPlayer} />}
      {view === "report" && <ReportView evaluation={selectedEvaluation} player={selectedPlayer} />}
    </AppShell>
  );
}
