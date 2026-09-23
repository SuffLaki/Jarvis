# J.A.R.V.I.S. – Sprachassistent fürs iPhone

🇬🇧 [English version](README.en.md)

Ein persönlicher KI-Assistent im Stil von Jarvis aus Iron Man, als Web-App direkt im Browser.
Du sprichst mit Jarvis, und er antwortet mit Stimme: trocken, britisch-höflich und leicht sarkastisch.

**App öffnen:** https://sufflaki.github.io/Jarvis/

Die App läuft komplett auf deinem Handy. Es gibt keinen Server und keine Anmeldung, und nichts muss installiert werden.

---

## Was Jarvis kann

- 🎙️ **Frei sprechen.** Jarvis hört zu, versteht dich und antwortet mit Stimme.
- ⌨️ **Tippen statt sprechen,** zum Beispiel wenn es laut ist.
- 🌤️ **Begrüßung mit dem aktuellen Wetter** deiner Stadt.
- 🌐 **Webseiten öffnen,** zum Beispiel mit „Öffne wetter.com“.
- 🔎 **Im Internet recherchieren** (siehe [Live-Recherche](#live-recherche)).
- 🧠 **Er merkt sich den Gesprächsverlauf,** solange die App offen ist.

---

## Was du brauchst

| | Wofür | Kosten |
|---|---|---|
| **iPhone mit Safari** | Die App selbst | – |
| **Gemini API Key** (Google) | Das „Gehirn“: versteht dich und denkt nach | kostenlos |
| **ElevenLabs API Key** | Die Stimme | kostenlos |

Beide Keys lassen sich in wenigen Minuten erstellen, eine Anleitung folgt unten.

---

## Einrichtung

### 1. Gemini API Key erstellen

1. Öffne https://aistudio.google.com/apikey und melde dich mit deinem Google-Konto an.
2. Tippe auf **„API-Schlüssel erstellen“** bzw. **„Create API key“**.
3. Kopiere den Key. Er beginnt mit `AQ.` oder `AIza`.

### 2. ElevenLabs API Key erstellen

1. Erstelle auf https://elevenlabs.io ein kostenloses Konto.
2. Öffne links unten **Developers** und dann **API Keys**.
3. Tippe auf **„Create API Key“**. Achte darauf, dass die Berechtigung **Text to Speech** aktiviert ist.
4. Kopiere den Key. Er beginnt mit `sk_`.

> ⚠️ **Wichtig:** ElevenLabs zeigt den Key nur **einmal** an. Speichere ihn am besten direkt in deiner Notizen-App.

### 3. App auf den Home-Bildschirm legen

1. Öffne **https://sufflaki.github.io/Jarvis/** in **Safari**. In Chrome auf dem iPhone funktioniert das nicht richtig.
2. Tippe unten auf **Teilen** (Quadrat mit Pfeil nach oben).
3. Wähle **„Zum Home-Bildschirm“** und tippe auf **„Hinzufügen“**.
4. Starte Jarvis ab jetzt **über das neue Icon**. Dann läuft er im Vollbild wie eine richtige App.

### 4. Jarvis einrichten

Beim ersten Start öffnet sich die Einrichtung:

| Feld | Pflicht | Beispiel |
|---|---|---|
| Gemini API Key | ✅ | `AQ.xxxx...` oder `AIza...` |
| ElevenLabs API Key | ✅ | `sk_xxxx...` |
| Name | ✅ | Max |
| Anrede | ✅ | Chief, Sir oder dein Vorname |
| Beruf | – | Bauleiter |
| Stadt fürs Wetter | – | Ulm |

Tippe auf **Speichern**. Du kannst die Angaben später jederzeit über das Zahnrad **⚙** oben rechts ändern.

> 💡 **Tipp:** Keys abzutippen ist fehleranfällig. Schick sie dir lieber per Notizen, Mail oder Messenger aufs iPhone und füge sie per Kopieren und Einfügen ein.

### 5. Loslegen

1. Tippe auf den **Kreis**.
2. Erlaube den **Mikrofonzugriff**.
3. Sei eine Sekunde still, denn Jarvis stellt sich auf die Umgebungsgeräusche ein.
4. Jarvis begrüßt dich, danach kannst du einfach losreden.

---

## Bedienung

| Farbe des Kreises | Bedeutung |
|---|---|
| 🔵 Blau | Jarvis hört zu |
| 🟡 Gelb | Jarvis denkt nach |
| 🟢 Grün | Jarvis spricht |
| Blass | Pausiert |

- **Kreis antippen:** Pause bzw. weiter.
- **Mikrofon-Taste unten links:** Mikrofon komplett aus- und wieder einschalten. Rot mit Strich heißt, das Mikrofon ist aus. Das Einschalten startet das Mikrofon neu. Das hilft, wenn Jarvis nach dem Entsperren des iPhones nicht mehr zuhört.
- **Textfeld unten:** Nachricht tippen statt sprechen.
- **⚙ oben rechts:** Einstellungen.

Beispiele:
- „Wie wird das Wetter heute?“
- „Öffne YouTube.“
- „Such mal nach den aktuellen Baupreisen.“
- „Was gibt es Neues in der Welt?“

---

## Gut zu wissen

- **Die App muss offen sein.** Wenn das iPhone gesperrt ist oder die App im Hintergrund läuft, hört Jarvis nicht zu. Das ist eine Vorgabe von Apple.
- **Lautlos-Modus:** Hörst du Jarvis nicht, stell das iPhone auf laut.
- **Tageslimit:** Der kostenlose Gemini-Zugang hat ein Tageslimit. Ist es erreicht, meldet Jarvis das, und am nächsten Tag geht es weiter. Wie hoch dein Limit ist, siehst du unter https://ai.dev/rate-limit.
- **Andere Stimme:** Unter ⚙ → **Erweitert** kannst du eine andere ElevenLabs Voice ID eintragen. Im kostenlosen ElevenLabs-Tarif funktionieren nur die **Standard-Stimmen**. Stimmen aus der „Voice Library“ brauchen einen bezahlten Tarif.

### Live-Recherche

Damit Jarvis selbst im Internet recherchieren und die Ergebnisse vorlesen kann, muss bei Google die **Abrechnung aktiviert** sein. Das geht in https://aistudio.google.com über **„Abrechnung einrichten“** bzw. **„Set up billing“**.

Ohne Abrechnung zeigt Jarvis dir stattdessen einen **Link zur Google-Suche**, den du antippen kannst.

Die Kosten sind bei normaler Nutzung gering. Aktuelle Preise stehen unter https://ai.google.dev/pricing. Setze dir am besten in der Google Cloud Console ein Budget-Limit mit E-Mail-Warnung.

---

## Datenschutz

- Deine **API Keys und Einstellungen** werden **nur auf deinem iPhone** gespeichert, im Speicher von Safari. Sie liegen nicht auf GitHub und nicht auf einem fremden Server.
- **Deine Sprachaufnahmen** gehen direkt an **Google Gemini** (Verstehen und Antworten), Jarvis' Antworten an **ElevenLabs** (Stimme). Für das Wetter wird dein Ortsname an **Open-Meteo** geschickt.
- Das Mikrofon ist nur aktiv, solange die App geöffnet ist.

---

## Probleme lösen

| Meldung / Problem | Lösung |
|---|---|
| „ElevenLabs API Key ungültig“ | Key unter ⚙ löschen und neu per Kopieren und Einfügen eintragen (51 Zeichen, beginnt mit `sk_`) |
| „Gemini API Key ungültig“ | Key unter ⚙ prüfen und am besten neu einfügen |
| „Gemini-Tageslimit erreicht“ | Bis morgen warten oder bei Google die Abrechnung aktivieren |
| „Diese ElevenLabs-Stimme braucht einen bezahlten Tarif“ | Unter ⚙ → Erweitert die Voice ID leeren, dann wird die Standard-Stimme genutzt |
| „Kein Mikrofonzugriff“ | iPhone-**Einstellungen** → **Safari** → **Mikrofon** → „Fragen“ oder „Erlauben“, dann App neu starten |
| Jarvis hört nach dem Entsperren nicht mehr zu | Mikrofon-Taste unten links antippen, bis sie wieder blau ist |
| Kreis reagiert nicht, wenn ich spreche | App komplett schließen (im App-Umschalter nach oben wischen), neu öffnen und beim Start kurz still sein |
| Jarvis ist nicht zu hören | Lautlos-Modus ausschalten und Lautstärke hochdrehen |
| App zeigt eine alte Version | App komplett schließen und neu öffnen |

---

## Eigene Kopie hosten

Du kannst Jarvis auch unter deiner eigenen Adresse betreiben:

1. Oben rechts auf dieser Seite auf **Fork** klicken.
2. In deiner Kopie auf **Settings** → **Pages** gehen, dort **Branch: `main`** und **`/ (root)`** wählen und **Save** klicken.
3. Nach 1–2 Minuten ist die App unter `https://DEINNAME.github.io/Jarvis/` erreichbar.

Die App besteht nur aus statischen Dateien (HTML, CSS und JavaScript). Ein Server oder ein Build-Schritt ist nicht nötig.

| Datei | Inhalt |
|---|---|
| `index.html` | Aufbau der Seite |
| `app.js` | Mikrofon, Gemini, ElevenLabs, Wetter, Einstellungen |
| `style.css` | Design und Kreis-Animation |
| `manifest.webmanifest` + `icon-*.png` | App-Name und Icon für den Home-Bildschirm |
