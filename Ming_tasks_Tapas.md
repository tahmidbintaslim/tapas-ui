# Ming Tasks (Tapas UI)

Work log for all tasks done in this repo (Tapas UI / TapasRepo). Entries are chronological, newest at the bottom.
Every entry answers: **Why** / **File** / **What was fixed** (exact diff) / **Verified by**.

---

## [T-001] Clone the Tapas UI repo into TapasRepo + create dolprat branch (2026-11-15)
- **Status:** Done
- **Why:** Project work (new sections, templates, docs per the owner's request) happens inside the real repo. Cloned nested inside `Tapas UI\` to keep the container folder tidy, matching the Sorbet UI setup. Branch `dolprat` created locally per the collaborator's convention (work on a branch, never disturb main).
- **File:** whole repo tree at `Tapas UI\TapasRepo\` (git clone from https://github.com/tahmidbintaslim/tapas-ui, full history); branch `dolprat` created from latest main
- **What was fixed:** nothing — setup task, no code changes
- **Done by:** planner agent (clone + `git switch -c dolprat`)
- **Verified by:** `git log --oneline -3` shows 288ecad / 951c866 / 1b76b05; `git branch --show-current` → `dolprat`
- **Follow-up (2026-11-17):** synced with upstream — friend pushed 3 commits to main since Nov 15 (#38 15 creative sections, #39 new sections in demos/SaaS template + floating navbar contrast fix, #40 README lists all 60 sections/6 templates/3 demos). `git merge origin/main --ff-only` fast-forwarded `dolprat` from `288ecad` to `26cd594` (110 files, +5227/−159). Zero conflicts; `Ming_tasks_Tapas.md` untracked and unaffected.

## [T-002] Windows compatibility audit + install + dev boot check (2026-11-15)
- **Status:** Done
- **Why:** Sorbet UI (sister repo) had Mac-only path bugs crashing `pnpm run dev` on Windows (.pathname on file URLs). Owner asked to check and fix the same problems here BEFORE running, so the dev environment works first try.
- **File:** none — audit clean, no code changed (only `node_modules/` + ignored `.next/` created by install/boot)
- **What was fixed:** no code changes needed: no `.pathname` anywhere in `src/`, `scripts/`, `.storybook/` or root configs; the only `import.meta.url` uses (`eslint.config.mjs`, `vitest.config.mts`) are already guarded with `fileURLToPath(...)`; `src` file reads use `process.cwd()` + `path.join`; dev script is plain `next dev --turbopack` (no predev/gen/postinstall hook); boot clean
- **Done by:** implementer agent
- **Verified by:**
  - Audit: `package.json` scripts contain no `rm -rf`/POSIX-only shell. `build` is `shadcn build && storybook build -o public/storybook --quiet && next build` — `&&` chaining works in cmd.exe and it is build-only (never runs in dev). `scripts/capture-previews.cjs` is the only script under `scripts/` (manual Playwright screenshot tool, needs a globally installed Playwright, not part of dev/build). `.storybook/main.ts` + `preview.tsx` are plain TS with no path tricks.
  - `pnpm install` → lockfile up to date, 1029 packages added, postinstall `unrs-resolver` OK, **Done in 1m 39.9s**, exit code 0. Only warning: ignored build scripts for `core-js-pure@3.51.0`, `esbuild@0.25.12` (pnpm default policy, non-fatal).
  - `pnpm run dev` → `▲ Next.js 15.5.28 (Turbopack)`, `Local: http://localhost:3000`, `✓ Starting...`, `✓ Ready in 2.6s`. No gen-script crash. No browser tab auto-opened (dev script has no `--open`), Storybook did **not** start (separate `pnpm storybook` on 6006 — port 6006 idle).
  - Smoke requests against the dev server: `GET /` → 200 (`✓ Compiled / in 5.9s`), `GET /docs/sections` → 200 (`✓ Compiled /docs/sections in 773ms`), `GET /docs/sections/interactive-card` → 200 (`✓ Compiled /docs/sections/[slug] in 1676ms`) — so the `process.cwd()`/`readFileSync` source-reading path also works on Windows.
  - Kill: `taskkill /T /F /PID 24420` (cmd → pnpm → next tree) terminated 9 processes; then `Get-NetTCPConnection -LocalPort 3000 -State Listen` → no listener, `Test-NetConnection localhost:3000` → `False` (port 3000 released); no leftover next/pnpm node processes.

## Planned next (add entries when done)
- [T-003] Docs round: write documentation for each existing section (hero variants, navbar, pricing, FAQ, footer, etc.) — mirrors Sorbet T-007.
- [T-004] New sections round — gaps in the 44-section catalog.
- [T-005] New templates/business demos round.
- [T-006] Commit fixes (if any) on dolprat + push when owner approves.
