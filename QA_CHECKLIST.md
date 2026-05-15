# QA Checklist

## Checked in MVP

- Scoring categories match required weights.
- Skill ratings use 1-5 scale.
- Category score calculation uses equal internal skill weighting.
- Final score sums weighted category scores to 100.
- Player level thresholds match the specification.
- Playing style is detected from category and skill score patterns.
- Suggested notes are selectable per category.
- Manual notes are stored in draft and report justifications.
- Draft save persists to localStorage.
- Final evaluation persists to localStorage.
- Report page renders final score, level, style, summary, breakdown, radar chart, strengths, development areas, priorities, coaching insight, and roadmap.
- PDF export is wired through a structured `jspdf` template.
- Empty/no-report state exists.
- Mobile bottom navigation exists.
- Desktop sidebar navigation exists.
- TypeScript models are centralized for future backend migration.

## V2 Upgrade Checks

- Logo assets added to `public/logo`.
- Favicon and mobile icon generated from the logo.
- Navbar branding uses the real logo.
- Mobile dashboard hero includes logo branding.
- Arabic brand uses `كوتش فيصل بادل لاب`.
- Removed all uses of `مختبر`.
- Language provider added.
- English and Arabic dictionaries added.
- Language toggle persists locally.
- Arabic sets RTL direction.
- English sets LTR direction.
- Dashboard, players, evaluation, and report screens consume translations.
- Category and skill labels include Arabic equivalents.
- Clay-court sports-tech palette applied to Tailwind tokens.
- Preview page updated for immediate visual review.

## Product Fix Checks

- Dashboard player search routes intelligently: latest report if available, evaluation flow if no report exists.
- Players page supports add, edit, delete, and protected delete confirmation with localStorage persistence.
- Evaluation drafts auto-save sliders, selected notes, manual notes, selected player, and touched scoring state.
- Suggested coaching notes are stored with stable note keys so selections survive Arabic/English switching, route changes, and refreshes.
- Evaluation scoring indicators use white for untouched skills, green for strong, amber for medium, and red for weak.
- Reports page includes searchable player/report selection and no-report fallback actions.
- Reports page includes a player report dropdown and recent reports strip for faster mobile switching.
- PDF export no longer uses screenshot capture.
- PDF export respects selected report language: Arabic, English, or bilingual.
- PDF export includes logo, coach branding, current date, player name, evaluation type, match context, category score bars, roadmap, footer branding, and a structured radar chart.
- PDF export embeds `public/fonts/SFArabic.ttf` for more reliable Arabic rendering in production browsers.
- Report generation now considers selected coach observations in addition to category and skill score patterns.
- Logo appears on dashboard, players, evaluation, reports, and structured PDF export.

## Manual Testing Recommended

- Test on an actual iPhone viewport in Safari.
- Generate a PDF on mobile Safari and desktop Chrome.
- Refresh after saving a draft and confirm the draft remains.
- Refresh after generating a report and confirm history remains.
- Add several players and confirm the selected player appears in new evaluations.
- Run `npm run build` before Vercel deployment.
- Run `npm run typecheck` before deployment when Node/npm dependencies are installed.
- Export Arabic PDFs on the target browser and confirm Arabic glyph shaping meets brand quality.
