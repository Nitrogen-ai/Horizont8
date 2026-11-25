/* Horizont:8 · gemeinsame Logik für alle Layouts
   Zustand (Notizen, Punkte, Häkchen, Beschlüsse, eigene Kacheln) liegt im
   localStorage dieses Browsers und wird zwischen den drei Layouts geteilt.
   Sichern/Weitergeben: Export als JSON (wieder importierbar), HTML oder PDF. */
(function () {
  const D = window.H8_DATA;
  const KEY = D.meta.storageKey;
  const PEOPLE_COLORS = ["#ff8a65", "#4db6ac", "#ffd54f", "#b39ddb"];
  const FALLBACK_COLORS = ["#90caf9", "#a5d6a7", "#f48fb1", "#bcaaa4"];

  const blank = () => ({ me: D.meta.teilnehmende[0], notes: {}, votes: {}, checks: {}, custom: {}, free: [],
    decisions: { oberthema: "", claim: "", beschluesse: "", termin: "", todos: [] },
    agenda: { active: null, startedAt: null, spent: {} } });

  let state;
  try { state = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { state = blank(); }
  (state.extraPeople || []).forEach((p) => { if (!D.meta.teilnehmende.includes(p)) D.meta.teilnehmende.push(p); });

  const listeners = [];
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function changed() { save(); listeners.forEach((f) => f()); }
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    try { state = Object.assign(blank(), JSON.parse(e.newValue || "{}")); } catch (_) {}
    H8.state = state; listeners.forEach((f) => f());
  });

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const colorOf = (name) => PEOPLE_COLORS[D.meta.teilnehmende.indexOf(name)] || FALLBACK_COLORS[[...String(name)].reduce((a, c) => a + c.charCodeAt(0), 0) % FALLBACK_COLORS.length];
  const short = (p) => (/\s\d+$/.test(p) ? p[0] + p.slice(-1) : p[0]);
  const fmtTime = (ts) => new Date(ts).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  function el(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }

  function clusters() {
    return D.clusters.map((c) => Object.assign({}, c, { tiles: c.tiles.concat(state.custom[c.id] || []) }));
  }
  function allTiles() { return clusters().flatMap((c) => c.tiles.map((t) => Object.assign({ cluster: c }, t))); }

  /* ---------- Kachel-Inhalt (layoutneutral, per CSS gestaltet) ---------- */
  function tileBody(t, opts = {}) {
    let h = "";
    if (t.badge) h += `<span class="h8-badge">${esc(t.badge)}</span>`;
    if (t.claim) h += `<p class="h8-claim">${esc(t.claim)}</p>`;
    if (t.img && !opts.noImg) {
      h += `<figure class="h8-fig${t.img2 ? " h8-fig-2" : ""}"><img loading="lazy" src="${t.img}" alt="${esc(t.imgAlt || t.titel)}" data-zoom>`;
      if (t.img2) h += `<img loading="lazy" src="${t.img2}" alt="${esc(t.titel)} (Detail)" data-zoom>`;
      h += `</figure>`;
    }
    if (t.video && !opts.noImg) h += `<video class="h8-video" src="${t.video}" muted loop playsinline controls preload="metadata"></video>`;
    if (t.text) h += `<p class="h8-text">${t.text}</p>`;
    if (t.bullets) h += `<ul class="h8-bullets">${t.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`;
    if (t.chips) h += `<div class="h8-chips">${t.chips.map((c) => `<span>${esc(c)}</span>`).join("")}</div>`;
    if (t.timeline) h += `<dl class="h8-timeline">${t.timeline.map(([d, x]) => `<dt>${d}</dt><dd>${x}</dd>`).join("")}</dl>`;
    if (t.checks) {
      const st = state.checks[t.id] || {};
      h += `<ul class="h8-checks">${t.checks.map((c, i) => `<li><label><input type="checkbox" data-check="${t.id}" data-i="${i}" ${st[i] ? "checked" : ""}> <span>${esc(c)}</span></label></li>`).join("")}</ul>`;
    }
    if (t.deckt) h += `<p class="h8-deckt"><b>deckt ab:</b> ${t.deckt.map(esc).join(" · ")}</p>`;
    if (t.beispiel) h += `<p class="h8-beispiel"><b>z. B.</b> ${esc(t.beispiel)}</p>`;
    if (t.pro) h += `<div class="h8-procon"><p class="pro">＋ ${esc(t.pro)}</p><p class="contra">－ ${esc(t.contra || "")}</p></div>`;
    if (t.links) h += `<p class="h8-links">${t.links.map((l) => `<a href="${l.u}" target="_blank" rel="noopener">${esc(l.t)} ↗</a>`).join(" ")}</p>`;
    if (t.custom) h += `<button class="h8-mini h8-del-tile" data-del-tile="${t.id}" title="Eigene Kachel löschen">Kachel entfernen</button>`;
    return h;
  }

  /* ---------- Notizen an Kacheln ---------- */
  function notesEl(tileId, opts = {}) {
    const box = el(`<div class="h8-notes" data-notes="${tileId}"></div>`);
    function draw() {
      const list = state.notes[tileId] || [];
      box.innerHTML = `<div class="h8-note-list">${list.map((n) => `
        <div class="h8-note" style="--nc:${colorOf(n.author)}" data-id="${n.id}">
          <div class="h8-note-text" contenteditable="true" spellcheck="true">${esc(n.text)}</div>
          <div class="h8-note-meta"><span>${esc(n.author)} · ${fmtTime(n.ts)}</span><button title="Notiz löschen" data-del>×</button></div>
        </div>`).join("")}</div>
        <form class="h8-note-form"><textarea rows="${opts.rows || 1}" placeholder="${opts.placeholder || "Idee notieren … (Enter = speichern)"}"></textarea><button type="submit" title="Notiz hinzufügen">＋</button></form>`;
      const ta = box.querySelector("textarea");
      const add = () => {
        const v = ta.value.trim(); if (!v) return;
        (state.notes[tileId] = state.notes[tileId] || []).push({ id: uid(), text: v, author: state.me, ts: Date.now() });
        save(); draw(); box.querySelector("textarea").focus(); notify();
      };
      box.querySelector("form").addEventListener("submit", (e) => { e.preventDefault(); add(); });
      ta.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); add(); } });
      box.querySelectorAll(".h8-note").forEach((n) => {
        const id = n.dataset.id;
        n.querySelector("[data-del]").addEventListener("click", () => {
          state.notes[tileId] = (state.notes[tileId] || []).filter((x) => x.id !== id); save(); draw(); notify();
        });
        n.querySelector(".h8-note-text").addEventListener("blur", (e) => {
          const note = (state.notes[tileId] || []).find((x) => x.id === id);
          if (note && note.text !== e.target.innerText.trim()) { note.text = e.target.innerText.trim(); save(); notify(); }
        });
      });
    }
    draw(); box._redraw = draw; return box;
  }
  // nur Zähler/Ranglisten aktualisieren, ohne Eingaben zu zerstören
  const softListeners = [];
  function notify() { softListeners.forEach((f) => f()); }

  /* ---------- Punkten (Themen) ---------- */
  function voteEl(tileId) {
    const box = el(`<div class="h8-vote" data-vote="${tileId}"></div>`);
    function draw() {
      const v = state.votes[tileId] || {};
      const total = Object.values(v).reduce((a, b) => a + b, 0);
      box.innerHTML = `<span class="h8-vote-total" title="Punkte">${"●".repeat(total) || "○"} <b>${total}</b></span>` +
        D.meta.teilnehmende.map((p) => `<button class="h8-vote-btn ${v[p] ? "on" : ""}" style="--nc:${colorOf(p)}" data-p="${p}" title="${p}: Punkt ${v[p] ? "entfernen" : "vergeben"}">${short(p)}</button>`).join("");
      box.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
        const p = b.dataset.p; const vv = (state.votes[tileId] = state.votes[tileId] || {});
        vv[p] = vv[p] ? 0 : 1; save(); draw(); notify();
      }));
    }
    draw(); box._redraw = draw; return box;
  }
  function ranking() {
    const th = clusters().find((c) => c.voting); if (!th) return [];
    return th.tiles.filter((t) => !/kombi/.test(t.id)).map((t) => {
      const v = state.votes[t.id] || {};
      return { tile: t, total: Object.values(v).reduce((a, b) => a + b, 0), by: D.meta.teilnehmende.filter((p) => v[p]) };
    }).sort((a, b) => b.total - a.total);
  }

  /* ---------- Beschlüsse & To-dos ---------- */
  function decisionsEl() {
    const d = state.decisions;
    const box = el(`<div class="h8-decisions"></div>`);
    function draw() {
      box.innerHTML = `
        <label>Oberthema 2026/27<input data-k="oberthema" value="${esc(d.oberthema)}" placeholder="z. B. Wasser:zeichen"></label>
        <label>Untertitel / Leitfrage<input data-k="claim" value="${esc(d.claim)}" placeholder="z. B. Was uns trägt, trennt und verbindet"></label>
        <label>Weitere Beschlüsse<textarea data-k="beschluesse" rows="4" placeholder="Absprachen, Zuständigkeiten …">${esc(d.beschluesse)}</textarea></label>
        <label>Nächster Termin<input data-k="termin" value="${esc(d.termin)}" placeholder="z. B. Mi 13.01.2027, 17 Uhr"></label>
        <div class="h8-todos"><div class="h8-todo-head"><b>To-dos</b><span>wer</span><span>bis</span></div>
          ${d.todos.map((t, i) => `<div class="h8-todo" data-i="${i}"><label class="h8-todo-was"><input type="checkbox" data-t="done" ${t.done ? "checked" : ""}><input data-t="was" value="${esc(t.was)}" placeholder="Aufgabe"></label>
            <select data-t="wer">${["", ...D.meta.teilnehmende, "alle"].map((p) => `<option ${p === t.wer ? "selected" : ""}>${p}</option>`).join("")}</select>
            <input data-t="bis" value="${esc(t.bis)}" placeholder="Datum"><button data-del title="To-do löschen">×</button></div>`).join("")}
          <button class="h8-mini" data-add-todo>＋ To-do</button></div>`;
      box.querySelectorAll("[data-k]").forEach((i) => i.addEventListener("input", () => { d[i.dataset.k] = i.value; save(); notify(); }));
      box.querySelectorAll(".h8-todo").forEach((row) => {
        const t = d.todos[+row.dataset.i];
        row.querySelectorAll("[data-t]").forEach((i) => i.addEventListener(i.type === "checkbox" ? "change" : "input", () => {
          t[i.dataset.t] = i.type === "checkbox" ? i.checked : i.value; save(); notify();
        }));
        row.querySelector("[data-del]").addEventListener("click", () => { d.todos.splice(+row.dataset.i, 1); save(); draw(); notify(); });
      });
      box.querySelector("[data-add-todo]").addEventListener("click", () => {
        d.todos.push({ was: "", wer: "", bis: "", done: false }); save(); draw();
        const rows = box.querySelectorAll(".h8-todo [data-t=was]"); rows[rows.length - 1].focus();
      });
    }
    draw(); box._redraw = draw; return box;
  }

  /* ---------- Agenda mit Zeitnahme ---------- */
  function agendaEl() {
    const box = el(`<div class="h8-agenda"></div>`);
    const a = state.agenda;
    function spent(id) { return (a.spent[id] || 0) + (a.active === id && a.startedAt ? Date.now() - a.startedAt : 0); }
    function draw() {
      box.innerHTML = D.agenda.map((g, i) => {
        const s = spent(g.id), mins = s / 60000, over = mins > g.min;
        const pct = Math.min(100, (mins / g.min) * 100);
        return `<button class="h8-ag ${a.active === g.id ? "on" : ""} ${over ? "over" : ""}" data-ag="${g.id}" title="${esc(g.text)}">
          <span class="h8-ag-n">${i + 1}</span><span class="h8-ag-t">${esc(g.titel)}</span>
          <span class="h8-ag-m">${Math.floor(mins)}/${g.min}′</span><span class="h8-ag-bar" style="width:${pct}%"></span></button>`;
      }).join("");
      box.querySelectorAll("[data-ag]").forEach((b) => b.addEventListener("click", () => {
        const id = b.dataset.ag;
        if (a.active) { a.spent[a.active] = spent(a.active); }
        if (a.active === id) { a.active = null; a.startedAt = null; }
        else { a.active = id; a.startedAt = Date.now(); const g = D.agenda.find((x) => x.id === id); H8.onAgenda && H8.onAgenda(g); }
        save(); draw();
      }));
    }
    draw(); setInterval(() => { if (a.active) draw(); }, 15000);
    return box;
  }

  /* ---------- eigene Kachel anlegen (ohne Browser-Dialoge) ---------- */
  function addTileEl(clusterId) {
    const f = el(`<form class="h8-addtile"><input name="titel" placeholder="Neue Kachel: Titel" required><input name="text" placeholder="Kurzbeschreibung (optional)"><button>＋ Kachel</button></form>`);
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const t = { id: "custom-" + uid(), kicker: "Ergänzt von " + state.me, titel: f.titel.value.trim(), text: esc(f.text.value.trim()), custom: true };
      (state.custom[clusterId] = state.custom[clusterId] || []).push(t); changed();
    });
    return f;
  }

  /* ---------- Werkzeugleiste ---------- */
  function toolbarEl(current) {
    const layouts = [["board.html", "Board"], ["kompass.html", "Kompass"], ["werkstatt.html", "Werkstatt"]];
    const tb = el(`<div class="h8-toolbar">
      <label class="h8-me">Ich bin <select>${D.meta.teilnehmende.map((p) => `<option ${p === state.me ? "selected" : ""}>${p}</option>`).join("")}<option value="__neu">+ Name …</option></select></label>
      <nav class="h8-layouts">${layouts.map(([u, n]) => `<a href="${u}" class="${u === current ? "on" : ""}">${n}</a>`).join("")}</nav>
      <div class="h8-export">
        <button data-x="html" title="Gesprächsergebnis als HTML-Datei speichern">⬇ HTML</button>
        <button data-x="pdf" title="Gesprächsergebnis drucken / als PDF sichern">⎙ PDF</button>
        <button data-x="json" title="Alle Notizen als JSON sichern (wieder importierbar)">⬇ JSON</button>
        <label class="h8-import" title="JSON-Sicherung laden">⬆<input type="file" accept=".json,application/json" hidden></label>
      </div></div>`);
    const sel = tb.querySelector("select");
    sel.addEventListener("change", () => {
      if (sel.value === "__neu") {
        const inp = el(`<input class="h8-newname" placeholder="Name + Enter">`);
        sel.replaceWith(inp); inp.focus();
        inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && inp.value.trim()) { state.me = inp.value.trim(); state.extraPeople = state.extraPeople || []; if (!D.meta.teilnehmende.includes(state.me)) { D.meta.teilnehmende.push(state.me); state.extraPeople.push(state.me); } save(); location.reload(); } });
        return;
      }
      state.me = sel.value; save();
    });
    tb.querySelector('[data-x="html"]').addEventListener("click", () => download(`Horizont8_Gespraechsergebnis_${stamp()}.html`, reportHTML(), "text/html"));
    tb.querySelector('[data-x="pdf"]').addEventListener("click", printReport);
    tb.querySelector('[data-x="json"]').addEventListener("click", () => download(`Horizont8_Sicherung_${stamp()}.json`, JSON.stringify(state, null, 2), "application/json"));
    tb.querySelector('input[type=file]').addEventListener("change", (e) => {
      const file = e.target.files[0]; if (!file) return;
      file.text().then((txt) => { try { state = Object.assign(blank(), JSON.parse(txt)); H8.state = state; changed(); toast("Sicherung geladen"); } catch (_) { toast("Datei ist keine gültige Sicherung"); } });
    });
    return tb;
  }

  function stamp() { const d = new Date(); return d.toISOString().slice(0, 10) + "_" + String(d.getHours()).padStart(2, "0") + String(d.getMinutes()).padStart(2, "0"); }
  function download(name, content, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: type + ";charset=utf-8" }));
    a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function toast(msg) {
    const t = el(`<div class="h8-toast">${esc(msg)}</div>`); document.body.appendChild(t); setTimeout(() => t.remove(), 2200);
  }

  /* ---------- Gesprächsergebnis ---------- */
  function reportHTML() {
    const d = state.decisions, rk = ranking();
    const date = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
    const sections = clusters().map((c) => {
      const items = c.tiles.map((t) => {
        const ns = state.notes[t.id] || [];
        const ck = t.checks ? t.checks.map((q, i) => ({ q, ok: (state.checks[t.id] || {})[i] })) : [];
        if (!ns.length && !ck.some((x) => x.ok) && !t.custom) return "";
        return `<div class="it"><h4>${esc(t.titel)}${t.custom ? ' <small>(neu ergänzt)</small>' : ""}</h4>
          ${t.custom && t.text ? `<p>${t.text}</p>` : ""}
          ${ck.length ? `<ul class="ck">${ck.map((x) => `<li class="${x.ok ? "ok" : ""}">${x.ok ? "☑" : "☐"} ${esc(x.q)}</li>`).join("")}</ul>` : ""}
          ${ns.length ? `<ul>${ns.map((n) => `<li><span class="au" style="background:${colorOf(n.author)}">${esc(n.author)}</span> ${esc(n.text).replace(/\n/g, "<br>")}</li>`).join("")}</ul>` : ""}</div>`;
      }).join("");
      return items ? `<section><h3>${esc(c.kurz)} · ${esc(c.titel)}</h3>${items}</section>` : "";
    }).join("");
    const free = (state.free || []).filter((f) => f.text && f.text.trim());
    return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Horizont:8 · Gesprächsergebnis ${date}</title>
<style>
 body{font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1c2430;max-width:860px;margin:32px auto;padding:0 24px}
 header{border-bottom:3px solid #1c2430;padding-bottom:12px;margin-bottom:20px} h1{margin:0;font-size:30px;letter-spacing:-.02em}
 h1 span{color:#d84315} .sub{color:#5b6573} h2{font-size:19px;margin:28px 0 10px;border-left:5px solid #d84315;padding-left:10px}
 h3{font-size:16px;margin:22px 0 6px;color:#3949ab} h4{margin:10px 0 4px;font-size:14.5px} .it{break-inside:avoid}
 .box{background:#fff4e5;border:1px solid #ffcc80;border-radius:10px;padding:14px 18px} .big{font-size:24px;font-weight:700;margin:0}
 table{border-collapse:collapse;width:100%} td,th{border-bottom:1px solid #dde2ea;padding:6px 8px;text-align:left;vertical-align:top}
 th{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#5b6573} ul{margin:4px 0 8px;padding-left:20px}
 .au{display:inline-block;font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;color:#1c2430;margin-right:4px}
 .ck{list-style:none;padding-left:0;color:#5b6573} .ck .ok{color:#1c2430} .done{text-decoration:line-through;color:#8a93a0}
 footer{margin-top:40px;font-size:12px;color:#8a93a0;border-top:1px solid #dde2ea;padding-top:8px}
 @media print{body{margin:0}a{color:inherit}}
</style></head><body>
<header><h1>Horizont<span>:</span>8 · Gesprächsergebnis</h1>
<div class="sub">${esc(D.meta.untertitel)} · ${date} · Klassen ${esc(D.meta.klassen)}<br>Teilnehmende: ${D.meta.teilnehmende.map(esc).join(", ")}</div></header>
<h2>Oberthema</h2><div class="box"><p class="big">${esc(d.oberthema) || "noch offen"}</p>${d.claim ? `<p>${esc(d.claim)}</p>` : ""}</div>
<h2>Meinungsbild Themen</h2><table><tr><th>Vorschlag</th><th>Punkte</th><th>von</th></tr>
${rk.map((r) => `<tr><td><b>${esc(r.tile.titel)}</b>${r.tile.claim ? " – " + esc(r.tile.claim) : ""}</td><td>${r.total}</td><td>${r.by.join(", ")}</td></tr>`).join("")}</table>
${d.beschluesse ? `<h2>Beschlüsse</h2><p>${esc(d.beschluesse).replace(/\n/g, "<br>")}</p>` : ""}
<h2>To-dos</h2>${d.todos.length ? `<table><tr><th>Aufgabe</th><th>wer</th><th>bis</th></tr>${d.todos.map((t) => `<tr class="${t.done ? "done" : ""}"><td>${t.done ? "☑" : "☐"} ${esc(t.was)}</td><td>${esc(t.wer)}</td><td>${esc(t.bis)}</td></tr>`).join("")}</table>` : "<p>–</p>"}
${d.termin ? `<h2>Nächster Termin</h2><p>${esc(d.termin)}</p>` : ""}
<h2>Notizen zu den Themenkomplexen</h2>${sections || "<p>Keine Notizen.</p>"}
${free.length ? `<h2>Freie Notizen (Board)</h2><ul>${free.map((n) => `<li><span class="au" style="background:${colorOf(n.author)}">${esc(n.author)}</span> ${esc(n.text)}</li>`).join("")}</ul>` : ""}
<footer>Erstellt mit dem Horizont:8-Board · Rosa-Luxemburg-Gymnasium Berlin · ${new Date().toLocaleString("de-DE")}</footer>
</body></html>`;
  }
  function printReport() {
    const w = window.open("", "_blank");
    if (!w) { toast("Pop-up blockiert – bitte erlauben oder HTML exportieren"); return; }
    w.document.open(); w.document.write(reportHTML()); w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 400);
  }

  /* ---------- Bild-Zoom & globale Klicks ---------- */
  document.addEventListener("click", (e) => {
    const img = e.target.closest("[data-zoom]");
    if (img) {
      const lb = el(`<div class="h8-lightbox" title="Schließen"><img src="${img.src}" alt="${esc(img.alt)}"></div>`);
      lb.addEventListener("click", () => lb.remove()); document.body.appendChild(lb); return;
    }
    const del = e.target.closest("[data-del-tile]");
    if (del) {
      const id = del.dataset.delTile;
      Object.keys(state.custom).forEach((k) => (state.custom[k] = state.custom[k].filter((t) => t.id !== id)));
      delete state.notes[id]; changed();
    }
  });
  document.addEventListener("change", (e) => {
    const c = e.target.closest("[data-check]");
    if (c) { const s = (state.checks[c.dataset.check] = state.checks[c.dataset.check] || {}); s[c.dataset.i] = c.checked; save(); notify(); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.querySelectorAll(".h8-lightbox").forEach((x) => x.remove()); });

  window.H8 = { data: D, state, save, changed, notify, esc, el, uid, colorOf, clusters, allTiles, tileBody, notesEl, voteEl, ranking,
    decisionsEl, agendaEl, addTileEl, toolbarEl, reportHTML, printReport, toast,
    onChange: (f) => listeners.push(f), onSoft: (f) => softListeners.push(f),
    get st() { return state; } };
})();
