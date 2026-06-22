# NextBook Agent Guide

## Project Shape

NextBook is an Expo 55 / React Native 0.83 app for buying, trading, reviewing, saving and chatting about books. The app uses Firebase Auth, Realtime Database and Storage from `src/firebaseConfig.js`.

Primary entry points:

- `index.js` registers Expo.
- `App.js` exports `src/AppRoot.js`.
- Screens live in `src/screens/`.
- Domain helpers live in `src/components/*/*Service.js`, `src/services/` and `src/utils/`.
- Existing architecture notes live in `docs/`.

## Required Runtime

Use Node `>=20.19.4`. React Native 0.83 and Metro 0.83 require it. Node 18 will install with engine warnings and `make verify` intentionally fails early.

## Standard Commands

- Install: `npm ci`
- Start Expo: `npm start`
- Web dev: `npm run web`
- Full local gate: `make verify`
- Individual gates: `make lint`, `make typecheck`, `make test`, `make build`, `make evals`
- Install tracked git hooks: `make install-hooks`

## Quality Bar

Before handing off a change, run `make verify` on Node `>=20.19.4`. If the change is UI-heavy, also smoke test Expo web. If Firebase behavior changes, update or add an eval in `evals/`.

Keep changes scoped. Do not rewrite navigation, Firebase access or shared UI unless the task needs it. The current code has direct Firebase use in several screens; new complex flows should prefer service helpers to avoid more duplication.

## Collaboration Rules

- Check `git status --short` before editing. `docs/` may contain untracked user work; do not delete or overwrite unrelated changes.
- Use `rg` for search.
- Prefer existing component and theme patterns in `src/components/` and `src/theme/`.
- Use MCP only when the task actually needs an external system such as GitHub, Figma, Gmail, Calendar or Drive. Local repo work should use the filesystem and shell.
- Use subagents for parallel investigation of independent areas such as Firebase, UI, tests and build tooling.
- Use GPT-5.5 for complex architecture, security, data-consistency or large refactor tasks.

## Recurrent Risks

- Navigation uses string keys and loose params in `src/AppRoot.js`.
- Firebase config is client-side and should be protected by Firebase rules, not by secrecy.
- Image picker and Storage upload flows are duplicated across listing, review and chat screens.
- Some Firebase writes use separate operations where multi-path updates would reduce partial-failure risk.
- Realtime list screens currently load whole collections and filter client-side.

## Local Skills

Repo-specific skills are versioned in `skills/`. Use them when repeating NextBook workflows. If you want Codex to auto-load them globally, copy or install them into `$CODEX_HOME/skills` outside the repo.

- `nextbook-firebase-domain-flow`
- `nextbook-screen-data-subscription`
- `nextbook-media-upload-flow`
- `nextbook-form-edit-create-flow`
- `nextbook-chat-safety-flow`

Curated skills installed from `openai/skills` for future Codex sessions:

- `playwright`
- `security-best-practices`
- `gh-fix-ci`
- `gh-address-comments`
- `yeet`

Restart Codex to pick up newly installed global skills.
