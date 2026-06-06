# NAC OSCE Timer

Mobile-friendly NAC OSCE practice timer built with Next.js, TypeScript, React, and Tailwind CSS.

The app is currently timer-only. AI patient, examiner, auth, and API features are disabled from the UI so the project can export as a static GitHub Pages site.

## Features

- Practice mode for one station
- Full exam mode for a 12-station circuit
- Case type selection before starting: counselling or non-counselling
- NAC-style signal schedule: 2-minute reading signal, 8-minute encounter signal, and 11-minute final signal
- Non-counselling flow: 2 minutes reading, 8 minutes encounter, 3 minutes post-encounter questions
- Counselling flow: 2 minutes reading, 11 minutes encounter
- Mobile-first timer display for solo practice
- Auto-advance between stations
- Audible alarm patterns with vibration where supported
- Static export for GitHub Pages

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000`.

## Static Build

```bash
npm run build
```

The static site is exported to `out/`.

## GitHub Pages

The included GitHub Actions workflow builds and deploys the static site from `main`.

In GitHub, enable Pages with **Settings > Pages > Source: GitHub Actions**.
