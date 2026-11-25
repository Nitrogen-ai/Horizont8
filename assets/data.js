/* Horizont:8 · gemeinsame Datenbasis für alle Layouts (board / kompass / werkstatt).
   Für die Kick-off-Tage: Cluster/Kacheln hier ergänzen oder ersetzen – die Layouts
   lesen ausschließlich diese Datei. Kacheln brauchen eine eindeutige id
   (Notizen hängen an der id!). Text darf einfaches HTML enthalten. */
window.H8_DATA = {
  meta: {
    titel: "Horizont:8",
    untertitel: "Orga-Treffen 2026/27 · Themenfindung",
    termin: "Mi 25.11.2026 · 17:00 Uhr · Videocall",
    klassen: "8.4 + 8.5",
    teilnehmende: ["Orga 1", "Orga 2", "KL 1", "KL 2"],
    rollen: { "Orga 1": "Orga (operativ)", "Orga 2": "Orga (Kontakte, Termine, Partner)", "KL 1": "Klassenleitung", "KL 2": "Klassenleitung" },
    storageKey: "h8-orga-2026-11-25"
  },

  agenda: [
    { id: "ag1", min: 10, titel: "Einblick Horizont:8", text: "Referenz Leibniz-Gymnasium (PHASE 8) und RLG-Pilot 2026 „Beweg:gründe“ – was hat funktioniert?", cluster: "pilot" },
    { id: "ag2", min: 10, titel: "Quick Facts & Partner", text: "Termine 2027, Stand Futurium/Medienzentrum, Rolle der KL", cluster: "orga" },
    { id: "ag3", min: 25, titel: "Themenfindung", text: "Kandidaten vorstellen, punkten, Oberthema festlegen oder auf 2 eingrenzen", cluster: "themen" },
    { id: "ag4", min: 10, titel: "Klassen & Betreuung", text: "Besonderheiten 8.4/8.5, Unterstützungsbedarf, Kennenlernen vor dem Kick-off", cluster: "fragen" },
    { id: "ag5", min: 5,  titel: "Beschlüsse & To-dos", text: "Wer macht was bis wann? Nächster Termin?", cluster: "beschluss" }
  ],

  clusters: [
    /* ───────────────────────── A · Referenz vor 2026 ───────────────────────── */
    {
      id: "referenz", kurz: "A", titel: "Referenz vor 2026", farbe: "slate",
      sub: "Leibniz-Gymnasium Berlin · PHASE 8 (Jan. 2023 + Jan./Feb. 2024) · Schulversuch BE.hybrid",
      tiles: [
        { id: "ref-ziele", kicker: "Ziele", titel: "Wofür PHASE 8 steht",
          bullets: ["Eigene Interessen finden, Stärken einbringen", "Eigenverantwortlich an (außer)schulischen Lernorten arbeiten – mit Einverständnis der Eltern", "Teamarbeit selbst organisieren, analog + digital verbinden", "Produkt zum festen Termin fertigstellen und ansprechend präsentieren", "<b>Keine Bewertung, kein Notendruck</b>"] },
        { id: "ref-deeper", kicker: "Didaktik", titel: "Deeper Learning",
          text: "Direkte Instruktion + selbstorganisierte, problemlösende Vertiefung; Fachwissen mehrerer Fächer zusammengeführt (Phasenmodell nach Sliwka/Klopsch 2022). Rahmenthema dort: <b>Energie</b>." },
        { id: "ref-ablauf", kicker: "Ablauf", titel: "2 Wochen, klar getaktet",
          bullets: ["Mo: Überblick, Recherche, Gruppenfindung, Teambuilding", "Di/Mi: Pflichtbesuch Museum (Spectrum/Futurium) + Unternehmen/Verein", "Woche 2: Zwischenpräsentation in der Schule, Tagesziel „Produkt finalisieren“", "Do 16:30–18:30 Präsentation, Fr Auswertung + Zeugnisse"] },
        { id: "ref-tools", kicker: "Werkzeuge", titel: "Hilfsmittel",
          bullets: ["Miro-Board als Materialpool + Produktpalette", "Arbeitsplan je Gruppe, Raumplan (Computerräume, Tablet-Klassensatz)", "Teams-Kanal mit Tageszielen, Kontakt ≥ 1× täglich", "Forms: Feedback Unternehmensbesuch, Museumsquiz (Selfie als Anwesenheit), QR-Feedback zu Präsentationen, Evaluation"] },
        { id: "ref-feedback", kicker: "Evaluation", titel: "Was Lernende & Eltern sagen",
          text: "Lernende (112 Antworten) nennen Fachwissen (38), Selbstorganisation (21), Technik (16), Teamwork (13). Wunsch: <b>weniger vorgegebene Termine</b>, anderes Rahmenthema, <b>Geld für Material</b>.<br>Eltern (80): Kritik vor allem an <b>zu wenig Führung/Unterstützung (13)</b>, Präsentationsform (7), Überforderung (5)." },
        { id: "ref-lehre", kicker: "Für uns", titel: "Übertrag auf das RLG",
          bullets: ["Leitfaden für betreuende Lehrpersonen = Antwort auf die Eltern-Kritik", "Wenige, dafür verbindliche Pflichttermine (Zwischenstand!)", "Materialgeld pro Gruppe → Schulverein (15/20 €)", "Ergebnisse als „Role-Models“ sichern"] }
      ]
    },

    /* ───────────────────────── B · Pilot 2026 ───────────────────────── */
    {
      id: "pilot", kurz: "B", titel: "Pilot 2026 · Beweg:gründe", farbe: "coral",
      sub: "RLG · 8.4 + 8.5 · Projektleitung + 2 Klassenleitungen · Projektwochen 22.06.–03.07.2026 · Gallery Walk 07.07.",
      tiles: [
        { id: "pil-kompass", kicker: "Kompass", titel: "Was bewegt dich?",
          text: "„Was bringt dich in Bewegung – körperlich, gedanklich, emotional?“ Offenes Oberthema mit Wortspiel, Kleingruppen nach Interesse statt Freundschaft, <b>keine Noten</b>.",
          img: "img/miro-themenbereiche.jpg", imgAlt: "Miro-Board Beweg:gründe mit acht Themenbereichen" },
        { id: "pil-bereiche", kicker: "8 Themenbereiche", titel: "Breite durch Themenfelder",
          chips: ["Philosophie & Wertefragen", "Psychologie & mentale Gesundheit", "Körperliche Bewegung & Gesundheit", "Physik & Technik", "Kunst & Ausdrucksformen", "Gesellschaftliche Bewegungen", "Ernährung, Konsum & Umwelt", "Digitale Welt & Medien"] },
        { id: "pil-formen", kicker: "Produktpalette", titel: "15 Präsentationsformen",
          chips: ["Ausstellung/Galerie", "Video/Reportage", "Modell", "Infoposter", "Theater/Tanz", "Rollen-/Planspiel", "Mitmachstation", "Installation", "Comic/Graphic Novel", "Podcast/Hörstück", "Website", "Experiment/Vorführung", "Musik/Rap", "Tagebuch/Erfahrungsbericht", "Eigene Idee"] },
        { id: "pil-tools", kicker: "Toolbox", titel: "15 digitale Werkzeuge",
          chips: ["iMovie/Clipchamp", "Soundtrap", "Figma", "Canva", "Google Slides/PowerPoint", "PosterMyWall", "Stop Motion Studio", "Genially", "Google Sites", "Audacity/GarageBand", "Padlet/Miro", "ThingLink", "Podcast-Plattform", "Adobe Express", "Trello/Notion"] },
        { id: "pil-verlauf", kicker: "Projektmanagement", titel: "Berg mit 8 Meilensteinen",
          text: "Projektverlauf als Bergpfad (Zukunftsvision → Herausforderung → Ziel → Wegmarken → Ausrüstung → Zusammenarbeit), Kick-off-Woche im Januar, Projektwochen im Juni. Lehre aus dem Board: <i>„Mir fielen die ausgewählten Tage nicht mehr ein“</i> – Termine sichtbar halten.",
          img: "img/miro-projektverlauf.jpg", imgAlt: "Projektverlauf als Berg mit Meilensteinen" },
        { id: "pil-grundsaetze", kicker: "Hybrides Lernen", titel: "Freiheit + Verantwortung = echtes Lernen",
          text: "Drei Lernorte (Schule · zu Hause online · außerschulisch) und sechs Anforderungen: Selbstorganisation, Teamarbeit & Kommunikation, digitale Kompetenzen, verantwortungsbewusstes Arbeiten, Lernorte flexibel nutzen, transparente Ergebnispräsentation.",
          img: "img/miro-grundsaetze.jpg", imgAlt: "Grundsätze hybriden Lernens: Inselkarte und Anforderungsrad" },
        { id: "pil-orga", kicker: "So lief es", titel: "Organisation im Pilot",
          bullets: ["Gruppen wollten vor allem <b>zu Hause</b> arbeiten", "2 Abfragen täglich per Mail (morgens/nachmittags) – wer nicht antwortet, arbeitet in der Schule", "Nicht betreuende Kolleg:innen ausgeplant, Betreuende nutzen ihre Stunden für Konsultationen", "Probleme → KL + Projektleitung", "Ergebnis: Gallery Walk in Aula + H-Gebäude, 2 Slots (8.1–8.3, dann 7.4/7.5)"] }
      ]
    },

    /* ───────────────────────── C · Ergebnisse 2026 ───────────────────────── */
    {
      id: "ergebnisse", kurz: "C", titel: "Projektergebnisse 2026", farbe: "teal",
      sub: "Auswahl vom Gallery Walk am 07.07.2026 – Role-Models für den Kick-off",
      tiles: [
        { id: "erg-konsole", kicker: "🕹️ Technik & Informatik", titel: "Arduino-Jump-&-Run-Konsole",
          text: "Selbst gebaute und gestaltete Mini-Spielkonsole mit Arduino, OLED-Display und Joystick – mit Jump-&-Run-Minispiel, weiteren Spielen und eigenen Zusatzfunktionen.",
          bullets: ["Handbemaltes Gehäuse, OLED, Joystick + Taster", "Mehrere Spiele auf einem Gerät", "Uhrzeit, Kalender, Charakter mit Stimmungen", "Perspektive: physische Lauf-/Sprungbewegung"],
          img: "img/IMG_0801.jpg", video: "img/IMG_0802.mp4", badge: "jetzt Jugend forscht",
          links: [{ t: "Jugend-forscht-Seite", u: "https://nitrogen-ai.github.io/Jugend-Forscht/" }] },
        { id: "erg-fussball", kicker: "⚽ Sport & Informatik", titel: "Adaptiver Trainingsplaner Fußball",
          text: "Web-App, die aus Spielposition, Alter, Leistungsniveau und Saisonphase automatisch einen individuellen Trainingsplan erstellt – mit Kalender für Spiel- und Trainingstage.",
          bullets: ["Passt sich vom Anfänger bis zum Leistungsbereich an", "Regenerationstage werden automatisch verteilt", "Übungen skalieren mit Gruppengröße und Material", "Return-to-Play-Modus nach Verletzung"],
          badge: "jetzt Jugend forscht · digital",
          links: [{ t: "Jugend-forscht-Seite", u: "https://nitrogen-ai.github.io/Jugend-Forscht/" }] },
        { id: "erg-geld", kicker: "💶 Verbraucherbildung", titel: "Geld verdienen als Jugendliche:r",
          text: "Interaktive Infotafel mit Stationen, Spielgeld, Spardose, Hörstation und Flyern – Taschengeld, Minijob, Sparen.",
          img: "img/IMG_0800.jpg" },
        { id: "erg-tauben", kicker: "🕊️ Stadtökologie", titel: "Stadttauben – Mythos & Fakten",
          text: "Ausstellungswand mit Fotos und Faktentext plus Quizkarten zum Umdrehen („Taubenkot war lange im Besitz der englischen Königsfamilie. Warum?“ → Schießpulver).",
          img: "img/IMG_0806.jpg", img2: "img/IMG_0807.jpg" },
        { id: "erg-figuren", kicker: "🗳️ Politik & Medien", titel: "Figuren-Inszenierung Wahl in Ungarn",
          text: "Selbst modellierte Figuren (Reporter:in, Péter Magyar, Viktor Orbán) als Szene zu politischen Bewegungen in Europa – Format bitte bei der betreuenden Lehrperson erfragen (Stop-Motion/Interview?).",
          img: "img/IMG_0804.jpg", img2: "img/IMG_0803.jpg" },
        { id: "erg-rover", kicker: "☀️ Energie & Technik", titel: "Solar-Rover",
          text: "Blaues Roboterfahrzeug mit Gesicht und Geländereifen, versorgt über ein faltbares Solarpanel.",
          img: "img/IMG_0810.jpg", img2: "img/IMG_0809.jpg" }
      ]
    },

    /* ───────────────────────── D · Orga 2026/27 ───────────────────────── */
    {
      id: "orga", kurz: "D", titel: "Orga 2026/27 · Stand heute", farbe: "amber",
      sub: "Aus Mails und Planungsunterlagen (Orga-Team, Okt./Nov. 2026)",
      tiles: [
        { id: "org-termine", kicker: "Quick Facts", titel: "Termine 2027",
          timeline: [
            ["Mo 31.05. + Di 01.06.", "Kick-off (parallel zur 5. PK)"],
            ["Mo 14.06. – Fr 25.06.", "Projektphase (2 Wochen, hybrid)"],
            ["Mo 28.06.", "Präsentationsvorbereitung, Ergebnissicherung, Evaluation"],
            ["Di 29.06.", "Präsentation: andere 8. Klassen, nächster Jahrgang, Eltern (2 Slots)"]
          ] },
        { id: "org-chronik", kicker: "Übergabe", titel: "Chronik bis heute",
          timeline: [
            ["16.09.", "Kurzbesprechung wegen Krankheit verschoben"],
            ["Do 24.09.", "Übergabe von der Pilot-Projektleitung an das neue Orga-Team; dazu Leibniz-Präsentation + Medienzentrum-Anschreiben 2026"],
            ["02.–06.10.", "Planungschronologie + Orga-Papier für die KL; Aufgabenteilung im Orga-Team"],
            ["08.10. / 16.10.", "Einladung an die Klassenleitungen, 2. Terminumfrage"],
            ["02.11.", "Anfragen an Medienzentrum Pankow und Futurium (Rückmeldung bis 22.12.)"],
            ["03.11.", "Futurium sagt Zukunftsboxen zu"],
            ["Mi 25.11. 17:00", "<b>Heute:</b> erstes Treffen zu viert"]
          ] },
        { id: "org-rahmen", kicker: "Rahmen", titel: "Was schon steht",
          bullets: ["Gruppen klassenübergreifend, 2–4 Lernende, ca. 18 Gruppen", "Lernende dürfen allein zu Lernorten (Elternbrief Anfang 2027)", "Alle Fachlehrpersonen der Klassen betreuen; die Orga fragt sie ab", "Anwesenheit täglich, Kontrolle durch alle vier", "Thema legen Orga + KL fest – ohne die Klassen", "Produkte müssen sicherbar und dokumentierbar sein", "Schulverein-Zuschuss pro Gruppe, ÖPNV kostenlos"] },
        { id: "org-kl", kicker: "Rolle der KL", titel: "Was die Klassenleitungen (vorerst) tun",
          bullets: ["Information der Klassen und Eltern, inkl. Elternbrief", "Detailplanung Kick-off folgt später", "Möglichst nicht für 5. PK eingeplant (Orga klärt mit der Oberstufenkoordination)"] },
        { id: "org-roadmap", kicker: "Roadmap", titel: "Nächste Meilensteine",
          timeline: [
            ["bis Mitte Dez.", "Thema festlegen ✔ heute?"],
            ["22.12.", "Rückmeldefrist Partner"],
            ["Jan. 2027", "Lernorte sichten/recherchieren, Produktformate mit Medienzentrum klären"],
            ["Feb.", "Termine mit Partnern fest vereinbaren"],
            ["März", "Kollegium abfragen, Leitfaden Lehrpersonen, Elternbrief entwerfen"],
            ["April", "Elternbrief raus (Rücklauf Mitte Mai), Kick-off + Präsentation konzipieren"],
            ["bis 28.05.", "Kick-off-Material fertig"]
          ] }
      ]
    },

    /* ───────────────────────── E · Partner & Lernorte ───────────────────────── */
    {
      id: "partner", kurz: "E", titel: "Partner & Lernorte", farbe: "violet",
      sub: "Zusagen, Anfragen und Ideen – passend zum Oberthema auswählen",
      tiles: [
        { id: "par-futurium", kicker: "✅ Zusage", titel: "Futurium · Zukunftsboxen",
          text: "Vor Ort, angeleitet, ca. 60 min: mögliche, wahrscheinliche und wünschbare Zukünfte zu einem Thema. Ideal als Einstieg zur Vertiefung der Projektideen. Nur nach Terminabsprache, <b>keine Geräte (3D-Druck o. Ä.)</b>.",
          chips: ["Städte", "Arbeit", "Ernährung", "Gesundheit", "Demokratie", "Mensch & Technik", "Weltraum", "Energie", "Mobilität"],
          links: [{ t: "futurium.de", u: "https://futurium.de" }] },
        { id: "par-medien", kicker: "⏳ Anfrage läuft", titel: "Medienzentrum Pankow",
          text: "Angefragt am 02.11. (Antwort bis 22.12.): I. Vorstellung von Angeboten und Geräten am Kick-off 31.05. · II. „Angebote in der Freizeit“ · III. Betreuung einzelner Gruppen beim Lernprodukt (z. B. Tonstudio, MakerSpace), auch mehrtägig.",
          links: [{ t: "mezen-berlin.de", u: "https://mezen-berlin.de" }] },
        { id: "par-humboldt", kicker: "💡 Idee aus dem Orga-Team", titel: "Humboldt Forum · Wasser",
          text: "<b>On Water. WasserWissen in Berlin</b> (Humboldt Labor, Eintritt frei): Forschung der Berlin University Alliance zu Wasser – naturwissenschaftlich, gesellschaftlich, künstlerisch. Ergänzend ab 28.11.2026 bis 12.07.2027 <b>Agua. Kunst und Kosmologien des Wassers</b> (Kunst aus Brasilien, Kolumbien, Chile; regulär 9 €).<br><b>Achtung:</b> Humboldt Forum dienstags geschlossen → Di 01.06. (Kick-off) fällt aus; Laufzeit „On Water“ vorab prüfen.",
          links: [{ t: "humboldtforum.org", u: "https://www.humboldtforum.org" }] },
        { id: "par-weitere", kicker: "🔎 aus der Pilot-Liste", titel: "Weitere Lernorte",
          chips: ["Junge Tüftler (junge-tueftler.de)", "Stadtbibliothek Pankow", "Museum Pankow", "Science Center Spectrum", "Repair-Café im Kiez", "Verbraucherzentrale Berlin"],
          text: "Die ersten vier Einträge stehen in der geteilten Partnerliste des Pilots bzw. im Planungspapier; der Rest sind Vorschläge, die noch nicht angefragt sind." }
      ]
    },

    /* ───────────────────────── F · Themenvorschläge ───────────────────────── */
    {
      id: "themen", kurz: "F", titel: "Themenvorschläge 2026/27", farbe: "blue", voting: true,
      sub: "Themenübergreifend gebündelt aus den Themenideen des Orga-Teams, dem Rahmenlehrplan Teil B, den Partnerangeboten und den Pilotergebnissen. Punktet mit eurem Namen!",
      tiles: [
        { id: "th-wasser", kicker: "Vorschlag 1 · Start im Humboldt Forum", titel: "Wasser:zeichen",
          claim: "Was uns trägt, trennt und verbindet",
          text: "Wasser als Metapher und Stoff zugleich: von der Panke bis zur Weltpolitik, vom Trinkwasser-Sensor bis zum Ritual. Gemeinsamer Startpunkt im Humboldt Labor, danach frei.",
          chips: ["Naturwissenschaft & Technik", "Stadt, Kiez & Klima", "Konsum & virtuelles Wasser", "Gesundheit & Sport", "Kunst, Kultur & Glaube", "Politik, Konflikte & Europa", "Digitale Welt (Rechenzentren, Daten)", "Ernährung & Landwirtschaft"],
          deckt: ["Rohstoffe", "nachhaltige Zukunft", "Verbraucherbildung", "Europabildung", "interkulturelle Bildung", "Energie"],
          beispiel: "Solar-Rover → Wasserproben-Rover · Arduino-Feuchtesensor · Podcast „Wem gehört die Spree?“",
          pro: "Konkreter, kostenloser Einstieg · sehr interdisziplinär · gut für Futurium (Städte, Ernährung, Energie)",
          contra: "Klingt enger als Beweg:gründe → Wortspiel offen formulieren und betonen, dass Wasser auch Metapher sein darf" },
        { id: "th-zukunft", kicker: "Vorschlag 2 · Start im Futurium", titel: "Zukunft:bilder",
          claim: "Wie wollen wir morgen leben?",
          text: "Die neun Futurium-Zukunftsboxen als Themenfelder – mögliche, wahrscheinliche, wünschbare Zukünfte entwerfen und ein Stück davon heute bauen.",
          chips: ["Städte", "Arbeit", "Ernährung", "Gesundheit", "Demokratie", "Mensch & Technik", "Weltraum", "Energie", "Mobilität"],
          deckt: ["Zukunft", "Energie", "digitale Welt", "nachhaltige Zukunft"],
          beispiel: "Fußball-Trainings-App · Solar-Rover · Zukunfts-Stadtmodell",
          pro: "Passt 1:1 zur Futurium-Zusage · technikfreundlich · leicht erklärbar",
          contra: "Sehr nah an Leibniz (Energie/Futurium) · Futurium-Sprechstunde wurde im Pilot nicht angenommen" },
        { id: "th-wert", kicker: "Vorschlag 3 · Verbraucherbildung", titel: "Wert:sachen",
          claim: "Was ist uns etwas wert?",
          text: "Geld, Dinge, Rohstoffe, Daten, Zeit, Freundschaft: Wer bestimmt den Wert – Markt, Werbung, Gefühl, Gesellschaft?",
          chips: ["Geld & Taschengeld", "Werbung & Influencer", "Rohstoffe im Smartphone", "Fair & nachhaltig einkaufen", "Reparieren statt wegwerfen", "Daten als Währung", "Werte & Ethik", "Sammeln & Erinnern"],
          deckt: ["Verbraucherbildung", "Konsum", "Rohstoffe", "digitale Welt"],
          beispiel: "„Geld verdienen als Jugendliche:r“ · Repair-Station · Werbespot im Medienzentrum",
          pro: "Alltagsnah für 14-Jährige · Wortspiel im Beweg:gründe-Stil · viele Produktformen",
          contra: "Lernorte weniger offensichtlich (Verbraucherzentrale, Repair-Café, Bibliothek)" },
        { id: "th-kiez", kicker: "Vorschlag 4 · Europa & Kiez", titel: "Kiez:kosmos",
          claim: "Pankow und die Welt",
          text: "Vom eigenen Block bis nach Europa: Wer lebt hier, was verbindet uns, was fehlt? Lokal recherchieren, global denken.",
          chips: ["Vielfalt im Kiez", "Europa im Alltag", "Stadtnatur & Tiere", "Geschichte vor der Haustür", "Zivilcourage & Konflikte", "Kunst & Kultur in Berlin", "Mobilität im Kiez", "Medien & Lokaljournalismus"],
          deckt: ["Europabildung", "interkulturelle Bildung", "Gewaltprävention", "mein Kiez"],
          beispiel: "Stadttauben-Ausstellung · Figurenszene Wahl in Ungarn · Kiez-Podcast",
          pro: "Medienzentrum Pankow liegt direkt im Thema · kurze Wege · deckt RLP Teil B breit ab",
          contra: "Für Technik-Interessierte weniger naheliegend → Feld „Kiez der Zukunft/Smart City“ ergänzen" },
        { id: "th-netz", kicker: "Vorschlag 5 · Digitale Welt", titel: "Netz:werke",
          claim: "Verbunden, vernetzt, verstrickt",
          text: "Soziale, digitale, ökologische und technische Netze: Wer hängt mit wem zusammen – und was passiert, wenn ein Knoten reißt?",
          chips: ["Social Media & Gewalt im Netz", "Freundschaft & Gruppen", "Stromnetz & Energie", "Ökosysteme & Nahrungsnetze", "Internet & KI", "Lieferketten & Rohstoffe", "Europa als Netzwerk", "Netzwerke im Sport"],
          deckt: ["digitale Welt", "Gewaltprävention", "Energie", "Rohstoffe", "Europabildung"],
          beispiel: "Arduino-Konsole · Fußball-App · Lieferkette eines T-Shirts",
          pro: "Sehr offen wie Beweg:gründe · stark für Medienzentrum (Film, Podcast)",
          contra: "Kein natürlicher gemeinsamer Startort" },
        { id: "th-kombi", kicker: "Empfehlung zum Bündeln", titel: "Kombi: Wasser:zeichen + Futurium",
          text: "Oberthema <b>Wasser:zeichen</b> mit drei festen Ankern: <b>(1)</b> gemeinsamer Besuch im Humboldt Labor (z. B. 1. Projekttag Mo 14.06.; nicht dienstags), <b>(2)</b> Futurium-Zukunftsboxen <i>Städte/Ernährung/Energie/Gesundheit</i> für Gruppen mit Zukunftsfokus, <b>(3)</b> Medienzentrum für Podcast/Film. Alternative, falls Wasser zu eng wirkt: <b>Netz:werke</b> oder <b>Wert:sachen</b> mit „Wasser“ als ein Themenfeld unter mehreren." }
      ]
    },

    /* ───────────────────────── G · Offene Fragen ───────────────────────── */
    {
      id: "fragen", kurz: "G", titel: "Zu klären heute", farbe: "rose",
      sub: "Aus dem Orga-Papier (Teil 2) plus Ergänzungen aus den Unterlagen",
      tiles: [
        { id: "fr-thema", kicker: "A", titel: "Thema",
          checks: ["Welches Oberthema? Weitere Vorschläge der Klassenleitungen?", "Offen genug für ca. 18 sehr unterschiedliche Gruppen?", "Passt es zu den Lernorten (Futurium, Medienzentrum, Humboldt Forum)?"] },
        { id: "fr-klassen", kicker: "B", titel: "Die Klassen",
          checks: ["Besonderheiten von 8.4 und 8.5 (Arbeitsverhalten, Gruppendynamik)?", "Lernende mit besonderem Unterstützungsbedarf? (Nicht hier notieren – nur intern!)", "Kennenlernen der Klassen vor dem Kick-off? Wie?"] },
        { id: "fr-betreuung", kicker: "C", titel: "Verfügbarkeit & Betreuung",
          checks: ["Seid ihr in der Projektphase auf Fahrten oder im Kick-off in der 5. PK eingebunden?", "Was gehört in den Leitfaden für betreuende Lehrpersonen?", "Tagesabfrage wie im Pilot (2× täglich) übernehmen?"] },
        { id: "fr-produkte", kicker: "D", titel: "Produkte & Ergebnissicherung",
          checks: ["Welche Produktformate sind erwünscht (sicherbar, dokumentierbar)?", "Wie archivieren wir Role-Models für künftige Jahrgänge (Foto, Video, Website)?", "Zwischenpräsentation einplanen (Leibniz-Lehre)?"] },
        { id: "fr-info", kicker: "E", titel: "Information Klassen & Eltern",
          checks: ["Wann und wie informiert ihr Klassen und Eltern (Elternabend, Elternbrief Anfang 2027)?", "Welcher 7. Jahrgang schaut am 29.06. zu? (Orga-Papier nennt 7.5/7.6, im Pilot waren es 7.4/7.5)", "Abschiedsparty am 29.06. ja/nein?"] }
      ]
    }
  ]
};
