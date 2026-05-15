"use client";

import { Plus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/use-language";
import type { Player } from "@/lib/types";

export function PlayerManager({ players, onAddPlayer }: { players: Player[]; onAddPlayer: (name: string) => void }) {
  const { language, t } = useLanguage();
  return (
    <section className="space-y-4 pb-24">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber">{t.players.eyebrow}</p>
        <h1 className="text-2xl font-black text-ivory">{t.players.title}</h1>
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
          <div key={player.id} className="rounded-xl border border-line bg-white/[0.045] p-4">
            <UserRound className="mb-3 text-volt" size={20} />
            <p className="font-bold text-ivory">{player.name}</p>
            <p className="text-xs text-ivory/45">{t.players.created} {new Date(player.createdAt).toLocaleDateString(language === "ar" ? "ar-KW" : "en-US")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
