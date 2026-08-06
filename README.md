# Delivery Volume Widget

A React + TypeScript widget that displays a stock's traded volume vs. delivery volume across daily, weekly, and monthly ranges, with a bar chart and range-aware insights.

## Features

- Toggle between Daily / Weekly / Monthly ranges via a pill selector
- Bar chart comparing total traded volume against delivery volume per period
- Click a bar to drill into that period's stats; other bars dim
- Insights panel that dims (instead of disappearing) when a bar is selected or the current range has no insights, falling back to the last available insights

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Oxlint for linting

## Getting Started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build    # type-check and build for production
npm run lint      # run oxlint
npm run preview   # preview the production build
```

## Project Structure

- `src/DeliveryVolumeWidget.tsx` — main widget component
- `src/data.ts` — sample range data (daily/weekly/monthly bars and insights, dated 2026)
- `src/widget.css`, `src/tokens.css` — widget styling and design tokens
- `src/prototypes/` — isolated design exploration surface, not wired into the app
  - `src/prototypes/numbers/` — number animation variants (Flash, Odometer, Slide, Roll), served via `numbers.html`
  - `src/prototypes/bar-morph/` — bar morph animation variants (Curtain, Fluid, Snap), served via `prototype.html`

## Prototype Entry Points

Vite serves each prototype as its own HTML entry, independent of the main app:

```bash
npm run dev
# then open /numbers.html or /prototype.html in the browser
```
