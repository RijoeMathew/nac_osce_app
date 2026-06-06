# NAC OSCE Helper

AI-powered Canada-style OSCE practice platform built with Next.js, TypeScript, React, Tailwind CSS, Supabase, and Gemini.

The current scaffold is runnable with mock data and mock AI responses. Gemini, Supabase, Deepgram, and Ready Player Me connection points are marked in code with placeholder comments.

## Features

- Landing page, dashboard, case library, live simulation room, feedback/results page, and progress page
- Original practice cases for chest pain, abdominal pain, depression, pediatric fever, prenatal counselling, and breaking bad news
- Timed OSCE mode with 2-minute reading timer, 11-minute encounter timer, 1-minute warning, and end-station control
- AI patient route with Gemini integration placeholder and mock fallback
- AI examiner route with Gemini scoring placeholder and mock fallback
- Transcript panel with candidate and patient messages
- Manual typing fallback plus browser speech recognition support
- Browser text-to-speech for patient output
- Avatar placeholder panels for patient and examiner
- Supabase Auth UI scaffold and SQL schema

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create local environment variables:

```bash
cp .env.example .env.local
```

3. Fill in the values you want to enable:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
DEEPGRAM_API_KEY=
NEXT_PUBLIC_READY_PLAYER_ME_SUBDOMAIN=
```

4. Run the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Supabase

Run `supabase/schema.sql` in the Supabase SQL editor to create:

- `profiles`
- `cases`
- `practice_sessions`
- `transcripts`
- `scores`

The UI currently uses local mock data from `lib/cases.ts`. Replace that with Supabase reads once auth and row-level policies are configured for your deployment.

## API Routes

- `POST /api/patient`
  - Input: `{ caseId, transcript }`
  - Uses Gemini when `GEMINI_API_KEY` is available, otherwise mock patient responses.

- `POST /api/examiner`
  - Input: `{ caseId, transcript }`
  - Uses Gemini when `GEMINI_API_KEY` is available, otherwise mock scoring.

- `POST /api/sessions`
  - Placeholder for creating Supabase practice sessions.

## Important Content Note

The sample cases are original educational practice cases inspired by common OSCE formats. They do not reproduce copyrighted MCC or NAC station content.

## Deployment

Deploy on Vercel and add the same environment variables in the Vercel project settings. Keep `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, and `DEEPGRAM_API_KEY` server-side only.
