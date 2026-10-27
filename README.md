# RUGVED Systems — MIT Manipal

Website for RUGVED Systems, the defence robotics club at MIT Manipal. Built with
Next.js 16 (App Router), React 19, Tailwind CSS 4 and Motion.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the development server
- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — run ESLint

## Structure

| Path | Purpose |
| --- | --- |
| `app/` | Routes: home, projects, project detail, team, accomplishments, contact, 404 |
| `components/` | Shell, timeline, project catalog and atmosphere components |
| `components/ui/` | Small interactive primitives (click spark, tactical card) |
| `lib/` | Typed content: projects, research, patents and milestone data |
| `public/` | Project imagery and brand assets |

## Content

Page content lives in `lib/`. Edit `lib/project-data.ts`,
`lib/research-data.ts` and the milestone list in `lib/rugved-data.ts` rather than
hard-coding copy in components. Team division copy is currently in
`app/team/page.tsx`.

## Design notes

- Palette tokens (`--page`, `--surface`, `--field-accent`, `--signal-accent`) are
  defined in `app/globals.css`.
- The contact form composes a `mailto:` draft; there is no backend.
- The timeline and atmosphere layers respect `prefers-reduced-motion`.
