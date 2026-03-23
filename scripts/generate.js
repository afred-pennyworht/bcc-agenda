#!/usr/bin/env node
/**
 * Reads BCC2026 agenda from Google Sheet and generates
 * localized JSON files for ES, EN, and CA.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SPREADSHEET_ID = "1K8u2cODCrJgyvD67fQZ8WD5WwZQcFnjtrKkEL_rd0_I";
const DATA_DIR = path.join(__dirname, "..", "data");

// --- i18n labels ---
const i18n = {
  es: {
    day1_label: "Viernes 29 de Mayo",
    day2_label: "Sábado 30 de Mayo",
    talk: "Charla",
    keynote: "Keynote",
    panel: "Panel",
    workshop: "Workshop",
    break: "Descanso",
    lunch: "Comida",
    opening: "Acreditación y bienvenida",
    closing: "Cierre de la conferencia",
    bbq: "CypherPunk Barbecue — parrilla al fuego, bebidas locales, música en vivo, networking",
    bbq_title: "Barbacoa & Fiesta",
    plenary: "Plenaria",
    room_b: "Sala B",
    schedule: "Programa",
    speaker: "Ponente",
    language: "Idioma",
    block: "Bloque",
    parallel_ws: "Workshops en paralelo",
  },
  en: {
    day1_label: "Friday, May 29",
    day2_label: "Saturday, May 30",
    talk: "Talk",
    keynote: "Keynote",
    panel: "Panel",
    workshop: "Workshop",
    break: "Break",
    lunch: "Lunch",
    opening: "Registration & Welcome",
    closing: "Conference Closing",
    bbq: "CypherPunk Barbecue — open fire grill, local drinks, live music, networking",
    bbq_title: "Barbecue & Party",
    plenary: "Main Stage",
    room_b: "Room B",
    schedule: "Schedule",
    speaker: "Speaker",
    language: "Language",
    block: "Block",
    parallel_ws: "Parallel workshops",
  },
  ca: {
    day1_label: "Divendres 29 de Maig",
    day2_label: "Dissabte 30 de Maig",
    talk: "Xerrada",
    keynote: "Keynote",
    panel: "Taula rodona",
    workshop: "Taller",
    break: "Descans",
    lunch: "Dinar",
    opening: "Acreditació i benvinguda",
    closing: "Tancament de la conferència",
    bbq: "CypherPunk Barbecue — graella al foc, begudes locals, música en viu, networking",
    bbq_title: "Barbacoa & Festa",
    plenary: "Plenària",
    room_b: "Sala B",
    schedule: "Programa",
    speaker: "Ponent",
    language: "Idioma",
    block: "Bloc",
    parallel_ws: "Tallers en paral·lel",
  },
};

// --- Block name translations ---
const blockNames = {
  es: {
    "BITCOIN I": "Bitcoin I",
    "BITCOIN II": "Bitcoin II",
    PRIVACIDAD: "Privacidad",
    "PARALLEL STRUCTURES": "Estructuras Paralelas",
    SOBERANÍA: "Soberanía",
    "PERMACULTURA & SOBERANÍA ALIMENTARIA":
      "Permacultura & Soberanía Alimentaria",
    "COMUNIDADES & CIERRE": "Comunidades & Cierre",
  },
  en: {
    "BITCOIN I": "Bitcoin I",
    "BITCOIN II": "Bitcoin II",
    PRIVACIDAD: "Privacy",
    "PARALLEL STRUCTURES": "Parallel Structures",
    SOBERANÍA: "Sovereignty",
    "PERMACULTURA & SOBERANÍA ALIMENTARIA":
      "Permaculture & Food Sovereignty",
    "COMUNIDADES & CIERRE": "Communities & Closing",
  },
  ca: {
    "BITCOIN I": "Bitcoin I",
    "BITCOIN II": "Bitcoin II",
    PRIVACIDAD: "Privacitat",
    "PARALLEL STRUCTURES": "Estructures Paral·leles",
    SOBERANÍA: "Sobirania",
    "PERMACULTURA & SOBERANÍA ALIMENTARIA":
      "Permacultura & Sobirania Alimentària",
    "COMUNIDADES & CIERRE": "Comunitats & Tancament",
  },
};

function readSheet(range) {
  const params = JSON.stringify({ spreadsheetId: SPREADSHEET_ID, range });
  const cmd = `gws sheets spreadsheets values get --params ${JSON.stringify(params)}`;
  const raw = execSync(cmd, { encoding: "utf8" });
  // gws outputs "Using keyring backend: keyring" on first line
  const lines = raw.split("\n");
  const jsonStart = lines.findIndex((l) => l.trim().startsWith("{") || l.trim().startsWith("["));
  const json = lines.slice(jsonStart).join("\n");
  return JSON.parse(json).values || [];
}

function parseScheduleSheet(rows) {
  const sessions = [];
  let currentBlock = null;
  let wsSlotInfo = null;

  for (let i = 1; i < rows.length; i++) {
    const [hora, tipo, plenaria, speaker, idioma, salaB, speakerWs, notas] =
      rows[i].map((c) => (c || "").trim());

    if (!hora && !tipo && !plenaria) continue;

    // Block header row
    if (hora.startsWith("BLOQUE")) {
      const match = hora.match(/BLOQUE \d+: (.+)/);
      currentBlock = match ? match[1] : hora;
      wsSlotInfo = salaB || null;
      continue;
    }

    // Break
    if (tipo && tipo.includes("BREAK")) {
      sessions.push({ time: hora, type: "break" });
      continue;
    }

    // Lunch
    if (tipo && tipo.includes("COMIDA")) {
      sessions.push({ time: hora, type: "lunch", notes: plenaria });
      continue;
    }

    // BBQ
    if (tipo && tipo.includes("BBQ")) {
      sessions.push({ time: hora, type: "bbq", description: plenaria });
      continue;
    }

    // Opening
    if (tipo === "Apertura") {
      sessions.push({ time: hora, type: "opening" });
      continue;
    }

    // Closing
    if (tipo === "Cierre") {
      sessions.push({ time: hora, type: "closing" });
      continue;
    }

    // Keynote / Talk / Panel
    if (tipo === "Keynote" || tipo === "Charla" || tipo === "Panel") {
      const session = {
        time: hora,
        type: tipo === "Keynote" ? "keynote" : tipo === "Charla" ? "talk" : "panel",
        title: plenaria,
        speaker: speaker || null,
        language: idioma || null,
        block: currentBlock,
        sponsored: (notas || "").includes("🤝"),
      };

      // Parallel workshop info
      if (salaB && !salaB.startsWith("[") && salaB !== "—" && salaB !== "") {
        session.parallel_ws = {
          title: salaB.replace(/^WS-\d+[a-z]: /, ""),
          speaker: speakerWs || null,
          language: notas && !notas.includes("🤝") ? notas : (notas || "").replace("🤝", "").trim() || null,
        };
      }

      sessions.push(session);
    }
  }

  return sessions;
}

function buildLocalizedAgenda(lang, fridaySessions, saturdaySessions) {
  const labels = i18n[lang];
  const blocks = blockNames[lang];

  function localizeType(type) {
    return labels[type] || type;
  }

  function localizeBlock(block) {
    if (!block) return null;
    return blocks[block] || block;
  }

  function localizeSession(s) {
    const out = { time: s.time, type: localizeType(s.type) };

    if (s.type === "opening") {
      out.title = labels.opening;
    } else if (s.type === "closing") {
      out.title = labels.closing;
    } else if (s.type === "break") {
      out.title = labels.break;
    } else if (s.type === "lunch") {
      out.title = labels.lunch;
    } else if (s.type === "bbq") {
      out.title = labels.bbq_title;
      out.description = labels.bbq;
    } else {
      out.title = s.title;
      if (s.speaker) out.speaker = s.speaker;
      if (s.language) out.language = s.language;
      if (s.block) out.block = localizeBlock(s.block);
      if (s.sponsored) out.sponsored = true;
      if (s.parallel_ws) {
        out.parallel_ws = {
          title: s.parallel_ws.title,
          speaker: s.parallel_ws.speaker,
          language: s.parallel_ws.language,
        };
      }
    }

    return out;
  }

  return {
    conference: "Barcelona Cyphers Conference 2026",
    labels,
    days: [
      {
        date: "2026-05-29",
        label: labels.day1_label,
        sessions: fridaySessions.map(localizeSession),
      },
      {
        date: "2026-05-30",
        label: labels.day2_label,
        sessions: saturdaySessions.map(localizeSession),
      },
    ],
  };
}

// --- Main ---
console.log("Reading Viernes 29...");
const fridayRows = readSheet("'Viernes 29'!A1:H50");
const fridaySessions = parseScheduleSheet(fridayRows);
console.log(`  ${fridaySessions.length} sessions parsed`);

console.log("Reading Sábado 30...");
const saturdayRows = readSheet("'Sábado 30'!A1:H50");
const saturdaySessions = parseScheduleSheet(saturdayRows);
console.log(`  ${saturdaySessions.length} sessions parsed`);

for (const lang of ["es", "en", "ca"]) {
  const agenda = buildLocalizedAgenda(lang, fridaySessions, saturdaySessions);
  const outPath = path.join(DATA_DIR, `agenda_${lang}.json`);
  fs.writeFileSync(outPath, JSON.stringify(agenda, null, 2), "utf8");
  console.log(`Written: ${outPath}`);
}

console.log("Done!");
