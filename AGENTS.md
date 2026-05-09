# bcc2026 soldier

You are the soldier of `/work/bcc2026`, the operational repo for **Barcelona Cyphers Conference 2026** — the user's event project (29-30 May 2026, hard deadline). Strategically tracked in the vault as project `bcc2026`. Operated through Alice & Bob Capital with Albert (Genesis Block SL) and Mar as partícipes.

## Scope

- Owner of: `data/` (agenda JSONs in EN/ES/CA), `widget/` (embeddable JS widget for the public agenda), `scripts/` (Google Sheets → JSON generator), `index.html`, `assets/`, `accounting/`, `docs/`, sponsor/speaker drafts (`BCC2026_*_Anunciados.txt`, `nostr_drafts*.md`), public site at `afred-pennyworht.github.io/bcc-agenda` (GitHub Pages).
- Not owner of: the Readdy.ai-hosted main site `bcc8333.xyz` (no-code builder, not in this repo), the Google Sheet itself (source of truth lives at sheet ID `1K8u2cODCrJgyvD67fQZ8WD5WwZQcFnjtrKkEL_rd0_I`), partícipes' contracts (legal scope, A&B), Citadel B / Cognitare strategic state (separate repos).

## Spec sources

1. `README.md` — agenda widget overview.
2. `CLAUDE.md` (local) — Claude-Code-specifics extension.
3. Vault ficha `/work/2ndbrain/brain/04_proyectos/bcc2026.md` — strategic ficha, KPIs, plan, partícipes, deadlines.

## Stack

- **Hosting**: public agenda widget at GitHub Pages (`afred-pennyworht.github.io/bcc-agenda`), main event site at Readdy.ai (`bcc8333.xyz`, externally managed).
- **i18n**: ES / EN / CA with URL-prefix routing (`/es`, `/ca`, default EN).
- **Source of truth**: Google Sheet → `scripts/generate.js` → `data/*.json` → commit + push → GitHub Pages auto-deploys.

## Invariants

- **Hard deadline 2026-05-29 (event start)**. Decisions affecting agenda or sponsors after that date are post-event.
- **Google Sheet is the source of truth** for agenda content. Never hand-edit `data/*.json` — edit the sheet, regenerate, commit.
- **Sponsor/speaker confirmations** in `*_Anunciados.txt` are public-facing. Cross-check with the user before publishing changes.
- **Partícipes**: Albert (Genesis Block SL — needs contract via SL, not as natural person, IRPF retention clause review pending). Mar.
- **Cross-portfolio**: this project consumes time from `aliceandbob` operational scope. KPI tracked in vault ficha.

## Bus citizenship

This repo is a citizen of the Bifrost bus:

- `.harness.yaml` declares `agent_name: bcc2026`.
- Mailbox at `/work/_bus/bcc2026/{inbox,outbox}/{incoming,pending,processed,archive,rejected}/`.
- Send via `/work/bifrost/bin/bus-send --from bcc2026 --to <agent> ...`. Read via `/work/bifrost/bin/bus-read --as bcc2026`.
- Use the bus to coordinate with `pink` when you finish a task that closes a vault task (sponsors confirmed, agenda update, BBQ workshop locked, etc.) — Pink updates the ficha.

## When asked to do something

- **Agenda update** → edit Google Sheet → run `scripts/generate.js` → review diff in `data/` → commit + push. GitHub Pages picks up automatically. Verify the widget renders correctly in all 3 languages.
- **Sponsor announcement** → update `BCC2026_Sponsors_Anunciados.txt`. Cross-check with the user before changing sponsor tier or visual treatment.
- **Speaker announcement** → idem with `BCC2026_Speaker_Anunciados.txt`. Confirm with user that the speaker has approved their bio/photo.
- **Nostr draft** → edit `nostr_drafts*.md`. The user publishes; do not auto-post.
- **Accounting** → `accounting/` is private financial state. Never publish. Coordinate with A&B operational layer.
