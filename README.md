# Aadish Portfolio

A static React 19 + Vite portfolio for a Frontend Engineer and AI Frontend Engineer. Includes project pages, accessible project dialogs, skills, resume downloads, and direct email contact. The repository contains one application, with no backend or external AI service required.

## Structure

```text
src/
  app/                    App shell, route behavior, and route labels
  components/
    layout/               Navigation and contact footer
    ui/                   Loading state and error boundary
  content/
    profile.json          Identity, biography, and contact information
    skills.json           Skill groups
    projects.json         Project summaries, destinations, and metadata
    projects/             One Markdown description per project
    index.js              Content imports and project categories
  features/
    projects/components/  Project cards and details dialog
  hooks/                  Shared theme and dialog-focus behavior
  pages/                  Home, project listing, and 404 pages
  styles/                 Global styles and theme variables
  main.jsx                React entry point
public/
  icons/                  App and touch icons
  AadishRathore.pdf        Resume, retaining its existing public URL
  favicon.*               Browser favicons
  site.webmanifest        App manifest
build/                    Build-only metadata integration
scripts/                  Production asset and bundle checks
tests/
  unit/                   Content integrity checks
  browser/                Playwright interaction checks
.github/workflows/        CI checks
index.html                HTML entry point
package.json              Dependencies and development commands
vite.config.js            Development and build configuration
vercel.json               SPA routing for deployment
```

Page and component styles live beside their corresponding JSX files. Global theme styles live in `src/styles/global.css`. Run all commands from the repository root.

## Edit content

Update `src/content/profile.json`, `skills.json`, or `projects.json`. Edit detailed case studies as Markdown in `src/content/projects/`; `detailsFile` in each project entry names its Markdown file. Use a unique `id`, `category: "ml"` or `"frontend"`, `repo`, and an optional `link` for a live demo. Project results are author-reported; link supporting evaluation evidence before adding new performance claims.

## Run locally

Requires Node.js 22.18+.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite (normally `http://localhost:5173`).

Copy `.env.example` to `.env.local` at the repository root and set `VITE_SITE_URL` to the actual public origin before publishing. It generates canonical/social URLs, robots.txt, and a sitemap. Leave it empty during local development if no public origin is configured.

## Verification

```sh
npm run lint
npm test
npm run build
```

CI runs content checks, browser interaction tests, and production asset verification. For browser tests locally, install Chromium with `npx playwright install chromium`, or set `PLAYWRIGHT_CHANNEL=msedge` to use installed Microsoft Edge.

Preview the production build with `npm run preview` after building. Generated `dist/`, browser test results, and local environment files are ignored by Git.

## Deploy to Vercel

- Framework preset: Vite.
- Root Directory: repository root. Leave the setting empty.
- Install command: `npm ci`.
- Build command: `npm run build`.
- Output directory: `dist`.
- Environment variable: `VITE_SITE_URL`, set to the published origin.

For an existing Vercel project previously configured with Root Directory `frontend`, clear that setting before the next deployment. All application files and configuration now live at the repository root.

`vercel.json` supports direct visits to project routes. Unknown and retired demo URLs show a useful 404 page. The contact link opens an email composer. Theme choices persist locally and respect the system theme on first visit.
