---
type: brief
project: bcc2026
author: bcc2026 soldier
created: 2026-05-28
updated: 2026-05-28 (post web-audit + decisión paleta)
purpose: Input para sesión claude.ai/design — producción Remotion de stings per-charla/panel + decks intro/outro homogéneos para BCC2026 (29-30 may, T-1).
supersedes: /work/2ndbrain/brain/04_proyectos/inbox/bcc2026-brand-brief.md (Pink first pass)
tokens_canonical: /work/bcc2026/assets/brand/tokens.json
---

> **CORRECCIÓN posterior al first draft** (2026-05-28): el draft original identificaba sólo 2 paletas en conflicto (lockup SVG vs PDF theme legacy). Auditoría del CSS de bcc8333.xyz reveló **3 paletas en conflicto** — el sitio Readdy usa `#f7931a` + `#7b68ee` + multi-naranjas + Bebas Neue, distinto del lockup. La afirmación "audiencia internalizó duotone" estaba mal fundada. Trilemma resuelto: opción A (lockup SVG). Tokens canónicos en `/work/bcc2026/assets/brand/tokens.json` + contexto en `/work/bcc2026/assets/brand/README.md`. Secciones 1.1 y 5 actualizadas abajo.

# BCC2026 — Brand Brief técnico para stings + decks

> Auditoría hands-on del repo `/work/bcc2026/` con foco en lo que un pipeline Remotion necesita saber: tokens exactos, dimensiones, formatos, gaps. Asume conocimiento del first-pass de Pink (ya archivable) y profundiza donde el detalle de bajo nivel importa.

---

## 1. Brand DNA — fuentes de autoridad

### 1.1 Paleta — autoridad: `assets/pictures/logo_bcc.svg`

Hex extraídos directamente del SVG (no del PDF theme legacy, no de la web):

| Token | Hex | Rol en el SVG | Uso propuesto |
|---|---|---|---|
| `--bcc-purple` | **`#4900F2`** | "B" izquierda + 2nd "B" del wordmark "BBQUEEN BARRACKS" | Primario frío, acentos titulares |
| `--bcc-orange` | **`#FF6400`** | "B" derecha + wordmark "CC8333" + texto secundario | Primario cálido, marca dominante |
| `--bcc-orange-2` | `#FF7000` | Stop secundario del gradiente lineal del SVG | Reservado a gradientes, no usar plano |
| `--bcc-bg` | `#0a0a0a` → `#1a1a1a` | Fondo web (`index.html` body: `#111`) | Dark-mode dominante |
| `--bcc-fg` | `#FFFFFF` | Texto sobre dark | Default sobre fondo oscuro |

**Trilemma confirmado por auditoría — 3 paletas conviviendo**:

| Fuente | Paleta | Fonts | Status |
|---|---|---|---|
| Logo SVG `assets/pictures/logo_bcc.svg` | `#4900F2` + `#FF6400` duotone | Hauser (en repo) | **AUTORIDAD ELEGIDA** (opción A, 2026-05-28) |
| Web bcc8333.xyz (Readdy.ai) | `#f7931a` + `#7b68ee` + `#FF6B35` + `#FF5520` + `#FF8C42` + `#00D9FF` + `#2ecc71` | Bebas Neue (Google Fonts) | Externally-managed, fuera de scope T-1 |
| PDF theme `~/.claude/skills/pdf/themes/bcc2026.css` | `#f7931a` solo | n/a | Legacy, update post-evento |
| `index.html` widget agenda | `#f7931a` (heredado del PDF theme) | sans-serif system | Operativa, fuera de scope T-1 |

→ **Decisión registrada en `/work/bcc2026/assets/brand/tokens.json` (single source of truth para Remotion + decks)**. Razones de la elección — ver `assets/brand/README.md`. Resumen: SVG y Hauser están bajo control del repo con licencia, lockup ya es sello en Nostr/X publicaciones, paleta web es default builder demasiado amplia. Disonancia con bcc8333.xyz aceptada como trade-off T-1 (audiencia ve pantallas en La Salle, no la web).

### 1.2 Tipografía — autoridad: `assets/fonts/hauser/`

Hauser cargado en repo (9 ficheros .otf, licensia incluida `Font License.txt`):

