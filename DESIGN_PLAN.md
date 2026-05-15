# Phase 1 Design Plan

## UX Flow

Dashboard -> Create Evaluation -> Add or select player -> Live accordion evaluation -> Save draft or generate report -> Report -> Player history.

The coach can complete the primary evaluation in 2-4 minutes by moving through category accordions and using 1-5 sliders, note chips, and optional manual notes.

## Screen Map

- Dashboard: brand header, quick action, stats cards, recent evaluations, insights, player search.
- Players: quick player creation, roster cards, creation dates.
- Evaluation: mode/context/player controls, dynamic player creation, category accordions, live score, draft save, final generation.
- Report: final score, level, style, summary, radar chart, weighted breakdown, strengths, weaknesses, priorities, justifications, 4-week roadmap, PDF export.
- Empty states: no report selected, no evaluations yet.

## Design System

- Visual style: dark sports-tech performance UI.
- Background: graphite, charcoal, matte black.
- Accents: neon green for primary action and score, electric blue for analysis, amber for pressure/context.
- Typography: heavy compact headings, small uppercase metadata, readable body copy.
- Components: fixed-radius panels, metric cards, bottom action bar, accordion sections, pill note chips, chart container, mobile nav.
- Interaction: high-contrast buttons, visible focus rings, large mobile touch targets.

## Icon Plan

Use `lucide-react` line icons:

- Dashboard: `LayoutDashboard`
- Player: `Users`, `UserRound`
- Evaluation: `ClipboardPlus`, `ClipboardCheck`
- Report: `FileText`
- Technique/score/insights: `Target`, `BarChart3`
- PDF Export: `Download`
- Search: `Search`
- Add Player: `UserPlus`, `Plus`
- Save: `Save`
- History/recent: `Activity`
- Settings/future backend: `Settings`

## Responsive Behavior

- Mobile first: single column, fixed bottom nav, fixed evaluation action bar.
- Tablet/desktop: sidebar nav, two-column dashboard/report grids.
- Inputs and sliders use full-width touch-friendly controls.
- Text sizes avoid viewport scaling and keep compact dashboard surfaces readable.
