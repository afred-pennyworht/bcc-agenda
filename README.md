# BCC2026 — Agenda Widget

Dynamic agenda widget for [Barcelona Cyphers Conference 2026](https://www.bcc8333.xyz).

## Structure

- `data/` — Agenda JSON files (EN, ES, CA)
- `widget/` — Embeddable JS widget
- `scripts/` — Google Sheets → JSON generator

## Usage

Embed in any page:

```html
<div id="bcc-agenda"></div>
<script src="https://afred-pennyworht.github.io/bcc-agenda/widget.js"></script>
```

The widget auto-detects language from the URL path (`/es`, `/ca`, or default EN).