| Familia | Uso recomendado en motion |
|---|---|
| Hauser Bold | **Default display** para titulares grandes |
| Hauser Condensed Bold | Titulares largos + lower-thirds (nombre + handle + título de charla) |
| Hauser Bold Italic | Énfasis ocasional, **no abusar** |
| Hauser Italic / Condensed Italic | Quotes / captions secundarios |
| Hauser / Hauser Condensed (regular) | Body / metadata (slot time, día) |

Hauser **no** está cargado en la web pública (el widget usa `sans-serif` system). Esto significa: **Hauser es la firma visual de print + motion**, no de web. Mantener esa separación en stings: Hauser identifica "BCC en pantalla grande".

**Orbitron**: mencionado en docs antiguos del vault — confirmado **no usado** en el repo, no cargado en assets/fonts/. Descartar.

### 1.3 Lockup logo — geometría conocida

`logo_bcc.svg` viewport: `320 × 168`. Composición:

- 2 "B" geométricas duotone — izquierda `#4900F2`, derecha `#FF6400`. Cada "B" tiene dos paths: cuerpo sólido + gradiente lineal sutil para volumen 3D (`paint0_linear`, `paint1_linear`, `paint2_linear` con stops a `opacity=0.14` y `opacity=0`).
- Wordmark superior `BBQUEEN BARRACKS` (purple, abajo)
- Wordmark inferior `CC8333` (orange)
- Diseñado **únicamente sobre fondo oscuro**. Para fondo claro requiere re-coloring (no tenemos variante light).

Para stings: tratar el lockup como **sello fijo** al cierre (1.5–2s, fade-in con micro-pop de las "B" entrando desde laterales — reusa la geometría existente del SVG).

### 1.4 Motion language ya producido (MUY IMPORTANTE)

| Asset | Resolución | FPS | Duración | Rol |
|---|---|---|---|---|
| `assets/video/BCC2026_promo.mp4` | 1924×1076 | 24 fps | 22 s | **Master promo** — referencia del lenguaje de marca en movimiento |
| `assets/video/BCC_Luna.mp4` | 1920×1080 | 25 fps | 16:51 | Pieza larga (Luna spot, no rendering language para stings) |
| `assets/video/1/2/3-BCC_BBQ.mp4` | varios | — | varias | Material BBQ — para sting outro (cierre festivo) |

→ **Ver `BCC2026_promo.mp4` antes de claude.ai/design.** Es 22s, 24fps, ratio ~16:9. Es la base del lenguaje. Los stings deben respetar:
- **Master 16:9 a 1080p** (ajustar al promo, no inventar nueva resolución)
- **24 fps** como base (Luna es 25 fps, promo es 24 fps — usar 24 fps para alineación cine)

### 1.5 Visual motifs derivables del logo + promo

- Cypherpunk irreverente — geometría dura, contrastes altos, dark-mode.
- Duotone `purple × orange` como firma reconocible — **no introducir nuevos colores** que rompan eso. Verde/rojo/azul están vetados.
- Gradientes solo dentro de la geometría del logo (replicar el patrón del SVG). Resto: planos.
- Skyline Barcelona (`assets/pictures/big-jardiarq.webp`) disponible como anchor urbano para intro.

---

## 2. Tone de voz / copy register

### 2.1 Tagline del evento (oficial, de bcc8333.xyz)

> *"An Unconference for Sovereignty, Bitcoin & Freedom"*

> *"We want to provide a place where people with little to no knowledge can come and leave as an authentic cypherpunk"*

### 2.2 Patrón de campaña Nostr/X (extraído de `nostr_drafts.md` y `nostr_drafts_sponsors.md`)

Estructura recurrente — drum-roll + identidad + one-liner + dónde + CTA:

```
🥁 NUEVO SPEAKER 🥁          ← speakers (32 posts)
🟧 NUEVO LEAD SPONSOR 🟧     ← sponsors Lead
🟦 NUEVO STRATEGIC SPONSOR 🟦 ← sponsors Strategic

nostr:npub1... [Nombre] se une al lineup de la BCC 2026 🔝

[One-liner punchy con su ángulo cypherpunk]

📍El 29-30 de mayo en #Barcelona
[CTA: "Nos vemos allí" / "No faltes" / "Be there"]
https://www.bcc8333.xyz/
```

