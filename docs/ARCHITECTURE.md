# BCC2026 — Architecture

## Overview

Agenda widget and promotional campaign tooling for Barcelona Cyphers Conference 2026 (bcc8333.xyz). The widget is a self-contained JavaScript IIFE embeddable on any page, fed by JSON data generated from a Google Sheet.

## System Diagram

```
Google Sheet (source of truth)
     |
     v  node scripts/generate.js (via gws CLI)
data/agenda_{es,en,ca}.json
     |
     v  git commit + push
GitHub (afred-pennyworht/bcc-agenda)
     |
     v  GitHub Pages (automatic)
https://afred-pennyworht.github.io/bcc-agenda/
     |
     v  <script> embed in Readdy.ai
https://bcc8333.xyz  (ES / EN / CA)
```

```
Nostr Speaker Campaign (parallel)

posts.json + GIFs on nostr.build
     |
     v  systemd timer (3/day)
scripts/publish_cron.sh
     |
     v  scripts/publish_post.sh (nak CLI)
Nostr relays (damus, nos.lol, primal)
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Widget | Vanilla JS (IIFE, zero deps) |
| Data pipeline | Node.js + gws CLI (Google Sheets API) |
| Hosting | GitHub Pages |
| Frontend platform | Readdy.ai (no-code builder) |
| Nostr publishing | nak CLI v0.19.5, NIP-96 uploads |
| Media hosting | nostr.build (premium account) |
| Automation | systemd user timer |
| PDF generation | Playwright + Chromium headless |
| Secrets | GPG-encrypted files, injected as env vars |

## Project Structure

```
/work/bcc2026/
├── index.html                  # GitHub Pages preview with lang switcher
├── test-embed.html             # Readdy.ai integration test
├── data/
│   ├── agenda_es.json          # Spanish agenda
│   ├── agenda_en.json          # English agenda
│   └── agenda_ca.json          # Catalan agenda
├── widget/
│   └── widget.js               # Self-contained embeddable widget (IIFE)
├── scripts/
│   ├── generate.js             # Sheet → JSON pipeline
│   ├── posts.json              # 31 speaker posts data (Nostr campaign)
│   ├── publish_post.sh         # Publish one post to Nostr via nak
│   ├── publish_cron.sh         # Cron wrapper (reads NSEC from RAM file)
│   ├── upload_media.sh         # Upload MP4s to nostr.build (NIP-96)
│   ├── upload_gifs.sh          # Upload GIFs to nostr.build (NIP-96)
│   ├── queue.txt               # Remaining post numbers
│   ├── publish.log             # Publication log
│   └── html2pdf.js             # Playwright HTML→PDF converter
├── assets/
│   ├── speakers/*.mp4          # Speaker announcement videos
│   ├── speakers/gif/*.gif      # Animated GIFs (autoplay on Nostr)
│   ├── speakers/upload_urls.txt
│   ├── speakers/gif_upload_urls.txt
│   └── BCC2026_Plan_Campana_Entradas.pdf
└── .claude/
    └── secrets.json            # GPG secret references
```

## Data Pipeline: generate.js

```
Google Sheet (ID: 1K8u2cODCrJgyvD67fQZ8WD5WwZQcFnjtrKkEL_rd0_I)
  └─ gws sheets values get
       ├── 'Viernes 29'!A1:H50 → parseScheduleSheet()
       └── 'Sábado 30'!A1:H50 → parseScheduleSheet()
            │
            └─→ buildLocalizedAgenda(lang) × 3
                  │
                  └─→ data/agenda_{es,en,ca}.json
```

**Sheet columns (A:H):** hora | tipo | titulo plenaria | speaker | idioma | taller (sala B) | speaker taller | notas

**Session types:** BREAK, COMIDA, BBQ, Apertura, Cierre, Keynote, Charla, Panel

## Widget Architecture

`widget/widget.js` — zero-dependency IIFE, injects its own `<style>`.

**Lifecycle:**
1. `init()` → detect language from `data-lang` attr, URL prefix, or fallback to EN
2. Fetch `data/agenda_{lang}.json` from auto-detected base URL
3. `render()` → tab per day → `groupSessions()` → blocks with main stage + workshop track

**Embed:**
```html
<div id="bcc-agenda" data-lang="es"></div>
<script src="https://afred-pennyworht.github.io/bcc-agenda/widget/widget.js"></script>
```

**Exposed API:** `window.__bccRender(data)` for external re-render.

## i18n

Two layers, both in `generate.js`:

1. **UI labels** (`i18n{}`) — 16 strings for ES/EN/CA (session types, room names, day labels)
2. **Block names** (`blockNames{}`) — 7 thematic blocks translated per language

**Language detection in widget:** `data-lang` attr > URL prefix (`/es/`, `/ca/`) > fallback `"en"`

## Nostr Campaign Infrastructure

| Component | Path / Location |
|-----------|----------------|
| Post data | `scripts/posts.json` (31 entries with content + media URL) |
| Publisher | `scripts/publish_post.sh` (nak event, auto MIME detect) |
| Cron wrapper | `scripts/publish_cron.sh` (reads `/run/user/1000/bcc_nsec`) |
| Timer | `~/.config/systemd/user/bcc-nostr-post.timer` (10:00, 12:15, 14:30) |
| Queue | `scripts/queue.txt` (one post number per line) |
| Log | `scripts/publish.log` |
| Relays | relay.damus.io, nos.lol, relay.primal.net |

## Security Model

- **Secrets:** GPG-encrypted at rest (`/work/secrets/*.gpg`), decrypted to RAM-only tmpfs (`/run/user/1000/`)
- **nostr.build auth:** NIP-96 with Nostr auth events (kind 27235)
- **No tokens in code:** NSEC and nostr.build password injected via env vars
- **File permissions:** NSEC file is `600`, tmpfs is `mode=700, uid=1000`
