/**
 * BCC2026 Agenda Widget
 * Embeddable, self-contained widget with auto language detection.
 * Usage: <div id="bcc-agenda"></div><script src="widget.js"></script>
 */
(function () {
  "use strict";

  const BASE_URL =
    document.currentScript?.src?.replace(/widget\.js$/, "") ||
    "https://afred-pennyworht.github.io/bcc-agenda/widget/";
  const DATA_BASE = BASE_URL.replace(/widget\/$/, "data/");

  function detectLang() {
    const path = window.location.pathname;
    if (path.startsWith("/ca")) return "ca";
    if (path.startsWith("/es")) return "es";
    return "en";
  }

  function injectStyles() {
    const css = `
      .bcc-agenda { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 0 auto; color: #1a1a1a; }
      .bcc-agenda * { box-sizing: border-box; }
      .bcc-day-tabs { display: flex; gap: 4px; margin-bottom: 24px; }
      .bcc-day-tab { padding: 10px 20px; border: 2px solid #f7931a; background: transparent; color: #f7931a; font-weight: 600; font-size: 15px; cursor: pointer; border-radius: 6px; transition: all 0.2s; }
      .bcc-day-tab.active { background: #f7931a; color: #fff; }
      .bcc-day-tab:hover { background: #f7931a; color: #fff; opacity: 0.9; }
      .bcc-day-content { display: none; }
      .bcc-day-content.active { display: block; }
      .bcc-block-header { background: #2d2d2d; color: #f7931a; padding: 10px 16px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 6px; margin: 20px 0 8px 0; }
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
      .bcc-sponsored { font-size: 11px; color: #f7931a; margin-left: 4px; }
      .bcc-parallel { margin-top: 8px; padding: 8px 12px; background: #f0faf0; border-left: 3px solid #2ecc71; border-radius: 0 4px 4px 0; font-size: 13px; }
      .bcc-parallel-label { font-size: 11px; font-weight: 700; color: #2ecc71; text-transform: uppercase; margin-bottom: 2px; }
      .bcc-break-row { background: #fafafa; }
      .bcc-bbq-row { background: #fff5f0; }
      .bcc-loading { text-align: center; padding: 40px; color: #999; }
      .bcc-error { text-align: center; padding: 40px; color: #e74c3c; }
      @media (max-width: 600px) {
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
    // fallback
    const raw = type.toLowerCase();
    if (raw.includes("break") || raw.includes("descan") || raw.includes("descans")) return "break";
    if (raw.includes("bbq") || raw.includes("barbac")) return "bbq";
    return "talk";
  }

  function renderDay(day, labels) {
    let html = "";
    let currentBlock = null;

    for (const s of day.sessions) {
      const typeClass = getTypeClass(s.type, labels);

      if (s.block && s.block !== currentBlock) {
        currentBlock = s.block;
        html += `<div class="bcc-block-header">${labels.block}: ${currentBlock}</div>`;
      }

      if (typeClass === "break" || typeClass === "lunch" || typeClass === "bbq") {
        currentBlock = null;
      }

      const rowClass =
        typeClass === "break" || typeClass === "lunch"
          ? "bcc-break-row"
          : typeClass === "bbq"
          ? "bcc-bbq-row"
          : "";

      html += `<div class="bcc-session ${rowClass}">`;
      html += `<div class="bcc-time">${s.time}</div>`;
      html += `<div class="bcc-session-body">`;
      html += `<span class="bcc-session-type bcc-type-${typeClass}">${s.type}</span>`;

      if (s.title) {
        html += `<span class="bcc-session-title">${s.title}</span>`;
      }

      if (s.speaker) {
        html += `<div class="bcc-session-speaker">${s.speaker}`;
        if (s.language) html += `<span class="bcc-session-lang">(${s.language})</span>`;
        if (s.sponsored) html += `<span class="bcc-sponsored">🤝</span>`;
        html += `</div>`;
      }

      if (s.description) {
        html += `<div class="bcc-session-speaker">${s.description}</div>`;
      }

      if (s.parallel_ws) {
        html += `<div class="bcc-parallel">`;
        html += `<div class="bcc-parallel-label">${labels.room_b} — ${labels.workshop}</div>`;
        html += `<strong>${s.parallel_ws.title}</strong>`;
        if (s.parallel_ws.speaker) html += ` — ${s.parallel_ws.speaker}`;
        if (s.parallel_ws.language) html += ` <span class="bcc-session-lang">(${s.parallel_ws.language})</span>`;
        html += `</div>`;
      }

      html += `</div></div>`;
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