**Bilingüe**: ES para speakers/sponsors hispanos, EN para internacionales. Paridad con la cuenta @bcc8333.

### 2.3 Quotes de speakers para sting copy (one-liners ya escritos en drafts)

Son joyas listas para usar en lower-thirds o teaser cards:

- El Gorila: *"No voy a parar hasta que desmantelen fiat y se arrodillen ante Bitcoin"*
- Marcellus: *"Node runner, pleb de alto voltaje"*
- Efrat: *"Independent journalist. Allergic to tyranny."*
- BitMaker: *"¿Quién desmonta mineros industriales ladrillo a ladrillo para devolver la minería a los plebs? Él."*

→ Los one-liners están en `nostr_drafts.md` (#1–#32). El pipeline puede extraerlos automáticamente.

### 2.4 Registro para los stings

Mismo registro que la campaña Nostr: **punchy, directo, irreverente, cero solemnidad corporativa**. Una sting per-charla no es un "career bio" — es un drum-roll de 5–15s que dice "viene X, no te lo pierdas". El lockup cierra y desaparece.

**Vetar**: voiceover formal, música cinemática genérica, "presentamos a…", footage stock.

---

## 3. Inventario completo de assets

### 3.1 Speakers — 32 MP4 + 24 GIF (gap 01–08)

**MP4 individuales** (`assets/speakers/NN_handle.mp4`) — 32/32:

| # | Handle | Notas | GIF? |
|---|---|---|---|
| 01 | general_kenobi | Economista minería | ❌ |
| 02 | el_gorila | "Fiat de rodillas" | ❌ |
| 03 | alfre_mancera | Pendiente decidir charla | ❌ |
| 04 | ur_entropy | Mod de paneles | ❌ |
| 05 | alberto_mera | Podcast Bitcoin | ❌ |
| 06 | bitmaker | Mineros plebs | ❌ |
| 07 | efrat_fenigson | Keynote viernes | ❌ |
| 08 | marcellus | BIP-110 / Knots | ❌ |
| 09–32 | landabaso, kilian, bebop, pakovm, buttercup_roberts, counterweight, chavo, cryptosquid, oz_lafarga, dr_khushboo, stoa_otter, guerrilla_btc, karliatto, jacksper, moti_wesatoshis, verbiricha, losku, jordi_llonch, orange_bamboo, soy_tierra_fertil, marcela_cons, riccardo_biffi, kami_velasco, lunaticoin | varios | ✅ |

**Specs MP4**: 1280×720 (720p), 30000/1001 fps (~29.97), ~5s, h264+aac.
**Specs GIF**: 640×360, ~5s, sin audio.

**Gap GIF 01–08** (8 speakers — los primeros publicados, NO menos importantes):
- **Solución A (rápida)**: auto-generar GIFs desde MP4 con ffmpeg (5s loop, 360p, color palette optimizada). Comando:
  ```
  ffmpeg -i 01_general_kenobi.mp4 -vf "fps=12,scale=640:-1:flags=lanczos,palettegen" /tmp/p.png
  ffmpeg -i 01_general_kenobi.mp4 -i /tmp/p.png -lavfi "fps=12,scale=640:-1:flags=lanczos [x]; [x][1:v] paletteuse" gif/01_general_kenobi.gif
  ```
- **Solución B (mejor para sting)**: Remotion consume MP4 directo (más calidad, audio mute, loop fácil con `<OffthreadVideo>`). En sting per-sesión **prefiero MP4 sobre GIF** — el GIF es para Nostr donde MP4 no autoplaya.

→ **Recomendación**: el pipeline Remotion lee MP4 directamente; el gap de GIFs **no bloquea** stings, solo bloquea futuros posts Nostr de speakers 01–08 (y esos ya se publicaron, así que el gap es cosmético).

**Handles X / npubs**: tabla completa derivable cruzando `BCC2026_Speaker_Anunciados.txt` (URLs) + `nostr_drafts.md` (npubs verificados) → ver `memory/reference_speaker_npubs.md`. Para el pipeline programático sugiero generar `data/speakers.json` con `{num, slug, name, handle_x, npub, mp4_path, gif_path, oneliner_es, oneliner_en, talk_title}` antes de Remotion.

### 3.2 Sponsors — 11 confirmados, 1 con SVG vectorial

GIFs en `assets/sponsors/gif/` (11 unique + 2 mp4 + 2 _old duplicates):

| Sponsor | Tier | GIF | MP4 | Logo vectorial |
|---|---|---|---|---|
| Natio21 | Lead | ✅ `natio21.gif` | ✅ `natio21.mp4` | ❌ |
| Freedomia | Lead | ✅ `freedomia.gif` | ✅ `freedomia.mp4` | ✅ `Logo_Freedomia.svg` |
| Rewind | Lead | ✅ | ❌ | ❌ |
| BitBox | Lead | ✅ | ❌ | ❌ |
| Foundation | Lead | ✅ | ❌ | ❌ |
| Firefish | Lead | ✅ | ❌ | ❌ |
| Soy Tierra Fértil | Lead | ✅ | ❌ | ❌ |
| Hash2Wear | Lead | ✅ | ❌ | ❌ |
| SilkPad | Lead | ✅ | ❌ | ❌ |
| Ready to Prepare | Lead | ✅ | ❌ | ❌ |
| Bitronics | Strategic | ✅ | ❌ | ❌ |
| Vexl | Pending | ❌ | ❌ | ❌ |
| Citadel ₿ | Speaker, no tier | ❌ | ❌ | ❌ (assets en `/work/citadelb/brand-kit/`) |
| Max Hillebrand | Speaker | ❌ | ❌ | n/a (speaker, no sponsor) |

**Gap importante**: solo 1 sponsor tiene logo SVG vectorial (Freedomia). El resto solo tiene el GIF (mapeo bitmap, no escalable limpiamente). Implicación para deck outro / sponsor wall: **scrapear logos PNG/SVG oficiales desde sus webs respectivas** o aceptar usar los GIFs como fuente de marca (sus GIFs ya incluyen el logo, pero quedan a 640p — aceptable a 16:9 1080p con ligero up-scale, **no más**).

### 3.3 Recursos gráficos

- `assets/pictures/logo_bcc.svg` (vectorial, autoridad)
- `assets/pictures/logo_bcc.png`, `logo_bcc_icon.png` (raster, fallbacks)
- `assets/pictures/qr_bcc2026_navy.png` + `qr_camiseta_navy.png` (QR para fin de sting outro / deck)
- `assets/pictures/big-jardiarq.webp` (skyline Barcelona, hero)
- `assets/pictures/rollup.jpeg` (roll-up legacy, baja prioridad)
- `assets/pictures/hacker.png` + `hacker2.png` (posters genéricos, baja prioridad — anteriores a la marca actual)
- `assets/Evento.png`, `bcc8333_2026.jpg` (banners legacy)

### 3.4 Audio — DJDucah tracks ya disponibles

- `assets/video/Prey_DJDucah.mp3` (7.8 MB) — track 1 DJDucah
- `assets/video/SunnyTerraceGroove.mp3` (5.8 MB) — track 2 DJDucah

→ Ambos tracks ya son del partner musical del evento (DJDucah set sábado noche). Reusarlos como **base musical de stings** es la opción no-coste y coherente. Para sting stinger de 3-5s: extraer un hit/crash de uno de ellos (mejor uno percusivo). Pedir a DJDucah un "sting cut" custom de 5s es Plan B si tiempo lo permite (¿hoy mismo?).

### 3.5 Tracking de assets vs cobertura

| Necesidad | Cubierto | Gap |
|---|---|---|
| Logo vectorial BCC | ✅ SVG | — |
| Fonts display | ✅ Hauser (9 cuts) | — |
| Speaker MP4 (32) | ✅ 32/32 | — |
| Speaker GIF (32) | ⚠️ 24/32 | 8 GIFs auto-generables |
| Sponsor GIF (11) | ✅ 11/11 | — |
| Sponsor SVG | ❌ 1/11 | 10 vectorials que scrapear |
| Sponsor Vexl/Citadel/Hillebrand assets | ❌ | Bloqueo no crítico para sting outro general |
| Audio sting base | ✅ 2 tracks DJDucah | — |
| Motion language ref | ✅ promo+Luna | — |

---

## 4. Alcance a producir — recomendación priorizada

Conferencia es **mañana** (2026-05-29 viernes). 24h hábiles para producir + cargar al runofshow. La realidad limita scope.

### 4.1 Sting global INTRO (P0 — must-ship)

- **Duración**: 30–45s.
- **Función**: abrir el día (slot 09:00 viernes "Acreditación y bienvenida" → MC entra → corre intro → primera keynote).
- **Contenido**: lockup BCC animado entrando → tagline ("An Unconference for Sovereignty…") → skyline Barcelona quick-cut → tipografía Hauser kinetic de "29–30 MAY · BARCELONA · CYPHERPUNK" → corte a negro → "Welcome".
- **Audio**: base track DJDucah cortado a 30s con cierre seco.

### 4.2 Sting global OUTRO (P0 — must-ship)

- **Duración**: 30–60s.
- **Función**: cerrar el sábado (último slot "Cierre de la conferencia" → MC despide → corre outro).
- **Contenido**: thank-you cards rápidos → wall de sponsors (los 11 logos en grid duotone-tinted) → tease BCC2027 → CTA "Nos vemos en el BBQ" o "See you at BCC2027".
- **Audio**: misma base DJDucah, con outro festivo (puede usar tracks BBQ existentes).

### 4.3 Stings PER-SESIÓN — recomendación scope: **TODOS los 29 plenary content slots**

Distribución en agenda (37 slots totales):

| Tipo | Count | Sting? | Justificación |
|---|---|---|---|
| Charla | 21 | ✅ todos | Core del evento, todos son hablantes anunciados |
| Panel | 6 | ✅ todos | Múltiples speakers — sting muestra los 3-4 panelistas |
| Keynote | 2 | ✅ extendido (~15s) | Mayor peso visual |
| Acreditación + Cierre | 2 | usa global intro/outro | — |
| Comida / Descansos | 5 | ❌ | No necesitan motion |
| BBQ | 1 | ✅ especial | Sting festivo dedicado |

**Total stings per-sesión**: 29 + 1 BBQ = **30**.
**Duración**: 5–10s estándar, 15s keynotes, 20s BBQ.

**Por qué TODOS, no subset estrella**:
1. El runofshow ya distingue cada slot con `id`s estables (commit `535734e feat(agenda): stable per-slot IDs for runofshow sync`). El pipeline programático puede generar 30 stings desde un JSON loop sin coste marginal — *escalar a 30 cuesta lo mismo que escalar a 10 una vez la plantilla Remotion está hecha*.
2. Subset "estrella" introduce decisión política (¿quién está dentro?), riesgo de fricción con speakers. **Tratamiento parejo = decisión política nula.**
3. Plenary se sucede rápido (15–25min por slot); sin sting el corte es brusco. El sting actúa como **respiración visual** del día.

**Estructura sting per-sesión** (template Remotion):

```
[0.0s]  Fade in desde negro
[0.5s]  Lockup BCC pequeño esquina sup-izq
[0.5s–4.0s] GIF/MP4 del speaker, fullscreen blur-bg
[1.0s]  Lower-third: NOMBRE + @handle (Hauser Bold)
[2.0s]  Titulo de la charla (Hauser Condensed Bold, 2 lineas max)
[3.0s]  Slot time "12:35 · Viernes" (Hauser regular, esquina inf)
[4.0s–5.0s] Fade lockup BCC a fullscreen, cierre
```

Variante para **panel** (3-4 speakers): grid 2×2 de GIFs en lugar de fullscreen.

### 4.4 Decks INTRO/OUTRO globales (P1 — nice-to-ship)

Decks PDF (formato slides) para el guion del MC. **Lower priority que stings** — el MC puede improvisar con notas si los decks no salen.

Si se hacen:
- Brand-homogéneos con stings (mismos tokens, misma Hauser).
- Approach: generar via `/pdf` skill con el theme `bcc2026` actualizado a paleta oficial (purple+orange, **no** bitcoin-orange). El theme legacy `~/.claude/skills/pdf/themes/bcc2026.css` requiere update.

---

## 5. Gaps + decisiones abiertas para claude.ai/design

Lista de cosas que **tú** (Rafa) decides en claude.ai/design. Mi recomendación entre paréntesis.

| # | Decisión | Recomendación soldier | Bloqueador? |
|---|---|---|---|
| 1 | ~~Paleta autoridad~~ — **RESUELTO 2026-05-28**: opción A (lockup SVG `#4900F2`+`#FF6400`+Hauser). Tokens en `assets/brand/tokens.json`, contexto en `assets/brand/README.md` | ✅ decidido (rafa) | Desbloqueado |
| 2 | Master format: 1080p 24fps 16:9 | **Sí** (alinear con `BCC2026_promo.mp4`) | Sí — afecta render setup Remotion |
| 3 | Aspect derivado para Nostr/X social | **9:16 vertical, mismo source recortado** | No, post-render |
| 4 | Scope sting per-sesión | **Todos 29 plenary + BBQ = 30** | Sí — afecta volumen render |
| 5 | Audio sting base | **Cortar de DJDucah `Prey` o `SunnyTerraceGroove` ya existentes** (no custom) | No |
| 6 | Audio stinger de 3-5s entre stings | **Sí, extraer hit percusivo de DJDucah** | No |
| 7 | GIFs missing speakers 01-08 | **Skip GIF, usar MP4 directo en Remotion `<OffthreadVideo>`** | No |
| 8 | Logos sponsors no-vectoriales (10/11) | **Usar GIF como fuente, scale 1.2× max** | Sólo afecta deck outro / wall |
| 9 | Citadel ₿ / Max Hillebrand / Vexl | **Sting outro general; no per-sesión stings hasta que tengan asset** | No bloqueante (1 slot afectado: charla Citadel viernes 12:35) |
| 10 | Skyline Barcelona en intro | **Sí, como anchor + treatment duotone overlay** | No |
| 11 | Tipografía display motion | **Hauser Bold (titulares) + Hauser Condensed Bold (lower-thirds)** | No |
| 12 | Tagline de intro | **"An Unconference for Sovereignty, Bitcoin & Freedom"** (oficial bcc8333.xyz) | No |
| 13 | Decks intro/outro globales | **P1, ship-if-time-allows** | No |
| 14 | Actualizar `~/.claude/skills/pdf/themes/bcc2026.css` a paleta oficial | **Sí, después de stings (para coherencia futura)** | No |

---

## 6. Pipeline propuesto

```
┌─────────────────────────────────────────────────────────────────┐
│  CLAUDE.AI/DESIGN (Rafa)                                        │
│  Iteración visual de variantes intro/outro/per-sesión           │
│  Output: design tokens consolidados + variantes aprobadas       │
└──────────────────────┬──────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│  REMOTION en /work/bcc2026/remotion/ (nueva dir)                │
│  - Composition <StingIntro/> fixed 30s                          │
│  - Composition <StingOutro/> fixed 45s                          │
│  - Composition <StingPerSession/> parametrizada por JSON        │
│    inputs: { num, name, handle, npub, mp4_path, talk_title,    │
│              slot_time, slot_day, type: charla|panel|keynote } │
│  - <SpriteSheet/> de logos sponsors para outro grid             │
│  Render: npx remotion render src/index.tsx StingPerSession      │
│          --props='data/stings/<num>.json' out/sting_<num>.mp4   │
└──────────────────────┬──────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│  data/speakers.json (NEW)                                       │
│  Generado por scripts/build_speakers_json.js                    │
│  Cruza: Anunciados.txt + nostr_drafts.md + agenda_es.json       │
│         + speakers/NN_*.mp4 → tabla canónica para Remotion      │
└──────────────────────┬──────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│  Output → /work/bcc2026/assets/stings/                          │
│  ├── sting_intro.mp4    (1920x1080, 24fps, h264, ~30s)         │
│  ├── sting_outro.mp4    (1920x1080, 24fps, h264, ~45s)         │
│  └── sting_<num>_<slug>.mp4 × 30 plenary                        │
└──────────────────────┬──────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│  Upload → GDrive folder "BCC 2026 / Stings"                     │
│         → Plan B Drive Mirror sync                              │
│         → RoS material kind=sting, slot_id = agenda id          │
│  Cabina cache: preload SW noche del 28 (sábado preload sábado)  │
└─────────────────────────────────────────────────────────────────┘
```

### Por qué Remotion en este repo (no proyecto separado)

- Asset paths absolutos ya viven aquí (`assets/speakers/*.mp4`).
- `data/agenda_*.json` es source-of-truth de los slots; Remotion lo lee directo.
- Pipeline determinista: PR-merge → render → commit out/ → push → carpetas drive sync. Sin contexto-switch a otro repo.
- Plugin Bifrost ya conectado — la sesión soldier puede coordinar con pink al cierre.

### Riesgo y rollback

- Remotion render de 30 piezas + 2 globales ≈ 30 min con CPU local (CI build estimado). Si render falla T-1: ship solo intro + outro globales, los per-session vivirán como "BCC2026 lockup" idle entre slots como fallback aceptable.
- Si claude.ai/design devuelve variantes incompatibles con Remotion (e.g. After Effects only): rollback a Lottie export → Remotion `<Lottie/>`. Tiempo extra +2h.

---

## 7. Referencias — paths absolutos para claude.ai/design + pipeline

**Brand sources (autoridad)**:
- `/work/bcc2026/assets/brand/tokens.json` — **single source of truth** (tokens canónicos, scope audiovisual)
- `/work/bcc2026/assets/brand/README.md` — contexto del trilemma resuelto + uso en Remotion/PDF
- `/work/bcc2026/assets/pictures/logo_bcc.svg` — lockup canónico (origen de los tokens)
- `/work/bcc2026/assets/fonts/hauser/` — 9 cuts Hauser .otf
- `/work/bcc2026/assets/video/BCC2026_promo.mp4` — motion language ref (22s)

**Asset library**:
- `/work/bcc2026/assets/speakers/01..32_*.mp4` — 32 speakers MP4 720p 30fps
- `/work/bcc2026/assets/speakers/gif/09..32_*.gif` — 24 GIFs 360p
- `/work/bcc2026/assets/sponsors/gif/*.gif` — 11 sponsors
- `/work/bcc2026/assets/sponsors/Logo_Freedomia.svg` — único sponsor vectorial
- `/work/bcc2026/assets/video/Prey_DJDucah.mp3`, `SunnyTerraceGroove.mp3` — audio base
- `/work/bcc2026/assets/video/1-BCC_BBQ.mp4` (+2,3) — material BBQ outro

**Editorial / copy**:
- `/work/bcc2026/nostr_drafts.md` — one-liners speakers #1–#32
- `/work/bcc2026/nostr_drafts_sponsors.md` — copy + tier sponsors
- `/work/bcc2026/BCC2026_Speaker_Anunciados.txt` — URLs X (orden cronológico)
- `/work/bcc2026/BCC2026_Sponsors_Anunciados.txt` — URLs X + tiers

**Agenda / runofshow**:
- `/work/bcc2026/data/agenda_es.json` (ca/en) — 37 slots, ids estables
- Google Sheet `1K8u2cODCrJgyvD67fQZ8WD5WwZQcFnjtrKkEL_rd0_I` — source of truth

**Sitio público**:
- https://www.bcc8333.xyz — taglines + tone reference
- https://afred-pennyworht.github.io/bcc-agenda — widget agenda

**Legacy (a actualizar después)**:
- `/home/m4rv1n/.claude/skills/pdf/themes/bcc2026.css` — usa `#f7931a`, debe migrar a `#FF6400` post-evento
- `/work/bcc2026/index.html` — preview widget, usa `#f7931a` (no es producción, baja prioridad)

---

## Resumen ejecutivo (1 párrafo)

Brand de BCC2026 es **duotone púrpura `#4900F2` + naranja `#FF6400` sobre dark, tipografía Hauser, registro cypherpunk irreverente**. Hay divergencia activa con un bitcoin-orange `#f7931a` legacy del PDF theme que debe abandonarse en motion para coherencia con las 32+11 piezas Nostr/X ya publicadas. Para mañana (T-1) se debe shippear 1 sting intro global (30s) + 1 sting outro global (45s) + 30 stings per-sesión (5–15s) cubriendo los 29 slots plenary + BBQ, todos rendered a 1920×1080 24fps en Remotion programático leyendo `data/speakers.json` (nuevo) cruzado con `data/agenda_es.json`. Assets están al 95% — sólo falta scrapear logos vectoriales sponsors (10/11) y resolver 3 speakers/sponsors pendientes (Vexl, Citadel ₿, Max Hillebrand) que no bloquean intro/outro/global pero degradan 1 slot per-session. Audio base disponible (DJDucah `Prey` + `SunnyTerraceGroove`), no requiere custom. **Decisión #1 a tomar antes de abrir claude.ai/design: paleta oficial vs legacy. Recomendación firme: oficial.**
