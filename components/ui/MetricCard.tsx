import type { LucideIcon } from "lucide-react";

export function MetricCard({ label, value, icon: Icon, tone = "volt" }: { label: string; value: string | number; icon: LucideIcon; tone?: "volt" | "cyan" | "amber" | "white" }) {
  const color = tone === "cyan" ? "text-cyan" : tone === "amber" ? "text-amber" : tone === "white" ? "text-ivory" : "text-volt";
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-white/[0.07] to-white/[0.025] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan/35">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,223,255,0.08),transparent_45%,rgba(140,255,106,0.06))]" />
      <div className={`relative mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 ${color}`}>
        <Icon size={18} />
      </div>
      <p className="relative text-xs uppercase tracking-[0.22em] text-ivory/45">{label}</p>
      <p className="relative mt-1 text-3xl font-black tracking-[-0.04em] text-ivory">{value}</p>
    </div>
  );
}
