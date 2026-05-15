import { sampleData } from "@/data/sample-data";
import type { AppData, DraftEvaluation, Evaluation, Player } from "./types";

const DATA_KEY = "coach-faisal-padel-lab:data";
const DRAFT_KEY = "coach-faisal-padel-lab:draft";

const isBrowser = () => typeof window !== "undefined";

export function loadAppData(): AppData {
  if (!isBrowser()) return sampleData;
  const stored = window.localStorage.getItem(DATA_KEY);
  if (!stored) {
    saveAppData(sampleData);
    return sampleData;
  }
  try {
    return JSON.parse(stored) as AppData;
  } catch {
    saveAppData(sampleData);
    return sampleData;
  }
}

export function saveAppData(data: AppData) {
  if (isBrowser()) window.localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function savePlayer(player: Player): AppData {
  const data = loadAppData();
  const next = { ...data, players: [player, ...data.players] };
  saveAppData(next);
  return next;
}

export function saveEvaluation(evaluation: Evaluation): AppData {
  const data = loadAppData();
  const next = { ...data, evaluations: [evaluation, ...data.evaluations] };
  saveAppData(next);
  window.localStorage.removeItem(DRAFT_KEY);
  return next;
}

export function loadDraft(): DraftEvaluation | null {
  if (!isBrowser()) return null;
  const stored = window.localStorage.getItem(DRAFT_KEY);
  return stored ? (JSON.parse(stored) as DraftEvaluation) : null;
}

export function saveDraft(draft: DraftEvaluation) {
  if (isBrowser()) window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}
