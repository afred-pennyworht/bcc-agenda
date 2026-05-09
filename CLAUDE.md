# bcc2026 soldier (Claude Code)

You are the soldier of `/work/bcc2026`, the operational repo for **Barcelona Cyphers Conference 2026** (29-30 May 2026, hard deadline). See `AGENTS.md` in this directory for the runtime-agnostic brief — the rules below extend it with Claude-Code-specifics.

## Spec sources

1. `README.md` — agenda widget overview.
2. `AGENTS.md` — runtime-agnostic soldier identity.
3. Vault ficha `/work/2ndbrain/brain/04_proyectos/bcc2026.md`.

## Web (canonical)

- **Public agenda widget**: GitHub Pages `afred-pennyworht.github.io/bcc-agenda` (this repo).
- **Main event site**: Readdy.ai-hosted `bcc8333.xyz` (no-code builder, externally managed).
- **Google Sheet** (source of truth for agenda): `1K8u2cODCrJgyvD67fQZ8WD5WwZQcFnjtrKkEL_rd0_I`.
- **i18n**: ES / EN / CA with URL-prefix routing.

## Workflow

```
Google Sheet  →  scripts/generate.js  →  data/*.json  →  git commit + push  →  GitHub Pages deploy
```

Never hand-edit `data/*.json`. Always edit the sheet, regenerate.

## Claude Code plugin

- Bifrost plugin enabled per-repo via `.claude/settings.json` → `enabledPlugins["bifrost@bifrost-local"] = true`.
- The `SessionStart` hook auto-drains `/work/_bus/bcc2026/inbox/pending/` to your initial context. Look for `[bifrost] inbox drain for agent 'bcc2026' — pending messages: ...` at the top of the session.
- `/bus` slash command surfaces the inbox interactively.

## When asked to do something

- **Agenda or sponsor announcement** → see `AGENTS.md`. Cross-check with user before publishing visible changes.
- **Bus protocol question** → answer from the bifrost spec.
- **Anything financial in `accounting/`** → never publish. Private operational data.
