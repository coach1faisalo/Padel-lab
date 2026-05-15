"use client";

import { Download, FileText, Lightbulb, Medal, Route, Search, ShieldCheck, Target, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from "recharts";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/use-language";
import { categories } from "@/lib/constants";
import type { Evaluation, Player } from "@/lib/types";

type ReportLanguage = "en" | "ar" | "both";

export function ReportView({
  evaluation,
  player,
  players = [],
  evaluations = [],
  onSelectEvaluation,
  onStartEvaluation
}: {
  evaluation: Evaluation | null;
  player: Player | undefined;
  players?: Player[];
  evaluations?: Evaluation[];
  onSelectEvaluation?: (evaluationId: string) => void;
  onStartEvaluation?: (playerId: string) => void;
}) {
  const { language, t, toggleLanguage } = useLanguage();
  const [reportLanguage, setReportLanguage] = useState<ReportLanguage>(() => {
    if (typeof window === "undefined") return language;
    return (window.localStorage.getItem("coach-faisal-padel-lab:report-language") as ReportLanguage | null) ?? language;
  });
  const [reportSearch, setReportSearch] = useState("");
  const showEnglish = reportLanguage === "en" || reportLanguage === "both";
  const showArabic = reportLanguage === "ar" || reportLanguage === "both";
  const reportOptions = useMemo(() => {
    return players
      .map((item) => {
        const latest = evaluations
          .filter((current) => current.playerIds.includes(item.id))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        return { player: item, latest };
      })
      .filter(({ player: item }) => item.name.toLowerCase().includes(reportSearch.toLowerCase()));
  }, [evaluations, players, reportSearch]);

  useEffect(() => {
    window.localStorage.setItem("coach-faisal-padel-lab:report-language", reportLanguage);
  }, [reportLanguage]);

  if (!evaluation || !player) {
    return (
      <section className="space-y-4 pb-24">
        <div className="rounded-2xl border border-line bg-panel/80 p-6 text-center">
          <FileText className="mx-auto mb-3 text-volt" />
          <h1 className="text-xl font-black text-ivory">{t.report.noReport}</h1>
          <p className="mt-2 text-sm text-ivory/55">{t.report.noReportBody}</p>
        </div>
        <ReportSelector reportOptions={reportOptions} selectedId={null} search={reportSearch} onSearch={setReportSearch} onSelectEvaluation={onSelectEvaluation} onStartEvaluation={onStartEvaluation} />
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
    if (!evaluation || !player) return;
    const currentEvaluation = evaluation;
    const currentPlayer = player;
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF("p", "mm", "a4");
    if (showArabic) await registerArabicPdfFont(pdf);
    const bodyFont = showArabic ? "SFArabic" : "helvetica";
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 16;
    let y = 18;
    const isPdfArabic = reportLanguage === "ar";
    const align = isPdfArabic ? "right" : "left";
    const textX = isPdfArabic ? pageWidth - margin : margin;
    const decoratePage = () => {
      pdf.setFillColor(5, 8, 13);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      pdf.setFillColor(247, 251, 246);
      pdf.roundedRect(8, 8, pageWidth - 16, pageHeight - 16, 4, 4, "F");
      pdf.setDrawColor(227, 107, 55);
      pdf.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);
      pdf.setFont(bodyFont, showArabic ? "normal" : "bold");
      pdf.setFontSize(7.5);
      pdf.setTextColor(80, 90, 90);
      pdf.text("Coach Faisal Padel Performance Lab / كوتش فيصل بادل لاب", pageWidth / 2, pageHeight - 8, { align: "center" });
    };

    const addText = (text: string, size = 10, color: [number, number, number] = [38, 38, 38], bold = false) => {
      pdf.setFont(bodyFont, showArabic ? "normal" : bold ? "bold" : "normal");
      pdf.setFontSize(size);
      pdf.setTextColor(...color);
      const lines = pdf.splitTextToSize(text, pageWidth - margin * 2);
      lines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          pdf.addPage();
          decoratePage();
          y = 18;
        }
        pdf.text(line, textX, y, { align });
        y += size * 0.48 + 2.2;
      });
    };
    const addSection = (english: string, arabic: string) => {
      y += 4;
      pdf.setFillColor(11, 21, 26);
      pdf.roundedRect(margin, y - 6, pageWidth - margin * 2, 10, 2, 2, "F");
      addText(reportTitle(english, arabic), 12, [227, 107, 55], true);
      y += 2;
    };
    const addBullets = (items: string[]) => {
      items.forEach((item) => addText(`• ${item}`, 9.5, [62, 62, 62]));
    };

    decoratePage();
    try {
      const logo = await imageToDataUrl("/logo/app-logo-icon.png");
      pdf.addImage(logo, "PNG", margin, 14, 18, 18);
    } catch {
      pdf.setFillColor(227, 107, 55);
      pdf.circle(margin + 9, 23, 8, "F");
    }
    pdf.setTextColor(8, 17, 22);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Coach Faisal Padel Performance Lab", margin + 23, 22);
    pdf.setFontSize(9);
    pdf.setTextColor(130, 95, 50);
    pdf.setFont(bodyFont, "normal");
    pdf.text("كوتش فيصل بادل لاب", margin + 23, 28);
    pdf.setTextColor(85, 95, 95);
    pdf.text(new Date().toLocaleDateString(reportLanguage === "ar" ? "ar-KW" : "en-US"), pageWidth - margin, 22, { align: "right" });
    y = 42;

    pdf.setFillColor(11, 21, 26);
    pdf.roundedRect(margin, y, pageWidth - margin * 2, 42, 4, 4, "F");
    pdf.setTextColor(255, 182, 84);
    pdf.setFont(bodyFont, showArabic ? "normal" : "bold");
    pdf.setFontSize(12);
    pdf.text(reportTitle("Final Score", "الدرجة النهائية"), textX, y + 10, { align });
    pdf.setFontSize(34);
    pdf.text(String(currentEvaluation.finalScore), textX, y + 28, { align });
    pdf.setFontSize(10);
    pdf.setTextColor(247, 251, 246);
    const evaluationType = currentEvaluation.evaluationType === "match" ? reportTitle("Match Evaluation", "تقييم مباراة") : reportTitle("Session Evaluation", "تقييم تدريب");
    pdf.text(`${currentPlayer.name}  •  ${evaluationType}  •  ${currentEvaluation.matchType}`, textX, y + 34, { align });
    pdf.text(`${reportTitle(currentEvaluation.level, t.levels[currentEvaluation.level as keyof typeof t.levels])}  •  ${reportTitle(currentEvaluation.style, t.styles[currentEvaluation.style as keyof typeof t.styles])}`, textX, y + 39, { align });
    y += 54;

    addSection("Performance Summary", "ملخص الأداء");
    if (showArabic) addText(`ملف اللاعب الحالي يظهر كـ ${t.styles[currentEvaluation.style as keyof typeof t.styles]}. أقوى المؤشرات هي ${strongestCategories.map(({ category }) => category.labelAr).join(" و")}، والقفزة القادمة تعتمد على رفع جودة ${weakestCategories[0].category.labelAr} تحت الضغط.`, 10, [45, 45, 45]);
    if (showEnglish) addText(currentEvaluation.reportData.generatedSummary, 10, [45, 45, 45]);

    addSection("Performance Breakdown", "تفصيل الأداء");
    categories.forEach((category) => {
      pdf.setDrawColor(220, 220, 220);
      pdf.setFillColor(238, 240, 238);
      pdf.roundedRect(margin, y, pageWidth - margin * 2, 9, 2, 2, "F");
      pdf.setFillColor(...hexToRgb(category.accent));
      pdf.roundedRect(margin, y, (pageWidth - margin * 2) * (currentEvaluation.categoryScores[category.key] / category.weight), 9, 2, 2, "F");
      pdf.setFont(bodyFont, "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(8, 17, 22);
      pdf.text(`${categoryLabel(category)}: ${currentEvaluation.categoryScores[category.key]} / ${category.weight}`, textX, y + 6.2, { align });
      y += 13;
    });

    addSection("Strengths", "نقاط القوة");
    if (showArabic) addBullets(arabicStrengths.length ? arabicStrengths : [t.misc.strongBaseline, t.misc.coachability, t.misc.competitiveAwareness]);
    if (showEnglish) addBullets(currentEvaluation.reportData.strengths.length ? currentEvaluation.reportData.strengths : ["Strong baseline control", "High coachability", "Competitive awareness"]);

    addSection("Development Areas", "مناطق التطوير");
    if (showArabic) addBullets(arabicWeaknesses);
    if (showEnglish) addBullets(currentEvaluation.reportData.weaknesses);

    addSection("Training Priorities", "أولويات التدريب");
    if (showArabic) addBullets(weakestCategories.map(({ category }) => arabicPriorities[category.key]));
    if (showEnglish) addBullets(currentEvaluation.reportData.trainingPriorities);

    addSection("4-Week Roadmap", "خطة ٤ أسابيع");
    if (showArabic) {
      addText(`الأسبوع ١-٢: قاعدة الحركة: ${arabicPriorities[weakestCategories[0].category.key]}.`, 10);
      addText(`الأسبوع ٣-٤: طبقة الضغط: ${arabicPriorities[weakestCategories[1]?.category.key ?? weakestCategories[0].category.key]}.`, 10);
      addText("أفضل أداء يظهر عندما يبقى الإيقاع تحت السيطرة قرب الشبكة. الوعي يجب أن يسبق الهجوم العشوائي.", 10, [120, 78, 40], true);
    }
    if (showEnglish) {
      addText(`Week 1-2: ${currentEvaluation.reportData.roadmap.weekOneTwo}`, 10);
      addText(`Week 3-4: ${currentEvaluation.reportData.roadmap.weekThreeFour}`, 10);
      addText(currentEvaluation.reportData.coachingInsight, 10, [120, 78, 40], true);
    }

    if (y > pageHeight - 46) {
      pdf.addPage();
      decoratePage();
      y = 18;
    }
    drawPdfRadar(pdf, currentEvaluation, reportLanguage, margin, y + 5, pageWidth - margin * 2, 56);
    pdf.save(`${currentPlayer.name.replace(/\s+/g, "-").toLowerCase()}-padel-report.pdf`);
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

      <ReportSelector reportOptions={reportOptions} selectedId={evaluation.id} search={reportSearch} onSearch={setReportSearch} onSelectEvaluation={onSelectEvaluation} onStartEvaluation={onStartEvaluation} />

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

function ReportSelector({
  reportOptions,
  selectedId,
  search,
  onSearch,
  onSelectEvaluation,
  onStartEvaluation
}: {
  reportOptions: { player: Player; latest?: Evaluation }[];
  selectedId: string | null;
  search: string;
  onSearch: (value: string) => void;
  onSelectEvaluation?: (evaluationId: string) => void;
  onStartEvaluation?: (playerId: string) => void;
}) {
  const { language } = useLanguage();
  const reports = reportOptions
    .filter((option): option is { player: Player; latest: Evaluation } => Boolean(option.latest))
    .sort((a, b) => new Date(b.latest.createdAt).getTime() - new Date(a.latest.createdAt).getTime());
  return (
    <div className="rounded-2xl border border-line bg-panel/80 p-4 shadow-blueglow">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber">{language === "ar" ? "اختيار التقرير" : "Report Selector"}</p>
          <h2 className="text-lg font-black text-ivory">{language === "ar" ? "اختر لاعبًا أو تقريرًا" : "Choose a player or report"}</h2>
        </div>
        <Search className="text-cyan" size={18} />
      </div>
      <select
        value={selectedId ?? ""}
        onChange={(event) => event.target.value && onSelectEvaluation?.(event.target.value)}
        className="mb-3 h-11 w-full rounded-xl border border-line bg-black/25 px-3 text-sm font-bold text-ivory outline-none focus:border-amber/60"
      >
        <option value="">{language === "ar" ? "اختر أحدث تقرير" : "Select latest report"}</option>
        {reports.map(({ player, latest }) => (
          <option key={latest.id} value={latest.id}>{player.name} - {latest.finalScore}/100</option>
        ))}
      </select>
      <input value={search} onChange={(event) => onSearch(event.target.value)} className="h-11 w-full rounded-xl border border-line bg-black/25 px-3 text-sm text-ivory outline-none focus:border-cyan/60" placeholder={language === "ar" ? "ابحث عن لاعب" : "Search player"} />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {reportOptions.slice(0, 8).map(({ player, latest }) => (
          <button
            key={player.id}
            onClick={() => latest ? onSelectEvaluation?.(latest.id) : onStartEvaluation?.(player.id)}
            className={`rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${latest?.id === selectedId ? "border-amber/60 bg-amber/15" : "border-line bg-white/[0.04] hover:border-cyan/35"}`}
          >
            <p className="font-black text-ivory">{player.name}</p>
            <p className="mt-1 text-xs text-ivory/50">
              {latest ? `${latest.finalScore}/100 • ${new Date(latest.createdAt).toLocaleDateString(language === "ar" ? "ar-KW" : "en-US")}` : language === "ar" ? "لا يوجد تقييم - ابدأ تقييمًا" : "No report - start evaluation"}
            </p>
          </button>
        ))}
      </div>
      {reports.length > 0 && (
        <div className="mt-4 border-t border-line pt-4">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-ivory/40">{language === "ar" ? "آخر التقارير" : "Recent Reports"}</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {reports.slice(0, 6).map(({ player, latest }) => (
              <button key={`recent-${latest.id}`} onClick={() => onSelectEvaluation?.(latest.id)} className={`min-w-[150px] rounded-xl border px-3 py-2 text-left text-xs transition ${latest.id === selectedId ? "border-amber/60 bg-amber/15 text-amber" : "border-line bg-white/[0.04] text-ivory/65"}`}>
                <span className="block font-black text-ivory">{player.name}</span>
                <span>{latest.finalScore}/100</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

async function imageToDataUrl(src: string) {
  const response = await fetch(src);
  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function registerArabicPdfFont(pdf: { addFileToVFS: (filename: string, data: string) => void; addFont: (filename: string, fontName: string, fontStyle: string) => void }) {
  const response = await fetch("/fonts/SFArabic.ttf");
  const fontData = arrayBufferToBase64(await response.arrayBuffer());
  pdf.addFileToVFS("SFArabic.ttf", fontData);
  pdf.addFont("SFArabic.ttf", "SFArabic", "normal");
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return window.btoa(binary);
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

type PdfDrawingContext = {
  setDrawColor: (...args: number[]) => void;
  setFillColor: (...args: number[]) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  circle: (x: number, y: number, r: number, style?: string) => void;
  text: (text: string, x: number, y: number, options?: { align?: "left" | "center" | "right" }) => void;
  setFontSize: (size: number) => void;
  setTextColor: (...args: number[]) => void;
};

function drawPdfRadar(pdf: PdfDrawingContext, evaluation: Evaluation, reportLanguage: ReportLanguage, x: number, y: number, width: number, height: number) {
  const cx = x + width / 2;
  const cy = y + height / 2 + 4;
  const radius = Math.min(width, height) * 0.34;
  const values = categories.map((category) => evaluation.categoryScores[category.key] / category.weight);
  const point = (ratio: number, index: number) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / values.length);
    return [cx + Math.cos(angle) * radius * ratio, cy + Math.sin(angle) * radius * ratio];
  };
  pdf.setDrawColor(210, 214, 212);
  for (let ring = 1; ring <= 4; ring += 1) {
    const ringRatio = ring / 4;
    categories.forEach((_, index) => {
      const [x1, y1] = point(ringRatio, index);
      const [x2, y2] = point(ringRatio, (index + 1) % categories.length);
      pdf.line(x1, y1, x2, y2);
    });
  }
  pdf.setDrawColor(227, 107, 55);
  values.forEach((value, index) => {
    const [x1, y1] = point(value, index);
    const [x2, y2] = point(values[(index + 1) % values.length], (index + 1) % values.length);
    pdf.line(x1, y1, x2, y2);
    pdf.circle(x1, y1, 1.2, "F");
  });
  pdf.setFontSize(7.5);
  pdf.setTextColor(55, 55, 55);
  categories.forEach((category, index) => {
    const label = reportLanguage === "ar" ? category.labelAr : category.label;
    const [lx, ly] = point(1.22, index);
    pdf.text(label, lx, ly, { align: "center" });
  });
}
