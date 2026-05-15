import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white/[0.035] p-6 text-center shadow-blueglow backdrop-blur-xl">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/8 text-amber">
        <Icon size={21} />
      </div>
      <h3 className="font-bold text-ivory">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-ivory/55">{body}</p>
    </div>
  );
}
