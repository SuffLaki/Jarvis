# J.A.R.V.I.S. – Voice Assistant for iPhone

🇩🇪 [Deutsche Version](README.md)

A personal AI assistant inspired by Jarvis from Iron Man, running as a web app right in your browser.
You talk to Jarvis, and he answers with a voice: dry, British-polite and slightly sarcastic.

**Open the app:** https://sufflaki.github.io/Jarvis/

Everything runs on your phone. There's no server and no sign-up, and nothing to install.

> 🗣️ **Note on language:** Jarvis **speaks German only** and the app's interface is in German. He understands spoken English, but he will always reply in German.

---

## What Jarvis can do

- 🎙️ **Talk freely.** Jarvis listens, understands you and answers out loud.
- ⌨️ **Type instead of talking,** for example when it's loud around you.
- 🌤️ **Greets you with the current weather** for your city.
- 🌐 **Opens websites,** e.g. "Öffne wetter.com" ("Open wetter.com").
- 🔎 **Researches the web** (see [Live research](#live-research)).
- 🧠 **Remembers the conversation** while the app is open.

---

## What you need

| | Used for | Cost |
|---|---|---|
| **iPhone with Safari** | The app itself | – |
| **Gemini API key** (Google) | The "brain": understands you and thinks | free |
| **ElevenLabs API key** | The voice | free |

Both keys take a few minutes to create. Instructions follow below.

---

## Setup

### 1. Create a Gemini API key

1. Go to https://aistudio.google.com/apikey and sign in with your Google account.
2. Tap **"Create API key"**.
3. Copy the key. It starts with `AQ.` or `AIza`.

### 2. Create an ElevenLabs API key

1. Create a free account at https://elevenlabs.io.
2. In the bottom left, open **Developers** and then **API Keys**.
3. Tap **"Create API Key"**. Make sure the **Text to Speech** permission is enabled.
4. Copy the key. It starts with `sk_`.

> ⚠️ **Important:** ElevenLabs shows the key **only once**. Save it straight away, e.g. in your Notes app.

### 3. Add the app to your home screen

1. Open **https://sufflaki.github.io/Jarvis/** in **Safari**. This doesn't work properly in Chrome on iPhone.
2. Tap **Share** at the bottom (the square with an arrow pointing up).
3. Choose **"Add to Home Screen"** and tap **"Add"**.
4. From now on, start Jarvis **from the new icon**. It then runs full-screen like a real app.

### 4. Set up Jarvis

The setup screen opens on first launch (the labels are in German):

| Field (German label) | Required | Example |
|---|---|---|
| Gemini API Key | ✅ | `AQ.xxxx...` or `AIza...` |
| ElevenLabs API Key | ✅ | `sk_xxxx...` |
| Name | ✅ | Max |
| Anrede (how Jarvis addresses you) | ✅ | Chief, Sir, or your first name |
| Beruf (job) | – | Site manager |
| Stadt fürs Wetter (city for weather) | – | Munich |

Tap **Speichern** (Save). You can change everything later via the gear icon **⚙** in the top right.

> 💡 **Tip:** Typing keys by hand is error-prone. Send them to your iPhone via Notes, email or a messenger, then copy and paste them.

### 5. Get started

1. Tap the **circle**.
2. Allow **microphone access**.
3. Stay quiet for a second while Jarvis adjusts to the background noise.
4. Jarvis greets you, and then you can just start talking.

---

## How to use it

| Circle color | Meaning |
|---|---|
| 🔵 Blue | Jarvis is listening |
| 🟡 Yellow | Jarvis is thinking |
| 🟢 Green | Jarvis is speaking |
| Faded | Paused |

- **Tap the circle:** pause or resume.
- **Text field at the bottom:** type a message instead of speaking.
- **⚙ in the top right:** settings.

Examples:
- "Wie wird das Wetter heute?" ("What's the weather like today?")
- "Öffne YouTube." ("Open YouTube.")
- "Such mal nach den aktuellen Baupreisen." ("Look up current construction prices.")
- "Was gibt es Neues in der Welt?" ("What's new in the world?")

---

## Good to know

- **The app has to be open.** When the iPhone is locked or the app is in the background, Jarvis can't listen. That's an Apple restriction.
- **Silent mode:** If you can't hear Jarvis, turn silent mode off.
- **Daily limit:** The free Gemini tier has a daily limit. When you reach it, Jarvis tells you, and it works again the next day. You can see your limit at https://ai.dev/rate-limit.
- **Different voice:** Under ⚙ → **Erweitert** (Advanced) you can enter a different ElevenLabs voice ID. On the free ElevenLabs plan only the **default voices** work. Voices from the "Voice Library" require a paid plan.

### Live research

For Jarvis to search the web himself and read the results out loud, **billing must be enabled** for your Google account. You can do that at https://aistudio.google.com via **"Set up billing"**.

Without billing, Jarvis shows you a **tappable link to Google Search** instead.

Costs are low for normal use. See https://ai.google.dev/pricing for current prices. It's a good idea to set a budget limit with an email alert in the Google Cloud Console.

---

## Privacy

- Your **API keys and settings** are stored **only on your iPhone**, in Safari's storage. They are not on GitHub or on anyone else's server.
- **Your voice recordings** go directly to **Google Gemini** (understanding and answering). Jarvis's replies go to **ElevenLabs** (voice). For the weather, your city name is sent to **Open-Meteo**.
- The microphone is only active while the app is open.

---

## Troubleshooting

| Message / problem | Fix |
|---|---|
| "ElevenLabs API Key ungültig" (key invalid) | Under ⚙, delete the key and paste it in again (51 characters, starts with `sk_`) |
| "Gemini API Key ungültig" (key invalid) | Check the key under ⚙, ideally paste it in again |
| "Gemini-Tageslimit erreicht" (daily limit reached) | Wait until tomorrow or enable billing with Google |
| "Diese ElevenLabs-Stimme braucht einen bezahlten Tarif" (voice needs a paid plan) | Under ⚙ → Erweitert, clear the voice ID to fall back to the default voice |
| "Kein Mikrofonzugriff" (no microphone access) | iPhone **Settings** → **Safari** → **Microphone** → "Ask" or "Allow", then restart the app |
| The circle doesn't react when I speak | Close the app completely (swipe up in the app switcher), reopen it and stay quiet for a moment at startup |
| I can't hear Jarvis | Turn off silent mode and turn up the volume |
| The app shows an old version | Close the app completely and reopen it |

---

## Host your own copy

You can run Jarvis at your own address:

1. Click **Fork** in the top right of this page.
2. In your copy, go to **Settings** → **Pages**, select **Branch: `main`** and **`/ (root)`**, and click **Save**.
3. After 1–2 minutes the app is available at `https://YOURNAME.github.io/Jarvis/`.

The app consists of static files only (HTML, CSS and JavaScript). No server or build step is needed.

| File | Contents |
|---|---|
| `index.html` | Page layout |
| `app.js` | Microphone, Gemini, ElevenLabs, weather, settings |
| `style.css` | Design and circle animation |
| `manifest.webmanifest` + `icon-*.png` | App name and icon for the home screen |
