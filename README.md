# Coach Faisal Padel Performance Lab

Premium mobile-first sports-performance assessment web app for padel coaches.

## Product

Coach Faisal Padel Performance Lab helps coaches evaluate player performance during matches or training sessions, generate professional reports, and track player development locally.

Core philosophy: **Awareness > Random Aggression**

## MVP Features

- Mobile-first dashboard with coaching stats
- Player management and quick player creation
- Match and session evaluation modes
- Dynamic local-first draft preservation
- Weighted 100-point scoring engine
- 1-5 rating sliders for every skill
- Rule-based player level detection
- Rule-based playing style detection
- Suggested coaching note chips
- Manual coach insights
- Professional report page with radar chart
- Strengths, weaknesses, training priorities, and 4-week roadmap
- “Why This Score?” justifications
- PDF report export
- LocalStorage persistence
- Backend-ready typed data layer

## Scoring Framework

Categories:

- Technique: 20%
- Positioning: 40%
- Transition: 10%
- Fitness: 20%
- Tactics: 10%

Each skill is rated 1-5. Category skill averages are converted into weighted category scores, then summed to 100.

Player levels:

- 90-100: Advanced
- 85-89: Upper Intermediate
- 70-84: Intermediate
- 50-69: Lower Intermediate
- 0-49: Beginner

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- lucide-react
- recharts
- html2canvas
- jspdf
- localStorage

## File Structure

```txt
/app
  /page.tsx
  /layout.tsx
  /globals.css
/components
  /dashboard
  /evaluation
  /players
  /reports
  /ui
/lib
  /constants.ts
  /report-generator.ts
  /scoring.ts
  /storage.ts
  /types.ts
/data
  /sample-data.ts
/public
  /icons
  /logo
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## GitHub Upload

```bash
git init
git add .
git commit -m "Initial Coach Faisal Padel Performance Lab MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/coach-faisal-padel-performance-lab.git
git push -u origin main
```

## Vercel Deployment

1. Push the project to GitHub.
2. Open Vercel.
3. Create a new project from the GitHub repository.
4. Keep the default Next.js settings.
5. Deploy.

No environment variables are required for the MVP.

## Future Backend Migration

The app is intentionally separated into:

- `lib/types.ts` for data contracts
- `lib/scoring.ts` for scoring logic
- `lib/report-generator.ts` for report intelligence
- `lib/storage.ts` for persistence

To migrate later, replace `storage.ts` with API calls while keeping the UI and scoring utilities stable.
