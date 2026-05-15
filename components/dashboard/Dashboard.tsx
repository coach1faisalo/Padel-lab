"use client";

import { Activity, BarChart3, ClipboardPlus, Search, Target, Trophy, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { MetricCard } from "@/components/ui/MetricCard";
import { useLanguage } from "@/hooks/use-language";
import type { AppData } from "@/lib/types";

export function Dashboard({ data, onNewEvaluation, onSelectEvaluation, onSelectPlayer, search, onSearch }: { data: AppData; onNewEvaluation: () => void; onSelectEvaluation: (id: string) => void; onSelectPlayer: (playerId: string) => void; search: string; onSearch: (value: string) => void }) {
  const { language, t, toggleLanguage } = useLanguage();
  const isArabic = language === "ar";
  const average = data.evaluations.length ? Math.round(data.evaluations.reduce((sum, evaluation) => sum + evaluation.finalScore, 0) / data.evaluations.length) : 0;
  const commonLevel = data.evaluations[0]?.level ? t.levels[data.evaluations[0].level as keyof typeof t.levels] : "No data";
  const filteredPlayers = data.players.filter((player) => player.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="space-y-5 pb-24">
      <div className="relative isolate min-h-[286px] overflow-hidden rounded-[1.875rem] border border-neon-green/20 bg-[radial-gradient(circle_at_82%_18%,rgba(140,255,106,0.22),transparent_26%),radial-gradient(circle_at_18%_24%,rgba(56,223,255,0.15),transparent_28%),linear-gradient(135deg,rgba(12,29,35,0.96),rgba(5,9,14,0.94))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.42),0_0_70px_rgba(56,223,255,0.12),inset_0_1px_0_rgba(255,255,255,0.10)]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(115deg,transparent_0_38%,rgba(56,223,255,0.12)_39%,transparent_41%_100%),repeating-linear-gradient(90deg,transparent_0_26px,rgba(255,255,255,0.035)_27px_28px)] opacity-55" />
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/logo/app-logo-icon.png" alt="Coach Faisal Padel Performance Lab logo" className="h-12 w-12 rounded-2xl border border-amber/30 object-cover shadow-glow" />
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber">{t.dashboard.eyebrow}</p>
          </div>
          <button onClick={toggleLanguage} className="rounded-full border border-line bg-ivory/10 px-3 py-2 text-xs font-black text-ivory">{t.languageToggle}</button>
        </div>
        <h1 className="mt-2 max-w-3xl text-4xl font-black leading-none tracking-[-0.03em] text-ivory md:text-5xl">{t.dashboard.title}</h1>
        <p className="mt-1 text-xl font-black text-ivory/85" dir="rtl">كوتش فيصل بادل لاب</p>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ivory/65">{t.dashboard.subtitle}</p>
        <Button className="mt-5 w-full sm:w-auto" onClick={onNewEvaluation}>
          <ClipboardPlus size={18} /> {t.dashboard.newEvaluation}
        </Button>
        <div className="absolute inset-x-5 bottom-4 hidden border-t border-ivory/10 pt-3 text-[10px] font-black uppercase tracking-[0.24em] text-ivory/35 sm:block">
          Performance Lab / Tactical Intelligence / Net Control
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" dir={isArabic ? "rtl" : "ltr"}>
        <MetricCard label={t.dashboard.totalEvaluations} value={data.evaluations.length} icon={BarChart3} tone="cyan" />
        <MetricCard label={t.dashboard.activePlayers} value={data.players.length} icon={Users} />
        <MetricCard label={t.dashboard.averageScore} value={average || "--"} icon={Target} tone="amber" />
        <MetricCard label={t.dashboard.commonLevel} value={commonLevel} icon={Trophy} tone="white" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-line bg-panel/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-ivory">{t.dashboard.recentEvaluations}</h2>
            <Activity className="text-volt" size={18} />
          </div>
          {data.evaluations.length ? (
            <div className="space-y-3">
              {data.evaluations.slice(0, 5).map((evaluation) => (
                <button key={evaluation.id} onClick={() => onSelectEvaluation(evaluation.id)} className="w-full rounded-xl border border-line bg-white/[0.04] p-4 text-left transition hover:border-volt/40 hover:bg-white/[0.07]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-ivory">{data.players.find((player) => player.id === evaluation.playerIds[0])?.name ?? "Unknown Player"}</p>
                      <p className="text-xs text-ivory/50">{evaluation.evaluationType === "match" ? evaluation.matchType : t.misc.trainingSession} • {new Date(evaluation.createdAt).toLocaleDateString(isArabic ? "ar-KW" : "en-US")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-volt">{evaluation.finalScore}</p>
                      <p className="text-xs text-ivory/50">{t.levels[evaluation.level as keyof typeof t.levels]}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState icon={ClipboardPlus} title={t.dashboard.noEvaluations} body={t.dashboard.noEvaluationsBody} />
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-line bg-panel/80 p-4">
            <h2 className="mb-3 text-lg font-black text-ivory">{t.dashboard.playerSearch}</h2>
            <label className="relative block">
              <Search className={isArabic ? "absolute right-3 top-3 text-ivory/40" : "absolute left-3 top-3 text-ivory/40"} size={18} />
              <input value={search} onChange={(event) => onSearch(event.target.value)} className={isArabic ? "h-11 w-full rounded-lg border border-line bg-black/25 pl-3 pr-10 text-sm text-ivory outline-none focus:border-volt/60" : "h-11 w-full rounded-lg border border-line bg-black/25 pl-10 pr-3 text-sm text-ivory outline-none focus:border-volt/60"} placeholder={t.dashboard.searchPlaceholder} />
            </label>
            <div className="mt-3 space-y-2">
              {filteredPlayers.slice(0, 5).map((player) => (
                <button key={player.id} onClick={() => onSelectPlayer(player.id)} className="group flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-white/[0.04] px-3 py-3 text-sm font-semibold text-ivory/80 transition hover:border-amber/35 hover:bg-white/[0.07]">
                  <span className="flex items-center gap-2">
                    <UserRound size={16} className="text-amber" />
                    {player.name}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-ivory/35 group-hover:text-amber">{data.evaluations.some((evaluation) => evaluation.playerIds.includes(player.id)) ? t.report.eyebrow : t.evaluation.generate}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-panel/80 p-4">
            <h2 className="text-lg font-black text-ivory">{t.dashboard.insightTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-ivory/60">{t.dashboard.insightBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
