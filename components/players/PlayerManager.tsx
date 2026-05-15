"use client";

import { Edit3, Plus, Trash2, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/use-language";
import type { Evaluation, Player } from "@/lib/types";

export function PlayerManager({
  players,
  evaluations,
  onAddPlayer,
  onUpdatePlayer,
  onDeletePlayer,
  onSelectPlayer
}: {
  players: Player[];
  evaluations: Evaluation[];
  onAddPlayer: (name: string) => Player;
  onUpdatePlayer: (playerId: string, name: string) => void;
  onDeletePlayer: (playerId: string) => void;
  onSelectPlayer: (playerId: string) => void;
}) {
  const { language, t } = useLanguage();
  const isArabic = language === "ar";
  const [editing, setEditing] = useState<Player | null>(null);
  const [deleting, setDeleting] = useState<Player | null>(null);

  function playerEvaluationCount(playerId: string) {
    return evaluations.filter((evaluation) => evaluation.playerIds.includes(playerId)).length;
  }

  return (
    <section className="space-y-4 pb-24">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-panel/75 p-4 shadow-blueglow">
        <img src="/logo/app-logo-icon.png" alt="Coach Faisal Padel Performance Lab logo" className="h-12 w-12 rounded-2xl border border-amber/30 object-cover shadow-glow" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber">{t.players.eyebrow}</p>
          <h1 className="text-2xl font-black text-ivory">{t.players.title}</h1>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const name = String(form.get("name") ?? "").trim();
          if (name) onAddPlayer(name);
          event.currentTarget.reset();
        }}
        className="rounded-2xl border border-line bg-panel/80 p-4"
      >
        <label className="text-sm font-semibold text-ivory/70">{t.players.quickCreate}</label>
        <div className="mt-3 flex gap-2">
          <input name="name" required className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-black/25 px-3 text-ivory outline-none focus:border-volt/60" placeholder={t.players.placeholder} />
          <Button type="submit" className="px-3"><Plus size={18} /></Button>
        </div>
      </form>
      <div className="grid gap-3 sm:grid-cols-2">
        {players.map((player) => (
          <div key={player.id} className="group rounded-2xl border border-line bg-gradient-to-b from-white/[0.06] to-white/[0.025] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5 hover:border-cyan/35">
            <button onClick={() => onSelectPlayer(player.id)} className={isArabic ? "block w-full text-right" : "block w-full text-left"}>
              <UserRound className="mb-3 text-volt" size={20} />
              <p className="text-lg font-black text-ivory">{player.name}</p>
              <p className="text-xs text-ivory/45">{t.players.created} {new Date(player.createdAt).toLocaleDateString(language === "ar" ? "ar-KW" : "en-US")}</p>
              <p className="mt-3 rounded-full border border-line bg-black/20 px-3 py-2 text-xs font-bold text-ivory/60">
                {playerEvaluationCount(player.id) ? `${playerEvaluationCount(player.id)} ${language === "ar" ? "تقييم" : "evaluations"}` : language === "ar" ? "لا يوجد تقييم بعد - ابدأ الآن" : "No evaluation yet - start now"}
              </p>
            </button>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setEditing(player)} className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-white/[0.04] text-xs font-black text-ivory/70 transition hover:border-amber/35 hover:text-amber">
                <Edit3 size={15} /> {language === "ar" ? "تعديل" : "Edit"}
              </button>
              <button onClick={() => setDeleting(player)} className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 text-xs font-black text-red-100 transition hover:border-red-300/45">
                <Trash2 size={15} /> {language === "ar" ? "حذف" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-40 grid place-items-end bg-black/60 p-4 backdrop-blur-sm sm:place-items-center">
          <form
            className="w-full max-w-md rounded-3xl border border-line bg-graphite p-5 shadow-[0_24px_90px_rgba(0,0,0,0.55)]"
            onSubmit={(event) => {
              event.preventDefault();
              const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
              if (name) onUpdatePlayer(editing.id, name);
              setEditing(null);
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-ivory">{language === "ar" ? "تعديل اللاعب" : "Edit Player"}</h2>
              <button type="button" onClick={() => setEditing(null)} className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white/[0.04] text-ivory/70"><X size={18} /></button>
            </div>
            <input name="name" defaultValue={editing.name} required autoFocus className="h-12 w-full rounded-xl border border-line bg-black/25 px-3 text-ivory outline-none focus:border-amber/60" />
            <Button type="submit" className="mt-4 w-full">{language === "ar" ? "حفظ التعديل" : "Save Changes"}</Button>
          </form>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-40 grid place-items-end bg-black/60 p-4 backdrop-blur-sm sm:place-items-center">
          <div className="w-full max-w-md rounded-3xl border border-red-400/20 bg-graphite p-5 shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            <h2 className="text-xl font-black text-ivory">{language === "ar" ? "تأكيد الحذف" : "Confirm Delete"}</h2>
            <p className="mt-2 text-sm leading-6 text-ivory/60">
              {language === "ar" ? `سيتم حذف ${deleting.name} وتقييماته المحلية من هذا الجهاز.` : `${deleting.name} and local evaluations for this player will be removed from this device.`}
            </p>
            <div className="mt-5 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setDeleting(null)}>{language === "ar" ? "إلغاء" : "Cancel"}</Button>
              <button
                onClick={() => {
                  onDeletePlayer(deleting.id);
                  setDeleting(null);
                }}
                className="flex h-11 flex-1 items-center justify-center rounded-xl bg-red-500/90 text-sm font-black text-white"
              >
                {language === "ar" ? "حذف" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
