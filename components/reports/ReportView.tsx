"use client";

import { Download, FileText, Lightbulb, Medal, Route, ShieldCheck, Target, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from "recharts";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/use-language";
import { categories } from "@/lib/constants";
import type { Evaluation, Player } from "@/lib/types";

type ReportLanguage = "en" | "ar" | "both";

export function ReportView({ evaluation, player }: { evaluation: Evaluation | null; player: Player | undefined }) {
  const { language, t, toggleLanguage } = useLanguage();
  const [reportLanguage, setReportLanguage] = useState<ReportLanguage>(language);
  const showEnglish = reportLanguage === "en" || reportLanguage === "both";
  const showArabic = reportLanguage === "ar" || reportLanguage === "both";
  if (!evaluation || !player) {
    return (
      <section className="pb-24">
        <div className="rounded-2xl border border-line bg-panel/80 p-6 text-center">
          <FileText className="mx-auto mb-3 text-volt" />
          <h1 className="text-xl font-black text-ivory">{t.report.noReport}</h1>
          <p className="mt-2 text-sm text-ivory/55">{t.report.noReportBody}</p>
        </div>
      </section>
    );
  }

  const chartData = categories.map((category) => ({
    category: reportLanguage === "ar" ? category.labelAr : reportLanguage === "both" ? `${category.labelAr} / ${category.label}` : category.label,
    score: Math.round((evaluation.categoryScores[category.key] / category.weight) * 100)
  }));

  const categoryAverages = categories.map((category) => ({
    category,
    ratio: evaluation.categoryScores[category.key] / category.weight
  }));
  const strongestCategories = [...categoryAverages].sort((a, b) => b.ratio - a.ratio).slice(0, 2);
  const weakestCategories = [...categoryAverages].sort((a, b) => a.ratio - b.ratio).slice(0, 3);
  const arabicStrengths = strongestCategories
    .flatMap(({ category }) => category.skills.filter((skill) => evaluation.skillScores[category.key][skill.id] >= 4).slice(0, 2).map((skill) => skill.nameAr))
    .slice(0, 4);
  const arabicWeaknesses = weakestCategories.map(({ category }) => `تحسين ثبات ${category.labelAr} تحت الضغط`);
  const arabicPriorities: Record<string, string> = {
    technique: "تكرار تقني مع جودة تلامس أنظف",
    positioning: "تمركز الملعب والسيطرة على الشبكة وعادات العودة",
    transition: "سرعة أول خطوة وقرارات الانتقال",
    fitness: "حركة القدمين وسرعة الاستجابة والتحمل في الرالي",
    tactics: "اختيار الضربة وبناء النقطة والتنسيق مع الشريك"
  };
  const arabicJustifications = categories.reduce((acc, category) => {
    const highSkills = category.skills.filter((skill) => evaluation.skillScores[category.key][skill.id] >= 4);
    const lowSkills = category.skills.filter((skill) => evaluation.skillScores[category.key][skill.id] <= 2);
    acc[category.key] = [
      ...highSkills.slice(0, 2).map((skill) => `${skill.nameAr} تعتبر نقطة قوة حالية داخل ${category.labelAr}.`),
      ...lowSkills.slice(0, 2).map((skill) => `${skill.nameAr} تحتاج تكرارًا أكثر تحت الضغط.`),
      evaluation.manualNotes[category.key] ? `ملاحظة المدرب: ${evaluation.manualNotes[category.key]}` : category.philosophyAr
    ].slice(0, 3);
    return acc;
  }, {} as Record<string, string[]>);

  const reportTitle = (english: string, arabic: string) => showArabic && showEnglish ? `${arabic} / ${english}` : showArabic ? arabic : english;
  const categoryLabel = (category: (typeof categories)[number]) => showArabic && showEnglish ? `${category.labelAr} / ${category.label}` : showArabic ? category.labelAr : category.label;

  async function exportPdf() {
    if (!player) return;
    const element = document.getElementById("report-export");
    if (!element) return;
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
    const canvas = await html2canvas(element, { backgroundColor: "#0B1820", scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const height = (canvas.height * width) / canvas.width;
    let y = 0;
    pdf.addImage(imgData, "PNG", 0, y, width, height);
    while (height + y > pageHeight) {
      y -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, y, width, height);
    }
    pdf.save(`${player.name.replace(/\s+/g, "-").toLowerCase()}-padel-report.pdf`);
  }

  return (
    <section className="space-y-4 pb-24">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/logo/app-logo-icon.png" alt="Coach Faisal Padel Performance Lab logo" className="h-12 w-12 rounded-xl border border-amber/30 object-cover" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber">{t.report.eyebrow}</p>
            <h1 className="text-2xl font-black text-ivory">{player.name}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={toggleLanguage}>{t.languageToggle}</Button>
          <Button onClick={exportPdf}><Download size={18} /> {t.report.pdf}</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-line bg-white/[0.035] p-2">
        {[
          { key: "ar", label: "عربي" },
          { key: "en", label: "English" },
          { key: "both", label: "عربي + English" }
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => setReportLanguage(option.key as ReportLanguage)}
            className={reportLanguage === option.key ? "min-h-11 rounded-xl bg-ivory px-3 text-sm font-black text-graphite shadow-glow" : "min-h-11 rounded-xl border border-line bg-white/[0.04] px-3 text-sm font-bold text-ivory/70"}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div id="report-export" dir={reportLanguage === "ar" ? "rtl" : "ltr"} className="space-y-4 bg-graphite p-1 text-ivory">
        <div className="rounded-[1.75rem] border border-line bg-[radial-gradient(circle_at_top_right,rgba(56,223,255,0.16),transparent_30%),radial-gradient(circle_at_20%_10%,rgba(255,182,84,0.14),transparent_28%),rgba(7,16,20,0.94)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.42),0_0_48px_rgba(56,223,255,0.10)] backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-3 border-b border-line pb-4">
            <img src="/logo/app-logo-horizontal.png" alt="Coach Faisal Padel Performance Lab" className="h-12 max-w-[260px] rounded-lg object-cover" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber">{t.appName}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[1.5rem] border border-line bg-black/25 p-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <p className="text-xs uppercase tracking-[0.22em] text-ivory/45">{reportTitle("Final Score", "الدرجة النهائية")}</p>
              <p className="mt-2 text-7xl font-black tracking-[-0.06em] text-amber drop-shadow-[0_0_28px_rgba(255,182,84,0.28)]">{evaluation.finalScore}</p>
              <p className="text-ivory/55">/ 100</p>
              <div className="mt-5 grid grid-cols-2 gap-2 text-left">
                <Badge icon={Medal} label={reportTitle("Level", "المستوى")} value={reportTitle(evaluation.level, t.levels[evaluation.level as keyof typeof t.levels])} />
                <Badge icon={Target} label={reportTitle("Style", "أسلوب اللعب")} value={reportTitle(evaluation.style, t.styles[evaluation.style as keyof typeof t.styles])} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black">{reportTitle("Performance Summary", "ملخص الأداء")}</h2>
              {showArabic && <p className="mt-2 text-sm leading-6 text-ivory/65" dir="rtl">ملف اللاعب الحالي يظهر كـ {t.styles[evaluation.style as keyof typeof t.styles]}. أقوى المؤشرات هي {strongestCategories.map(({ category }) => category.labelAr).join(" و")}، والقفزة القادمة تعتمد على رفع جودة {weakestCategories[0].category.labelAr} تحت الضغط.</p>}
              {showEnglish && <p className="mt-2 text-sm leading-6 text-ivory/65">{evaluation.reportData.generatedSummary}</p>}
              <div className="mt-4 h-64 rounded-2xl border border-line bg-[radial-gradient(circle_at_center,rgba(56,223,255,0.08),rgba(0,0,0,0.22))] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={chartData}>
                    <PolarGrid stroke="rgba(245,235,221,0.18)" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: "rgba(245,235,221,0.72)", fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="score" stroke="#D9A45F" fill="#B86A3A" fillOpacity={0.34} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ReportPanel title={reportTitle("Performance Breakdown", "تفصيل الأداء")} icon={ShieldCheck}>
            {categories.map((category) => (
              <div key={category.key} className="mb-3 last:mb-0">
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold">{categoryLabel(category)}</span>
                  <span className="text-ivory/65">{evaluation.categoryScores[category.key]} / {category.weight}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full" style={{ width: `${(evaluation.categoryScores[category.key] / category.weight) * 100}%`, backgroundColor: category.accent }} />
                </div>
              </div>
            ))}
          </ReportPanel>

          <ReportPanel title={reportTitle("Why This Score?", "لماذا هذه الدرجة؟")} icon={Lightbulb}>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.key}>
                  <p className="text-sm font-bold text-ivory">{categoryLabel(category)}</p>
                  <ul className="mt-1 space-y-1 text-sm text-ivory/60">
                    {showArabic && arabicJustifications[category.key].map((item) => <li key={`ar-${item}`} dir="rtl">• {item}</li>)}
                    {showEnglish && evaluation.reportData.justifications[category.key].map((item) => <li key={`en-${item}`}>• {item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </ReportPanel>

          <ReportPanel title={reportTitle("Strengths", "نقاط القوة")} icon={Medal}>
            {showArabic && <List dir="rtl" items={arabicStrengths.length ? arabicStrengths : [t.misc.strongBaseline, t.misc.coachability, t.misc.competitiveAwareness]} />}
            {showEnglish && <List items={evaluation.reportData.strengths.length ? evaluation.reportData.strengths : ["Strong baseline control", "High coachability", "Competitive awareness"]} />}
          </ReportPanel>
          <ReportPanel title={reportTitle("Development Areas", "مناطق التطوير")} icon={Target}>
            {showArabic && <List dir="rtl" items={arabicWeaknesses} />}
            {showEnglish && <List items={evaluation.reportData.weaknesses} />}
          </ReportPanel>
          <ReportPanel title={reportTitle("Training Priorities", "أولويات التدريب")} icon={Route}>
            <ol className="space-y-2 text-sm text-ivory/65">
              {showArabic && weakestCategories.map(({ category }, index) => <li key={`ar-${category.key}`} dir="rtl"><span className="font-black text-volt">{index + 1}.</span> {arabicPriorities[category.key]}</li>)}
              {showEnglish && evaluation.reportData.trainingPriorities.map((item, index) => <li key={`en-${item}`}><span className="font-black text-volt">{index + 1}.</span> {item}</li>)}
            </ol>
          </ReportPanel>
          <ReportPanel title={reportTitle("4-Week Roadmap", "خطة ٤ أسابيع")} icon={FileText}>
            {showArabic && (
              <div dir="rtl">
                <p className="text-sm leading-6 text-ivory/65"><strong className="text-ivory">الأسبوع ١-٢:</strong> قاعدة الحركة: {arabicPriorities[weakestCategories[0].category.key]}.</p>
                <p className="mt-2 text-sm leading-6 text-ivory/65"><strong className="text-ivory">الأسبوع ٣-٤:</strong> طبقة الضغط: {arabicPriorities[weakestCategories[1]?.category.key ?? weakestCategories[0].category.key]}.</p>
                <p className="mt-3 rounded-xl border border-volt/20 bg-volt/10 p-3 text-sm leading-6 text-ivory/75">أفضل أداء يظهر عندما يبقى الإيقاع تحت السيطرة قرب الشبكة. الوعي يجب أن يسبق الهجوم العشوائي.</p>
              </div>
            )}
            {showEnglish && (
              <div>
                <p className="text-sm leading-6 text-ivory/65"><strong className="text-ivory">Week 1-2:</strong> {evaluation.reportData.roadmap.weekOneTwo}</p>
                <p className="mt-2 text-sm leading-6 text-ivory/65"><strong className="text-ivory">Week 3-4:</strong> {evaluation.reportData.roadmap.weekThreeFour}</p>
                <p className="mt-3 rounded-xl border border-volt/20 bg-volt/10 p-3 text-sm leading-6 text-ivory/75">{evaluation.reportData.coachingInsight}</p>
              </div>
            )}
          </ReportPanel>
        </div>
      </div>
    </section>
  );
}

function Badge({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-white/[0.04] p-3">
      <Icon className="mb-2 text-amber" size={17} />
      <p className="text-xs text-ivory/45">{label}</p>
      <p className="text-sm font-bold text-ivory">{value}</p>
    </div>
  );
}

function ReportPanel({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-panel/90 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="text-amber" size={18} />
        <h2 className="font-black text-ivory">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function List({ items, dir }: { items: string[]; dir?: "rtl" | "ltr" }) {
  return <ul dir={dir} className="space-y-2 text-sm text-ivory/65">{items.map((item) => <li key={item}>• {item}</li>)}</ul>;
}
