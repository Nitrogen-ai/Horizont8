#!/usr/bin/env python3
"""Baut die Slides für das Orga-Treffen als PDF (16:9) aus assets/data.js.

Standard: Fassung MIT Namen (namen.local.json) → Horizont8_Slides_mit_Namen.pdf (gitignored).
Mit --oeffentlich: Rollen statt Namen → Horizont8_Slides.pdf.

Ablauf: data.js (+ Namen) per node auswerten → HTML-Slides in temporärer Datei →
headless Chrome --print-to-pdf.
Aufruf:  python3 werkzeuge/build_slides.py [--oeffentlich]
"""
import html
import json
import pathlib
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
E = html.escape


def load_data(with_names: bool) -> dict:
    src = (ROOT / "assets/data.js").read_text(encoding="utf-8")
    if with_names:
        for p in json.loads((ROOT / "namen.local.json").read_text(encoding="utf-8")):
            if p["oeffentlich"] not in src:
                sys.exit(f"Nicht in data.js gefunden: {p['oeffentlich']}")
            src = src.replace(p["oeffentlich"], p["mit_namen"])
    js = "global.window={};" + src + ";process.stdout.write(JSON.stringify(window.H8_DATA));"
    out = subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def main() -> None:
    public = "--oeffentlich" in sys.argv
    D = load_data(not public)
    C = {c["id"]: c for c in D["clusters"]}
    T = {t["id"]: t for c in D["clusters"] for t in c["tiles"]}
    img = lambda p: (ROOT / p).as_uri()
    people = D["meta"]["teilnehmende"]
    slides = []

    def slide(body, cls="", color="var(--accent)", kicker="", n=True):
        slides.append((body, cls, color, kicker, n))

    def li(items):
        return "<ul>" + "".join(f"<li>{x}</li>" for x in items) + "</ul>"

    def chips(items):
        return '<div class="chips">' + "".join(f"<span>{E(x)}</span>" for x in items) + "</div>"

    def tl(rows):
        return '<dl class="tl">' + "".join(f"<dt>{d}</dt><dd>{x}</dd>" for d, x in rows) + "</dl>"

    # 1 Titel
    slide(f"""<div class="title">
      <div class="logo">HORIZONT<span>:</span>8</div>
      <div class="otbox">Oberthema 2026/27 – heute finden</div>
      <p class="big">Erstes Orga-Treffen · Klassen 8.4 + 8.5</p>
      <p class="meta">{E(D['meta']['termin'])}<br>{' · '.join(f'{E(p)} <small>({E(D["meta"]["rollen"].get(p, ""))})</small>' for p in people)}</p>
      </div>""", "cover", n=False)

    # 2 Agenda
    rows = "".join(f'<div class="ag"><b>{i+1}</b><div><h3>{E(a["titel"])}</h3><p>{E(a["text"])}</p></div><span>{a["min"]}′</span></div>'
                   for i, a in enumerate(D["agenda"]))
    slide(f'<h1>Agenda <small>60 Minuten</small></h1><div class="agenda">{rows}</div>', kicker="17:00 Uhr")

    # 3 Was ist Horizont:8
    slide(f"""<h1>Was ist Horizont:8?</h1>
      <div class="cols2"><div>{li([
        "Zwei Wochen <b>hybrides Projektlernen</b>: Schule · zu Hause · außerschulische Lernorte",
        "Kleingruppen à 2–4, <b>klassenübergreifend</b>, nach Interesse statt Freundschaft",
        "Offenes Oberthema → eigene Projektidee → <b>archivierbares Lernprodukt</b>",
        "Jede Gruppe hat eine betreuende Lehrperson",
        "Präsentation vor anderen Klassen und Eltern",
        "<b>Keine Noten</b>: Freiheit + Verantwortung = echtes Lernen"])}</div>
      <div><img class="shot" src="{img('img/miro-grundsaetze.jpg')}" style="object-position:50% 8%"></div></div>""", kicker="Rahmen")

    # 4 Referenz
    slide(f"""<h1>Referenz: Leibniz-Gymnasium · PHASE 8</h1>
      <p class="lead">{E(C['referenz']['sub'])}</p>
      <div class="cols3">
        <div class="card"><h3>Ablauf</h3>{li(T['ref-ablauf']['bullets'])}</div>
        <div class="card"><h3>Evaluation</h3><p>{T['ref-feedback']['text']}</p></div>
        <div class="card hl"><h3>Übertrag aufs RLG</h3>{li(T['ref-lehre']['bullets'])}</div>
      </div>""", color="var(--c-slate)", kicker="A · vor 2026")

    # 5 Pilot
    slide(f"""<h1>Pilot 2026 · Beweg:gründe</h1>
      <p class="lead">{E(C['pilot']['sub'])}</p>
      <div class="cols2"><div>
        <h3>8 Themenbereiche</h3>{chips(T['pil-bereiche']['chips'])}
        <h3>So lief es</h3>{li(T['pil-orga']['bullets'])}
      </div><div><img class="shot" src="{img('img/miro-themenbereiche.jpg')}"></div></div>""", color="var(--c-coral)", kicker="B · Pilot")

    # 6 Produktpalette
    slide(f"""<h1>Werkzeugkasten aus dem Pilot</h1>
      <div class="cols2"><div><h3>15 Präsentationsformen</h3>{chips(T['pil-formen']['chips'])}</div>
      <div><h3>15 digitale Werkzeuge</h3>{chips(T['pil-tools']['chips'])}</div></div>
      <p class="note">Wiederverwendbar für den Kick-off: Kompass-Text, Meilenstein-Berg, Grundsätze hybriden Lernens</p>""", "roomy",
          color="var(--c-coral)", kicker="B · Pilot")

    # 7 Ergebnisse
    ph = [("erg-konsole", "img/IMG_0801.jpg"), ("erg-fussball", None), ("erg-geld", "img/IMG_0800.jpg"),
          ("erg-tauben", "img/IMG_0806.jpg"), ("erg-figuren", "img/IMG_0804.jpg"), ("erg-rover", "img/IMG_0810.jpg")]
    cards = ""
    for tid, p in ph:
        t = T[tid]
        pic = f'<img src="{img(p)}">' if p else '<div class="noimg">⚽<br><small>Web-App · digital</small></div>'
        badge = f'<span class="badge">{E(t["badge"])}</span>' if t.get("badge") else ""
        cards += f'<div class="ph">{pic}<div><small>{E(t["kicker"])}</small><b>{E(t["titel"])}</b>{badge}</div></div>'
    slide(f'<h1>Projektergebnisse 2026 <small>Gallery Walk 07.07.</small></h1><div class="photos">{cards}</div>',
          color="var(--c-teal)", kicker="C · Role-Models")

    # 8 Quick Facts
    slide(f"""<h1>Quick Facts 2027</h1>
      <div class="cols2"><div><h3>Termine</h3>{tl(T['org-termine']['timeline'])}</div>
      <div><h3>{E(T['org-rahmen']['titel'])}</h3>{li(T['org-rahmen']['bullets'])}
      <h3>{E(T['org-kl']['titel'])}</h3>{li(T['org-kl']['bullets'])}</div></div>""", color="var(--c-amber)", kicker="D · Orga")

    # 9 Partner
    hb = T['par-humboldt']
    slide(f"""<h1>Partner & Lernorte</h1>
      <div class="cols3">
        <div class="card"><span class="st ok">Zusage</span><h3>Futurium · Zukunftsboxen</h3><p>Vor Ort, angeleitet, ca. 60 min · nur nach Termin · keine Geräte</p>{chips(T['par-futurium']['chips'])}</div>
        <div class="card"><span class="st wait">Anfrage läuft · bis 22.12.</span><h3>Medienzentrum Pankow</h3>{li(["Vorstellung am Kick-off 31.05.", "Offene Freizeitangebote", "Betreuung beim Lernprodukt (Tonstudio, MakerSpace), auch mehrtägig"])}</div>
        <div class="card hl"><span class="st idea">{E(hb['kicker'].replace('💡 ', ''))}</span><h3>Humboldt Forum · Wasser</h3>{li(["<b>On Water. WasserWissen in Berlin</b> – Humboldt Labor, Eintritt frei", "<b>Agua</b> – Kunst und Kosmologien des Wassers, 28.11.26–12.07.27", "⚠ dienstags geschlossen → nicht am Di 01.06."])}</div>
      </div>""", color="var(--c-violet)", kicker="E · Partner")

    # 10 Themenfindung: Kriterien + Ideen
    slide(f"""<h1>Themenfindung: Woran messen wir ein Oberthema?</h1>
      <div class="cols2"><div><h3>Kriterien</h3>{li([
        "Offen genug für ca. 18 sehr unterschiedliche Gruppen",
        "Anschluss an Lernorte: Futurium, Medienzentrum, Humboldt Forum …",
        "Einladendes Wortspiel wie <b>Beweg:gründe</b>",
        "Technik, Gesellschaft, Kunst und Alltag haben Platz",
        "Nicht zu nah an Leibniz (Energie)"])}</div>
      <div><h3>Ideensammlung bisher</h3><p class="small">Rahmenlehrplan Teil B</p>{chips(["Europabildung", "Verbraucherbildung", "Interkulturelle Bildung", "Gewaltprävention"])}
      <p class="small">Weitere</p>{chips(["Energie", "Rohstoffe", "nachhaltige Zukunft", "mein Kiez", "digitale Welt", "Konsum", "Zukunft", "Wasser"])}</div></div>""",
          color="var(--c-blue)", kicker="F · Themen")

    # 11 Fünf Kandidaten
    cand = [t for t in C["themen"]["tiles"] if not t["id"].endswith("kombi")]
    cc = "".join(f'<div class="cand"><small>{E(t["kicker"].split("·")[-1].strip())}</small><h2>{E(t["titel"])}</h2><p class="claim">{E(t["claim"])}</p><p>{E(t["text"])}</p><p class="deckt">{" · ".join(map(E, t["deckt"]))}</p><div class="dots">{"".join("<i></i>" for _ in people)}</div></div>' for t in cand)
    slide(f'<h1>Fünf Kandidaten <small>je 1 Punkt pro Person</small></h1><div class="cands">{cc}</div>', color="var(--c-blue)", kicker="F · Themen")

    # 12–16 je Kandidat
    for t in cand:
        slide(f"""<div class="th-head"><small>{E(t['kicker'])}</small><h1 class="huge">{E(t['titel'])}</h1><p class="claim big">{E(t['claim'])}</p></div>
          <div class="cols2"><div><p>{E(t['text'])}</p><h3>Themenfelder</h3>{chips(t['chips'])}</div>
          <div><h3>z. B.</h3><p>{E(t['beispiel'])}</p><div class="pc pro">＋ {E(t['pro'])}</div><div class="pc contra">－ {E(t['contra'])}</div></div></div>""",
              "th", color="var(--c-blue)", kicker="F · Themen")

    # 17 Empfehlung
    slide(f"""<h1>Empfehlung zum Bündeln</h1><div class="reco"><p>{T['th-kombi']['text']}</p></div>
      <div class="cols3 anchors"><div class="card"><b>1</b><h3>Gemeinsamer Start</h3><p>Humboldt Labor „On Water“ – z. B. Mo 14.06.</p></div>
      <div class="card"><b>2</b><h3>Zukunftsfokus</h3><p>Futurium-Boxen Städte · Ernährung · Energie · Gesundheit</p></div>
      <div class="card"><b>3</b><h3>Produkt</h3><p>Medienzentrum: Podcast, Film, MakerSpace</p></div></div>""", color="var(--c-blue)", kicker="F · Themen")

    # 18 Zu klären
    qs = "".join(f'<div class="card q"><h3><b>{E(t["kicker"])}</b> {E(t["titel"])}</h3>{li([E(x) for x in t["checks"]])}</div>' for t in C["fragen"]["tiles"][1:])
    slide(f'<h1>Zu klären</h1><div class="qs">{qs}</div>', color="var(--c-rose)", kicker="G · Fragen")

    # 19 Roadmap
    slide(f'<h1>Roadmap bis zum Kick-off</h1>{tl(T["org-roadmap"]["timeline"])}', "roomy", color="var(--c-amber)", kicker="D · Orga")

    # 20 Beschlüsse (zum Ausfüllen)
    lines = "".join('<div class="todo"><span></span><span></span><span></span></div>' for _ in range(5))
    slide(f"""<h1>Beschlüsse</h1><div class="fill"><label>Oberthema</label><div class="line big"></div>
      <label>Leitfrage</label><div class="line"></div></div>
      <div class="todos"><div class="todo head"><span>To-do</span><span>wer</span><span>bis</span></div>{lines}</div>
      <p class="note">Nächster Termin: ______________________ · Ergebnis wird im Board festgehalten → ⬇ HTML / ⎙ PDF</p>""", kicker="Ergebnis")

    css = """
    @page { size: 1280px 720px; margin: 0 }
    :root { --accent:#d84315; --fg:#1c2430; --muted:#5b6573; --bg:#f7f3ea; --card:#fffdf8; --line:#e4dccb;
      --c-slate:#607d8b; --c-coral:#e8604c; --c-teal:#00897b; --c-amber:#e09500; --c-violet:#7e57c2; --c-blue:#3b6fd8; --c-rose:#d81b60 }
    * { box-sizing:border-box } body { margin:0; font:20px/1.45 "Inter", -apple-system, "Helvetica Neue", sans-serif; color:var(--fg); -webkit-print-color-adjust:exact; print-color-adjust:exact }
    .s { width:1280px; height:720px; padding:58px 70px 50px; background:var(--bg); position:relative; overflow:hidden; page-break-after:always; border-top:12px solid var(--cc) }
    .s .kick { position:absolute; top:20px; left:70px; font-size:13px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--cc) }
    .s .num { position:absolute; bottom:18px; right:30px; font-size:13px; color:var(--muted) }
    .s .brand { position:absolute; bottom:18px; left:70px; font-size:13px; font-weight:800; color:var(--muted) } .brand span{color:var(--accent)}
    h1 { font-size:46px; margin:0 0 18px; letter-spacing:-.025em; line-height:1.05 } h1 small { font-size:.45em; color:var(--muted); font-weight:500; letter-spacing:0; margin-left:12px }
    h2 { margin:0; letter-spacing:-.02em } h3 { font-size:19px; margin:14px 0 6px; color:var(--cc) }
    ul { margin:4px 0; padding-left:22px } li { margin:4px 0 } p { margin:6px 0 }
    .lead { color:var(--muted); margin:-8px 0 16px; font-size:18px }
    .cols2 { display:grid; grid-template-columns:1fr 1fr; gap:44px } .cols3 { display:grid; grid-template-columns:repeat(3,1fr); gap:22px }
    .card { background:var(--card); border:1px solid var(--line); border-radius:16px; padding:16px 20px; font-size:17px; box-shadow:0 2px 10px rgba(0,0,0,.04) }
    .card.hl { border:2px solid var(--cc) } .card h3 { margin-top:2px }
    .chips { display:flex; flex-wrap:wrap; gap:7px; margin:6px 0 10px } .chips span { background:#efe8d8; border-radius:99px; padding:3px 13px; font-size:15.5px }
    .tl { display:grid; grid-template-columns:max-content 1fr; gap:9px 22px; margin:6px 0; font-size:19px } .tl dt { font-weight:800; color:var(--cc) } .tl dd { margin:0 }
    .shot { width:100%; height:470px; object-fit:cover; object-position:top; border-radius:14px; box-shadow:0 6px 24px rgba(0,0,0,.12) }
    .note { position:absolute; bottom:52px; left:70px; right:70px; color:var(--muted); font-size:16px }
    .small { font-size:14px; color:var(--muted); margin:10px 0 0; text-transform:uppercase; letter-spacing:.08em; font-weight:700 }
    .cover { background:#1c2430; color:#f7f3ea; border-top:0; display:flex; align-items:center }
    .title .logo { font-size:150px; font-weight:900; letter-spacing:-.05em; line-height:.9 } .logo span { color:#ff7a59 }
    .otbox { display:inline-block; margin:22px 0 26px; border:3px dashed #ff7a59; color:#ff7a59; border-radius:16px; padding:8px 24px; font-size:34px; font-weight:700 }
    .title .big { font-size:30px; margin:0 } .title .meta { color:#b7c0cc; font-size:20px } .title small { color:#8792a2 }
    .agenda { display:grid; gap:14px } .ag { display:grid; grid-template-columns:56px 1fr 80px; align-items:center; background:var(--card); border:1px solid var(--line); border-radius:16px; padding:12px 20px }
    .ag > b { font-size:34px; color:var(--accent) } .ag h3 { margin:0; color:var(--fg); font-size:23px } .ag p { margin:0; color:var(--muted); font-size:16.5px } .ag span { font-size:26px; font-weight:800; text-align:right; color:var(--muted) }
    .photos { display:grid; grid-template-columns:repeat(3,1fr); gap:18px }
    .ph { background:var(--card); border-radius:14px; overflow:hidden; border:1px solid var(--line); display:grid; grid-template-rows:170px auto }
    .ph img { width:100%; height:170px; object-fit:cover } .ph > div:last-child { padding:9px 14px 11px; font-size:16px } .ph small { display:block; color:var(--cc); font-weight:700; font-size:12.5px; text-transform:uppercase; letter-spacing:.06em } .ph b { display:block; line-height:1.2 }
    .noimg { display:grid; place-items:center; text-align:center; font-size:60px; background:linear-gradient(135deg,#2e7d32,#66bb6a); color:#fff; line-height:1 } .noimg small { font-size:15px }
    .badge { display:inline-block; margin-top:4px; background:var(--accent); color:#fff; font-size:11px; font-weight:800; padding:2px 8px; border-radius:6px; text-transform:uppercase; letter-spacing:.04em }
    .st { display:inline-block; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:.06em; padding:3px 9px; border-radius:6px; color:#fff }
    .st.ok { background:#2e7d32 } .st.wait { background:#e09500 } .st.idea { background:var(--accent) }
    .cands { display:grid; grid-template-columns:repeat(5,1fr); gap:14px } .cand { background:var(--card); border:1px solid var(--line); border-top:7px solid var(--cc); border-radius:12px; padding:14px 14px 50px; font-size:14.5px; position:relative; min-height:470px }
    .cand small { color:var(--muted); font-weight:700; font-size:11.5px; text-transform:uppercase; letter-spacing:.05em } .cand h2 { font-size:27px; margin:4px 0 2px; color:var(--cc) }
    .claim { font-weight:700; color:var(--accent) } .claim.big { font-size:30px; margin:0 } .deckt { color:var(--muted); font-size:13px }
    .dots { position:absolute; bottom:14px; left:14px; display:flex; gap:8px } .dots i { width:24px; height:24px; border-radius:50%; border:2px dashed #c9bfa9 }
    .th { font-size:23px } .th .chips span { font-size:18px; padding:4px 14px } .th .pc { font-size:20px } .th h3 { font-size:21px }
    .roomy .chips span { font-size:19px; padding:5px 15px } .roomy .chips { gap:10px } .roomy .tl { font-size:24px; gap:16px 28px }
    .th-head { margin-bottom:10px } .th-head small { color:var(--cc); font-weight:800; text-transform:uppercase; letter-spacing:.12em; font-size:14px } .huge { font-size:84px; margin:0; color:var(--cc); letter-spacing:-.04em }
    .pc { padding:10px 14px; border-radius:10px; margin:10px 0; font-size:17px } .pc.pro { background:#e5f2e3 } .pc.contra { background:#f8e3e1 }
    .reco { background:var(--card); border-left:8px solid var(--cc); border-radius:12px; padding:16px 24px; font-size:21px; margin-bottom:22px }
    .anchors .card b { font-size:38px; color:var(--cc); line-height:1 }
    .qs { display:grid; grid-template-columns:1fr 1fr; gap:16px } .q { font-size:16px } .q h3 b { color:var(--accent) }
    .fill label { display:block; font-size:14px; text-transform:uppercase; letter-spacing:.1em; color:var(--muted); font-weight:800; margin-top:6px }
    .line { border-bottom:2.5px solid var(--fg); height:42px; margin-bottom:12px } .line.big { height:64px }
    .todos { margin-top:12px } .todo { display:grid; grid-template-columns:1fr 160px 160px; gap:20px } .todo span { border-bottom:1.5px solid #c9bfa9; height:36px }
    .todo.head span { border:0; height:auto; font-size:14px; font-weight:800; text-transform:uppercase; letter-spacing:.1em; color:var(--muted) }
    """
    total = len(slides)
    parts = []
    for i, (body, cls, color, kicker, n) in enumerate(slides, 1):
        foot = f'<div class="brand">HORIZONT<span>:</span>8 · Orga-Treffen 25.11.2026</div><div class="num">{i} / {total}</div>' if n else ""
        k = f'<div class="kick">{E(kicker)}</div>' if kicker else ""
        parts.append(f'<section class="s {cls}" style="--cc:{color}">{k}{body}{foot}</section>')
    doc = f'<!doctype html><html lang="de"><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(parts)}</body></html>'

    out = ROOT / ("Horizont8_Slides.pdf" if public else "Horizont8_Slides_mit_Namen.pdf")
    with tempfile.TemporaryDirectory() as tmp:
        h = pathlib.Path(tmp) / "slides.html"
        h.write_text(doc, encoding="utf-8")
        subprocess.run([CHROME, "--headless=new", "--no-pdf-header-footer", f"--user-data-dir={tmp}/chr",
                        "--virtual-time-budget=4000", f"--print-to-pdf={out}", h.as_uri()],
                       check=True, capture_output=True)
    print(f"geschrieben: {out.name} ({total} Folien)")


if __name__ == "__main__":
    main()
