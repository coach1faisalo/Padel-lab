"use client";

import { ClipboardPlus, FileText, Languages, LayoutDashboard, Settings, Users } from "lucide-react";
import { clsx } from "clsx";
import type { ReactNode } from "react";
import { useLanguage } from "@/hooks/use-language";

export type ViewKey = "dashboard" | "players" | "evaluation" | "report";

const navItems = [
  { key: "dashboard", label: "Dashboard", ar: "الرئيسية", icon: LayoutDashboard },
  { key: "players", label: "Players", ar: "اللاعبون", icon: Users },
  { key: "evaluation", label: "Evaluate", ar: "التقييم", icon: ClipboardPlus },
  { key: "report", label: "Reports", ar: "التقارير", icon: FileText }
] as const;

export function AppShell({ view, onView, children }: { view: ViewKey; onView: (view: ViewKey) => void; children: ReactNode }) {
  const { language, direction, t, toggleLanguage } = useLanguage();
  const isArabic = language === "ar";

  return (
    <div dir={direction} className="min-h-screen bg-graphite text-ivory">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-line bg-black/25 p-5 backdrop-blur md:block">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <img src="/logo/app-logo-icon.png" alt="Coach Faisal Padel Performance Lab logo" className="h-14 w-14 rounded-2xl border border-amber/30 object-cover shadow-glow" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber">Padel Lab</p>
              <h2 className="mt-1 text-xl font-black">{t.appNameShort}</h2>
              <p className="mt-1 text-sm font-semibold text-ivory/55" dir="rtl">كوتش فيصل بادل لاب</p>
            </div>
          </div>
          <button onClick={toggleLanguage} className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line bg-ivory/[0.06] text-sm font-black text-ivory shadow-inner">
            <Languages size={16} /> {t.languageToggle}
          </button>
        </div>
        <nav className="space-y-2 rounded-3xl border border-line bg-white/[0.035] p-2">
          {navItems.map((item) => (
            <button key={item.key} onClick={() => onView(item.key)} className={clsx("flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition", view === item.key ? "bg-ivory text-graphite shadow-[0_10px_30px_rgba(245,235,221,0.12)]" : "text-ivory/62 hover:bg-white/8 hover:text-ivory")}>
              <span className={clsx("flex h-9 w-9 items-center justify-center rounded-xl", view === item.key ? "bg-volt text-ivory" : "bg-white/[0.06] text-amber")}>
                <item.icon size={18} />
              </span>
              <span className="flex flex-col leading-tight">
                <span>{isArabic ? item.ar : item.label}</span>
                <span className="text-xs opacity-70" dir={isArabic ? "ltr" : "rtl"}>{isArabic ? item.label : item.ar}</span>
              </span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-line bg-court-green/35 p-4">
          <Settings className="mb-2 text-amber" size={18} />
          <p className="text-sm font-bold">{t.misc.backendReady}</p>
          <p className="mt-1 text-xs leading-5 text-ivory/50">{t.misc.backendBody}</p>
        </div>
      </aside>
      <main className="mx-auto max-w-6xl px-4 py-5 md:ml-72 md:px-6">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-graphite/95 px-2 py-1 backdrop-blur md:hidden">
        {navItems.map((item) => (
          <button key={item.key} onClick={() => onView(item.key)} className={clsx("flex h-[68px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-semibold", view === item.key ? "bg-ivory text-graphite" : "text-ivory/45")}>
            <item.icon size={19} className={view === item.key ? "text-volt" : ""} />
            <span>{isArabic ? item.ar : item.label}</span>
            <span dir={isArabic ? "ltr" : "rtl"}>{isArabic ? item.label : item.ar}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
