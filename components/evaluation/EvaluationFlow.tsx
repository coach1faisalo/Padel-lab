"use client";

import { ChevronDown, ClipboardCheck, FileCheck2, Save, UserPlus } from "lucide-react";
import { clsx } from "clsx";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/use-language";
import { categories, ratingLabels, ratingLabelsAr, suggestedNotes, suggestedNotesAr } from "@/lib/constants";
import { calculateCategoryScores, calculateFinalScore, createDefaultSkillScores, detectPlayingStyle, getPlayerLevel } from "@/lib/scoring";
import type { AppData, CategoryKey, DraftEvaluation, MatchType, Rating } from "@/lib/types";

export function EvaluationFlow({ data, initialDraft, onSaveDraft, onFinalize, onAddPlayer }: { data: AppData; initialDraft: DraftEvaluation | null; onSaveDraft: (draft: DraftEvaluation) => void; onFinalize: (draft: DraftEvaluation) => void; onAddPlayer: (name: string) => { id: string } }) {
  const { language, t, toggleLanguage } = useLanguage();
  const isArabic = language === "ar";
  const [draft, setDraft] = useState<DraftEvaluation>(initialDraft ?? {
    playerIds: data.players[0] ? [data.players[0].id] : [],
    evaluationType: "match",
    matchType: "Competitive",
    skillScores: createDefaultSkillScores(3),
    notes: { technique: [], positioning: [], transition: [], fitness: [], tactics: [] },
    manualNotes: { technique: "", positioning: "", transition: "", fitness: "", tactics: "" },
    touchedSkills: {}
  });
  const [open, setOpen] = useState<CategoryKey | null>("positioning");
  const scores = useMemo(() => calculateCategoryScores(draft.skillScores), [draft.skillScores]);
  const finalScore = calculateFinalScore(scores);
  const level = getPlayerLevel(finalScore);
  const style = detectPlayingStyle(scores, draft.skillScores);

  useEffect(() => {
    onSaveDraft(draft);
  }, [draft, onSaveDraft]);

  function touchedKey(category: CategoryKey, skillId: string) {
    return `${category}:${skillId}`;
  }

  function scoreTone(value: number, touched = true) {
    if (!touched) return "border-white/35 bg-white text-graphite";
    if (value >= 4) return "border-neon-green/35 bg-neon-green/15 text-neon-green";
    if (value >= 3) return "border-amber/35 bg-amber/15 text-amber";
    return "border-red-400/35 bg-red-500/15 text-red-100";
  }

  function barColor(value: number) {
    if (!value) return "#f7fbf6";
    if (value >= 4) return "#8cff6a";
    if (value >= 3) return "#ffb654";
    return "#ff5b5b";
  }

  function updateRating(category: CategoryKey, skillId: string, value: Rating) {
    setDraft((current) => ({
      ...current,
      skillScores: { ...current.skillScores, [category]: { ...current.skillScores[category], [skillId]: value } },
      touchedSkills: { ...(current.touchedSkills ?? {}), [touchedKey(category, skillId)]: true }
    }));
  }

  function toggleNote(category: CategoryKey, note: string) {
    setDraft((current) => {
      const exists = current.notes[category].includes(note);
      return { ...current, notes: { ...current.notes, [category]: exists ? current.notes[category].filter((item) => item !== note) : [...current.notes[category], note] } };
    });
  }

  return (
    <section className="space-y-4 pb-28">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/logo/app-logo-icon.png" alt="Coach Faisal Padel Performance Lab logo" className="h-12 w-12 rounded-2xl border border-amber/30 object-cover shadow-glow" />
          <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber">{t.evaluation.eyebrow}</p>
          <h1 className="text-2xl font-black text-ivory">{t.evaluation.title}</h1>
          </div>
        </div>
        <div className="rounded-xl border border-line bg-white/[0.045] px-4 py-2 text-right">
          <p className="text-3xl font-black text-amber">{finalScore}</p>
          <p className="text-xs text-ivory/50">{t.levels[level as keyof typeof t.levels]}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-panel/80 p-4 shadow-blueglow">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-black text-ivory">{t.evaluation.setup}</h2>
          <button onClick={toggleLanguage} className="rounded-full border border-line bg-ivory/10 px-3 py-2 text-xs font-black text-ivory">{t.languageToggle}</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-ivory/45">{t.evaluation.mode}</span>
            <select value={draft.evaluationType} onChange={(event) => setDraft({ ...draft, evaluationType: event.target.value as "match" | "session" })} className="h-11 w-full rounded-lg border border-line bg-black/25 px-3 text-ivory">
              <option value="match">{t.evaluation.match}</option>
              <option value="session">{t.evaluation.session}</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-ivory/45">{t.evaluation.context}</span>
            <select value={draft.matchType} onChange={(event) => setDraft({ ...draft, matchType: event.target.value as MatchType })} className="h-11 w-full rounded-lg border border-line bg-black/25 px-3 text-ivory">
              <option>Friendly</option>
              <option>Competitive</option>
              <option>Tournament</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-ivory/45">{t.evaluation.player}</span>
            <select value={draft.playerIds[0] ?? ""} onChange={(event) => setDraft({ ...draft, playerIds: [event.target.value] })} className="h-11 w-full rounded-lg border border-line bg-black/25 px-3 text-ivory">
              {data.players.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}
            </select>
          </label>
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
            if (name) {
              const player = onAddPlayer(name);
              setDraft((current) => ({ ...current, playerIds: [player.id] }));
            }
            event.currentTarget.reset();
          }}
        >
          <input name="name" className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-black/25 px-3 text-ivory outline-none focus:border-volt/60" placeholder={t.evaluation.addPlayer} />
          <Button type="submit" variant="secondary"><UserPlus size={18} /></Button>
        </form>
      </div>

      <div className="space-y-3">
        {categories.map((category) => {
          const completed = category.skills.every((skill) => draft.touchedSkills?.[touchedKey(category.key, skill.id)]);
          const anyTouched = category.skills.some((skill) => draft.touchedSkills?.[touchedKey(category.key, skill.id)]);
          const categoryAverage = Object.values(draft.skillScores[category.key]).reduce((sum, value) => sum + value, 0) / category.skills.length;
          return (
            <div key={category.key} className="overflow-hidden rounded-2xl border border-line bg-panel/80 transition hover:border-amber/40">
              <button onClick={() => setOpen(open === category.key ? null : category.key)} className={clsx("flex w-full items-center justify-between gap-3 p-4", isArabic ? "text-right" : "text-left")}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.accent }} />
                    <h2 className="font-black text-ivory">{isArabic ? category.labelAr : category.label}</h2>
                    {completed && <ClipboardCheck className="text-amber" size={16} />}
                  </div>
                  <p className="mt-1 text-xs text-ivory/50">{isArabic ? category.philosophyAr : category.philosophy}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={clsx("rounded-full border px-3 py-1 text-sm font-black", scoreTone(categoryAverage, anyTouched))}>{scores[category.key]}/{category.weight}</span>
                  <ChevronDown className={clsx("text-ivory/50 transition", open === category.key && "rotate-180")} />
                </div>
              </button>
              {open === category.key && (
                <div className="space-y-5 border-t border-line p-4">
                  {category.skills.map((skill) => {
                    const value = draft.skillScores[category.key][skill.id];
                    const touched = Boolean(draft.touchedSkills?.[touchedKey(category.key, skill.id)]);
                    return (
                      <label key={skill.id} className="block">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-ivory">{isArabic ? skill.nameAr : skill.name}</span>
                          <span className={clsx("rounded-md border px-2 py-1 text-xs font-bold", scoreTone(value, touched))}>{touched ? `${value} • ${isArabic ? ratingLabelsAr[value] : ratingLabels[value]}` : isArabic ? "غير مقيّم" : "Not rated"}</span>
                        </div>
                        <input min={1} max={5} step={1} value={value} type="range" onChange={(event) => updateRating(category.key, skill.id, Number(event.target.value) as Rating)} className="w-full" style={{ accentColor: touched ? barColor(value) : "#f7fbf6" }} />
                      </label>
                    );
                  })}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-ivory/45">{t.evaluation.suggestedNotes}</p>
                    <div className="flex flex-wrap gap-2">
                      {(isArabic ? suggestedNotesAr[category.key] : suggestedNotes[category.key]).map((note) => (
                        <button key={note} onClick={() => toggleNote(category.key, note)} className={clsx("rounded-full border px-3 py-2 text-left text-xs font-semibold transition", draft.notes[category.key].includes(note) ? "border-volt bg-volt/15 text-amber" : "border-line bg-white/[0.04] text-ivory/65")}>{note}</button>
                      ))}
                    </div>
                  </div>
                  <textarea value={draft.manualNotes[category.key]} onChange={(event) => setDraft({ ...draft, manualNotes: { ...draft.manualNotes, [category.key]: event.target.value } })} className="min-h-24 w-full rounded-xl border border-line bg-black/25 p-3 text-sm text-ivory outline-none focus:border-volt/60" placeholder={t.evaluation.manualInsight} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-graphite/95 p-3 backdrop-blur md:left-72">
        <div className="mx-auto flex max-w-5xl gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => { onSaveDraft(draft); window.alert(t.evaluation.draftSaved); }}><Save size={18} /> {t.evaluation.saveDraft}</Button>
          <Button className="flex-1" disabled={!draft.playerIds.length} onClick={() => onFinalize(draft)}><FileCheck2 size={18} /> {t.evaluation.generate}</Button>
        </div>
      </div>
    </section>
  );
}
