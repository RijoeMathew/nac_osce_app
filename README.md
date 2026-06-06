# NAC OSCE Timer

Mobile-friendly NAC OSCE practice timer built with Next.js, TypeScript, React, and Tailwind CSS.

The app is currently timer-only. AI patient, examiner, auth, and API features are disabled from the UI so the project can export as a static GitHub Pages site.

## Features

- Official NAC timing rhythm: 2 minutes between stations and 11 minutes per station
- Mobile-first timer display for solo practice
- Configurable circuit length
- Auto-advance between move/read and station phases
- Audible alarm patterns and optional 1-minute practice warning
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
