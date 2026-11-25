#!/usr/bin/env python3
"""Baut die lokalen Board-Kopien MIT Namen (nicht im Repo).

Öffentliche Fassung: assets/data.js (Rollen statt Namen).
Namenszuordnung:     namen.local.json (gitignored) – Liste {oeffentlich, mit_namen}.
Ausgabe (gitignored, im Projektordner, damit img/ erreichbar bleibt):
  Horizont8_mit_Namen.html          (Werkstatt – für Videocalls)
  Horizont8_mit_Namen_board.html
  Horizont8_mit_Namen_kompass.html
CSS, Daten und Logik werden eingebettet, Bilder bleiben unter img/.

Aufruf:  python3 werkzeuge/build_lokal.py
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
LAYOUTS = {
    "werkstatt.html": "Horizont8_mit_Namen.html",
    "board.html": "Horizont8_mit_Namen_board.html",
    "kompass.html": "Horizont8_mit_Namen_kompass.html",
}


def main() -> int:
    mapping_file = ROOT / "namen.local.json"
    if not mapping_file.exists():
        print("namen.local.json fehlt – lokale Fassung kann nicht gebaut werden.", file=sys.stderr)
        return 1
    pairs = json.loads(mapping_file.read_text(encoding="utf-8"))

    data = (ROOT / "assets/data.js").read_text(encoding="utf-8")
    missing = [p["oeffentlich"] for p in pairs if p["oeffentlich"] not in data]
    if missing:
        print("Nicht gefunden in data.js (Text geändert?):\n  " + "\n  ".join(missing), file=sys.stderr)
        return 1
    for p in pairs:
        data = data.replace(p["oeffentlich"], p["mit_namen"])

    css = (ROOT / "assets/base.css").read_text(encoding="utf-8")
    app = (ROOT / "assets/app.js").read_text(encoding="utf-8")
    guard = lambda js: js.replace("</script", "<\\/script")

    for src, dst in LAYOUTS.items():
        html = (ROOT / src).read_text(encoding="utf-8")
        html = html.replace('<link rel="stylesheet" href="assets/base.css">', f"<style>\n{css}\n</style>")
        html = html.replace('<script src="assets/data.js"></script>', f"<script>\n{guard(data)}\n</script>")
        html = html.replace('<script src="assets/app.js"></script>', f"<script>\n{guard(app)}\n</script>")
        assert "assets/" not in html, f"{src}: nicht alle Assets eingebettet"
        # Layout-Umschalter auf die lokalen Kopien umbiegen (steht in app.js)
        for s2, d2 in LAYOUTS.items():
            html = html.replace(f'["{s2}",', f'["{d2}",').replace(f'toolbarEl("{s2}")', f'toolbarEl("{d2}")')
        html = html.replace("<title>Horizont:8 ·", "<title>Horizont:8 (mit Namen) ·")
        (ROOT / dst).write_text(html, encoding="utf-8")
        print("geschrieben:", dst)
    return 0


if __name__ == "__main__":
    sys.exit(main())
