# BCC2026 — Barcelona Cyphers Conference

## Web
- Platform: Readdy.ai (no-code builder) para bcc8333.xyz
- Repo: https://github.com/afred-pennyworht/bcc-agenda
- Preview: https://afred-pennyworht.github.io/bcc-agenda/
- Google Sheet: `1K8u2cODCrJgyvD67fQZ8WD5WwZQcFnjtrKkEL_rd0_I`

## Estructura
- `data/` — JSONs generados desde Google Sheet
- `widget/` — Widget de agenda
- `scripts/` — Scripts de generación
- `index.html` — Página principal

## i18n
- ES/EN/CA con URL-prefix routing

## Workflow de actualización
Sheet → `scripts/generate.js` → commit + push → GitHub Pages
