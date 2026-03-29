/**
 * BCC2026 Agenda Widget
 * Embeddable, self-contained widget with auto language detection.
 * Two-column layout: main stage + workshop track (Sala B).
 * Usage: <div id="bcc-agenda"></div><script src="widget.js"></script>
 */
(function () {
  "use strict";

  const BASE_URL =
    document.currentScript?.src?.replace(/widget\.js$/, "") ||
    "https://afred-pennyworht.github.io/bcc-agenda/widget/";
  const DATA_BASE = BASE_URL.replace(/widget\/$/, "data/");

  function detectLang() {
    // Allow override via data-lang attribute on the container
    const container = document.getElementById("bcc-agenda");
    const override = container?.dataset?.lang;
    if (override && ["es", "en", "ca"].includes(override)) return override;
    const path = window.location.pathname;
    if (path.startsWith("/ca")) return "ca";
    if (path.startsWith("/es")) return "es";
    return "en";
  }

  function injectStyles() {
    const css = `
      .bcc-agenda { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1100px; margin: 0 auto; color: #1a1a1a; }
      .bcc-agenda * { box-sizing: border-box; }
      .bcc-day-tabs { display: flex; gap: 4px; margin-bottom: 24px; }
      .bcc-day-tab { padding: 10px 20px; border: 2px solid #f7931a; background: transparent; color: #f7931a; font-weight: 600; font-size: 15px; cursor: pointer; border-radius: 6px; transition: all 0.2s; }
      .bcc-day-tab.active { background: #f7931a; color: #fff; }
      .bcc-day-tab:hover { background: #f7931a; color: #fff; opacity: 0.9; }
      .bcc-day-content { display: none; }
      .bcc-day-content.active { display: block; }

      /* Block layout */
      .bcc-block-header { background: #2d2d2d; color: #f7931a; padding: 10px 16px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 6px 6px 0 0; margin: 20px 0 0 0; }
      .bcc-block-layout { display: flex; gap: 0; margin-bottom: 8px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 6px 6px; overflow: hidden; }
      .bcc-main-stage { flex: 1; min-width: 0; }

      /* Workshop track (right column) */
      .bcc-ws-track { width: 280px; flex-shrink: 0; background: linear-gradient(180deg, #f0faf0 0%, #e8f5e8 100%); border-left: 3px solid #2ecc71; }
      .bcc-ws-track-header { padding: 10px 12px; font-size: 12px; font-weight: 700; color: #fff; background: #27ae60; text-transform: uppercase; letter-spacing: 0.5px; }
      .bcc-ws-card { padding: 12px; border-bottom: 1px solid #c8e6c8; }
      .bcc-ws-card:last-child { border-bottom: none; }
      .bcc-ws-time { font-size: 12px; font-weight: 700; color: #27ae60; margin-bottom: 4px; font-variant-numeric: tabular-nums; }
      .bcc-ws-title { font-size: 13px; font-weight: 600; color: #1a1a1a; line-height: 1.3; }
      .bcc-ws-speaker { font-size: 12px; color: #555; margin-top: 2px; }
      .bcc-ws-lang { font-size: 11px; color: #888; }

      /* Sessions */
      .bcc-session { display: flex; gap: 16px; padding: 12px 16px; border-bottom: 1px solid #eee; align-items: flex-start; }
      .bcc-session:last-child { border-bottom: none; }
      .bcc-time { min-width: 100px; font-weight: 600; font-size: 14px; color: #555; white-space: nowrap; padding-top: 2px; }
      .bcc-session-body { flex: 1; }
      .bcc-session-type { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 3px; margin-right: 8px; }
      .bcc-type-keynote { background: #f7931a; color: #fff; }
      .bcc-type-talk { background: #4a90d9; color: #fff; }
      .bcc-type-panel { background: #7b68ee; color: #fff; }
      .bcc-type-workshop { background: #2ecc71; color: #fff; }
      .bcc-type-break { background: #95a5a6; color: #fff; }
      .bcc-type-lunch { background: #e67e22; color: #fff; }
      .bcc-type-opening, .bcc-type-closing { background: #f7931a; color: #fff; }
      .bcc-type-bbq { background: #e74c3c; color: #fff; }
      .bcc-session-title { font-weight: 600; font-size: 15px; margin-bottom: 2px; }
      .bcc-session-speaker { font-size: 13px; color: #666; }
      .bcc-session-lang { font-size: 11px; color: #999; margin-left: 6px; }
      .bcc-break-row { background: #fafafa; }
      .bcc-bbq-row { background: #fff5f0; }
      .bcc-standalone { margin-bottom: 2px; }
      .bcc-loading { text-align: center; padding: 40px; color: #999; }
      .bcc-error { text-align: center; padding: 40px; color: #e74c3c; }

      @media (max-width: 700px) {
        .bcc-block-layout { flex-direction: column; }
        .bcc-ws-track { width: 100%; border-left: none; border-top: 3px solid #2ecc71; }
        .bcc-session { flex-direction: column; gap: 4px; }
        .bcc-time { min-width: auto; }
        .bcc-day-tabs { flex-direction: column; }
        .bcc-day-tab { text-align: center; }
      }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function getTypeClass(type, labels) {
    if (type === labels.keynote) return "keynote";
    if (type === labels.talk) return "talk";
    if (type === labels.panel) return "panel";
    if (type === labels.workshop) return "workshop";
    if (type === labels.break) return "break";
    if (type === labels.lunch) return "lunch";
    if (type === labels.opening) return "opening";
    if (type === labels.closing) return "closing";
    if (type === labels.bbq_title) return "bbq";
    const raw = type.toLowerCase();
    if (raw.includes("break") || raw.includes("descan") || raw.includes("descans")) return "break";
    if (raw.includes("bbq") || raw.includes("barbac")) return "bbq";
    return "talk";
  }

  function isBlockSession(s, labels) {
    const tc = getTypeClass(s.type, labels);
    return tc !== "break" && tc !== "lunch" && tc !== "bbq" && tc !== "opening" && tc !== "closing" && !!s.block;
  }

  /** Group sessions into segments: standalone items or block groups */
  function groupSessions(sessions, labels) {
    const segments = [];
    let currentBlock = null;
    let currentGroup = null;

    for (const s of sessions) {
      if (isBlockSession(s, labels)) {
        if (s.block === currentBlock && currentGroup) {
          currentGroup.sessions.push(s);
        } else {
          currentBlock = s.block;
          currentGroup = { type: "block", block: s.block, sessions: [s], workshops: [] };
          segments.push(currentGroup);
        }
        if (s.parallel_ws) {
          currentGroup.workshops.push({
            ...s.parallel_ws,
            _parentTime: s.time,
          });
        }
      } else {
        currentBlock = null;
        currentGroup = null;
        segments.push({ type: "standalone", session: s });
      }
    }

    return segments;
  }

  function renderSession(s, labels) {
    const typeClass = getTypeClass(s.type, labels);
    const rowClass =
      typeClass === "break" || typeClass === "lunch"
        ? "bcc-break-row"
        : typeClass === "bbq"
        ? "bcc-bbq-row"
        : "";

    let html = `<div class="bcc-session ${rowClass}">`;
    html += `<div class="bcc-time">${s.time}</div>`;
    html += `<div class="bcc-session-body">`;
    html += `<span class="bcc-session-type bcc-type-${typeClass}">${s.type}</span>`;

    if (s.title) {
      html += `<span class="bcc-session-title">${s.title}</span>`;
    }

    if (s.speaker) {
      html += `<div class="bcc-session-speaker">${s.speaker}`;
      if (s.language) html += `<span class="bcc-session-lang">(${s.language})</span>`;
      html += `</div>`;
    }

    if (s.description) {
      html += `<div class="bcc-session-speaker">${s.description}</div>`;
    }

    html += `</div></div>`;
    return html;
  }

  function renderWorkshopTrack(workshops, labels) {
    let html = `<div class="bcc-ws-track">`;
    html += `<div class="bcc-ws-track-header">${labels.room_b} — ${labels.workshop}</div>`;

    for (const ws of workshops) {
      const time = ws.time || ws._parentTime || "";
      html += `<div class="bcc-ws-card">`;
      if (time) html += `<div class="bcc-ws-time">${time}</div>`;
      html += `<div class="bcc-ws-title">${ws.title}</div>`;
      if (ws.speaker) {
        html += `<div class="bcc-ws-speaker">${ws.speaker}`;
        if (ws.language) html += ` <span class="bcc-ws-lang">(${ws.language})</span>`;
        html += `</div>`;
      }
      html += `</div>`;
    }

    html += `</div>`;
    return html;
  }

  function renderDay(day, labels) {
    const segments = groupSessions(day.sessions, labels);
    let html = "";

    for (const seg of segments) {
      if (seg.type === "standalone") {
        html += `<div class="bcc-standalone">${renderSession(seg.session, labels)}</div>`;
      } else {
        html += `<div class="bcc-block-header">${labels.block}: ${seg.block}</div>`;
        html += `<div class="bcc-block-layout">`;
        html += `<div class="bcc-main-stage">`;
        for (const s of seg.sessions) {
          html += renderSession(s, labels);
        }
        html += `</div>`;
        if (seg.workshops.length > 0) {
          html += renderWorkshopTrack(seg.workshops, labels);
        }
        html += `</div>`;
      }
    }

    return html;
  }

  function render(data) {
    const container = document.getElementById("bcc-agenda");
    if (!container) return;

    const labels = data.labels;
    let html = `<div class="bcc-agenda">`;

    // Day tabs
    html += `<div class="bcc-day-tabs">`;
    data.days.forEach((day, i) => {
      html += `<button class="bcc-day-tab ${i === 0 ? "active" : ""}" data-day="${i}">${day.label}</button>`;
    });
    html += `</div>`;

    // Day contents
    data.days.forEach((day, i) => {
      html += `<div class="bcc-day-content ${i === 0 ? "active" : ""}" data-day="${i}">`;
      html += renderDay(day, labels);
      html += `</div>`;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Tab switching
    container.querySelectorAll(".bcc-day-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const dayIdx = tab.dataset.day;
        container.querySelectorAll(".bcc-day-tab").forEach((t) => t.classList.remove("active"));
        container.querySelectorAll(".bcc-day-content").forEach((c) => c.classList.remove("active"));
        tab.classList.add("active");
        container.querySelector(`.bcc-day-content[data-day="${dayIdx}"]`).classList.add("active");
      });
    });
  }

  // Expose render for preview pages with manual lang switching
  window.__bccRender = render;

  async function init() {
    injectStyles();
    const container = document.getElementById("bcc-agenda");
    if (!container) return;

    container.innerHTML = `<div class="bcc-loading">Loading schedule...</div>`;

    const lang = detectLang();
    const url = `${DATA_BASE}agenda_${lang}.json`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      render(data);
    } catch (err) {
      container.innerHTML = `<div class="bcc-error">Error loading schedule. <br><small>${err.message}</small></div>`;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
