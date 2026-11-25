# Horizont:8 · Orga-Board 2026/27

Interaktives Board für die Planung von **Horizont:8** am Rosa-Luxemburg-Gymnasium Berlin (Klassen 8.4 + 8.5, Projektphase 14.–25.06.2027). Es begleitet das erste Orga-Treffen am 25.11.2026 und soll als Baustein für die Kick-off-Tage (31.05./01.06.2027) weiterwachsen.

**Live:** https://nitrogen-ai.github.io/Horizont8/

## Drei Layouts – eine Datenbasis
| Datei | Zweck |
|---|---|
| `werkstatt.html` | Cockpit für Videocalls: Agenda mit Zeitnahme, Cluster-Navigation, Punkte + Beschlüsse daneben |
| `board.html` | Miro-artige Fläche: Rahmen je Cluster, Zoom/Verschieben, freie Haftnotizen per Doppelklick |
| `kompass.html` | Scroll-Layout im Beweg:gründe-Kompass-Stil; Oberthema und Kompassnadel folgen den Beschlüssen und Punkten |

Alle Inhalte stehen in `assets/data.js` (Cluster → Kacheln). Logik für Notizen, Punkte, Beschlüsse und Export steht in `assets/app.js`, die gemeinsamen Komponenten in `assets/base.css`.

## Lerntagebuch für Projektteilnehmende
`lerntagebuch.html` ist das eJournal für die Projektphase 14.–25.06.2027. Es basiert auf dem Laborjournal aus dem Chemie-Repo: Speicherung in IndexedDB, Fotos, Export als .html/.zip, Endfassung mit Prüfsumme, PDF. Neu sind die Karte „＋ Heutiger Lerntag“ (Lernort, Zeit, drei kurze Fragen, Stimmung, Foto als Beleg), die Wochenleiste der zehn Projekttage und die Anzeige der Lernort-Pflicht (mind. Futurium oder Humboldt Forum). Direktlink für einen QR-Code: `lerntagebuch.html?heute`.

## Notizen & Gesprächsergebnis
- Notizen, Punkte, Häkchen, Beschlüsse und eigene Kacheln werden im **localStorage des eigenen Browsers** gespeichert und gelten für alle drei Layouts.
- **⬇ HTML** und **⎙ PDF** erzeugen das Gesprächsergebnis (Oberthema, Meinungsbild, Beschlüsse, To-dos, alle Notizen). Am besten in `02_Gespraechsergebnisse/` ablegen; der Ordner ist bewusst nicht im Repo.
- **⬇ JSON** sichert den kompletten Stand, **⬆** lädt ihn wieder, z. B. auf einem anderen Gerät.
- Keine personenbezogenen Daten von Lernenden eintragen.

## Für die Kick-off-Tage weiterverwenden
1. In `assets/data.js` den Wert `meta.storageKey` ändern (z. B. `h8-kickoff-2027`), damit ein frischer Stand entsteht.
2. Die Cluster ersetzen, z. B. durch Kompass-Text, Themenfelder des Oberthemas, Präsentationsformen, Tools und Lernorte. Kacheln mit `voting: true` im Cluster werden punktbar.
3. Lernende können im Board selbst Kacheln ergänzen (Formular unter jedem Cluster).

## Lokale Fassung mit Namen
Die öffentliche Fassung nennt nur Rollen (Orga 1/2, KL 1/2). Mit `python3 werkzeuge/build_lokal.py` entstehen lokal `Horizont8_mit_Namen*.html` (Werkstatt, Board, Kompass): Daten, CSS und Logik sind eingebettet, die Namen kommen aus `namen.local.json`. Beides ist gitignored.

Slides für Treffen: `python3 werkzeuge/build_slides.py` erzeugt `Horizont8_Slides_mit_Namen.pdf` (20 Folien, 16:9, lokal). Mit `--oeffentlich` entsteht `Horizont8_Slides.pdf` mit Rollen statt Namen.

## Ordner (iCloud-Arbeitsordner)
- `00_Quellen/`: Originale (Mails, PDFs, Fotos, Video), **nicht im Repo**
- `01_Cluster/README.md`: Clusterung mit Quellenzuordnung, Übergabe-Chronik und offenen Widersprüchen
- `02_Gespraechsergebnisse/`: Exporte aus den Treffen, **nicht im Repo**
- `img/`: verkleinerte Fotos der Projektergebnisse 2026 und Ausschnitte aus dem Miro-Board
