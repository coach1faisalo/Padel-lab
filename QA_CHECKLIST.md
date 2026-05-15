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
- PDF export is wired through `html2canvas` and `jspdf`.
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

## Manual Testing Recommended

- Test on an actual iPhone viewport in Safari.
- Generate a PDF on mobile Safari and desktop Chrome.
- Refresh after saving a draft and confirm the draft remains.
- Refresh after generating a report and confirm history remains.
- Add several players and confirm the selected player appears in new evaluations.
- Run `npm run build` before Vercel deployment.
