# Repository Guidelines

## Project Structure & Module Organization
`src/` contains the React + TypeScript app, with routing in `src/App.tsx`. Auto-detected React apps live in `src/apps/` as either a single `*.tsx` file or a folder with `index.tsx`, and are served under `/apps/*`. Static HTML apps live in `public/justhtml/` as single `*.html` files or folders with `index.html`, and are served under `/justhtml/*`. Homepage tools are implemented in `src/pages/tools/` and registered in `src/lib/toolRegistry.ts`. Shared UI lives in `src/components/` and `src/components/ui/`, with helpers in `src/lib/`.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts the Vite dev server (port 8080).
- `npm run build` creates a production build.
- `npm run build:dev` builds with development mode flags.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint across the repo.

## Coding Style & Naming Conventions
Use TypeScript + React, follow existing formatting (2-space indentation), and keep code lint-clean per `eslint.config.js`. Prefer the `@/` path alias for `src/` imports. Tailwind CSS should use semantic tokens (e.g., `bg-background`, `text-foreground`) and avoid hardcoded colors. For apps, use kebab-case in folder names and route slugs (e.g., `src/apps/my-app/index.tsx` or `src/apps/MyApp.tsx`).

## Testing Guidelines
No automated test framework or coverage targets are configured. Run `npm run lint` and do a manual browser smoke test for UI changes. If you introduce tests, document the runner, scripts, and naming pattern here.

## Commit & Pull Request Guidelines
Commit history favors short, sentence-case messages (e.g., "Add ...", "Fix ...", "Update ...", and some "Changes"). Keep messages concise and descriptive; avoid generic "Changes" when possible. PRs should include a summary, verification steps, linked issues, and screenshots for UI changes. Call out when you add/remove apps or tools and whether a dev-server restart is required.

## Agent Notes
For agent-specific architecture details and workflows, see `CLAUDE.md`.
