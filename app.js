// Jarvis — iPhone Web App
// Runs entirely on the phone: Gemini hears and thinks, ElevenLabs speaks. No server needed.

const DEFAULTS = {
    gemini: "",
    eleven: "",
    name: "",
    address: "",
    role: "",
    city: "",
    model: "gemini-3.5-flash-lite",
    voice: "onwK4e9ZLuTAKqWW03F9",
};
const STORE_KEY = "jarvis-settings";
const FIELDS = {
    gemini: "s-gemini", eleven: "s-eleven", name: "s-name", address: "s-address",
    role: "s-role", city: "s-city", model: "s-model", voice: "s-voice",
};

function loadSettings() {
    try {
        return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") };
    } catch {
        return { ...DEFAULTS };
    }
}

function saveSettings(s) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {}
}

let settings = loadSettings();

// Name and address are needed for the prompt; job and city are optional
const isSetUp = () => settings.gemini && settings.eleven && settings.name && settings.address;

const $ = (id) => document.getElementById(id);
const orb = $("orb");
const statusEl = $("status");
const transcript = $("transcript");

const state = {
    mode: "idle",      // idle | listening | thinking | speaking
    started: false,
    paused: false,
    busy: false,       // a request is running (voice or typed)
    muted: false,      // microphone switched off via the mic button
};
let history = [];      // {role: "user" | "model", text}
let weather = "";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function setMode(mode, status = "") {
    state.mode = mode;
    orb.className = mode + (state.paused ? " paused" : "");
    statusEl.textContent = status;
}

function addLine(role, text) {
    const div = document.createElement("div");
    div.className = role;
    div.textContent = (role === "user" ? "Du: " : "Jarvis: ") + text;
    transcript.appendChild(div);
    transcript.scrollTop = transcript.scrollHeight;
}

function addLink(url) {
    const div = document.createElement("div");
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "↗ " + url.replace(/^https?:\/\//, "");
    div.appendChild(a);
    transcript.appendChild(div);
    transcript.scrollTop = transcript.scrollHeight;
}

// ------------------------------------------------------------ settings

function openSettings() {
    for (const [key, id] of Object.entries(FIELDS)) $(id).value = settings[key] || "";
    $("settings-error").textContent = "";
    $("settings").hidden = false;
}

$("settings-btn").addEventListener("click", openSettings);
$("save-btn").addEventListener("click", () => {
    for (const [key, id] of Object.entries(FIELDS)) settings[key] = $(id).value.trim() || DEFAULTS[key];
    saveSettings(settings);
    thinkingOff = true;
    const missing = missingFields();
    if (missing.length) {
        $("settings-error").textContent = "Bitte noch ausfuellen: " + missing.join(", ");
        return;
    }
    weather = "";
    if (state.started) loadWeather().then((w) => { weather = w; });
    $("settings").hidden = true;
    if (!state.started) statusEl.textContent = "Tippe auf den Kreis, um Jarvis zu starten.";
});

// ------------------------------------------------------------ weather

const WEATHER_CODES = {
    0: "klar", 1: "ueberwiegend klar", 2: "teilweise bewoelkt", 3: "bedeckt",
    45: "Nebel", 48: "Nebel mit Reif",
    51: "leichter Nieselregen", 53: "Nieselregen", 55: "starker Nieselregen",
    61: "leichter Regen", 63: "Regen", 65: "starker Regen", 66: "gefrierender Regen", 67: "starker gefrierender Regen",
    71: "leichter Schneefall", 73: "Schneefall", 75: "starker Schneefall", 77: "Schneegriesel",
    80: "leichte Regenschauer", 81: "Regenschauer", 82: "heftige Regenschauer",
    85: "Schneeschauer", 86: "starke Schneeschauer",
    95: "Gewitter", 96: "Gewitter mit Hagel", 99: "schweres Gewitter mit Hagel",
};

async function loadWeather() {
    if (!settings.city) return "";
    try {
        const geo = await (await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(settings.city)}&count=1&language=de`
        )).json();
        const place = geo.results && geo.results[0];
        if (!place) return "";
        const w = await (await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
            `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
        )).json();
        const c = w.current;
        return `Wetter ${settings.city}: ${Math.round(c.temperature_2m)}°C, gefuehlt ${Math.round(c.apparent_temperature)}°C, ` +
            `${WEATHER_CODES[c.weather_code] || "unbekannt"}, Wind ${Math.round(c.wind_speed_10m)} km/h`;
    } catch {
        return "";
    }
}

// ------------------------------------------------------------ prompt

function today() {
    const now = new Date();
    return {
        date: now.toLocaleDateString("de-DE"),
        time: now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
    };
}

function systemPrompt() {
    const { name, address, role } = settings;
    const { date, time } = today();
    const weatherRule = weather
        ? "Gebe eine kurze Info ueber das Wetter — Temperatur und ob Sonne/klar/bewoelkt/Regen, und wie es sich anfuehlt. Keine Luftfeuchtigkeit."
        : "Erwaehne das Wetter nicht.";
    return `Du bist Jarvis, der KI-Assistent von Tony Stark aus Iron Man. Dein Dienstherr ist ${name}${role ? ` (Beruf: ${role})` : ""}. Du sprichst ausschliesslich Deutsch. ${name} moechte mit "${address}" angesprochen und gesiezt werden. Nutze "Sie" als Pronomen — FALSCH: "${address} planen", RICHTIG: "Sie planen, ${address}". Dein Ton ist trocken, sarkastisch und britisch-hoeflich - wie ein Butler der alles gesehen hat und trotzdem loyal bleibt. Du machst subtile, trockene Bemerkungen, bist aber niemals respektlos. Wenn ${address} eine offensichtliche Frage stellt, darfst du mit elegantem Sarkasmus antworten. Du bist hochintelligent, effizient und immer einen Schritt voraus. Halte deine Antworten kurz - maximal 3 Saetze. Du kommentierst fragwuerdige Entscheidungen hoeflich aber spitz.

WICHTIG: Schreibe NIEMALS Regieanweisungen, Emotionen oder Tags in eckigen Klammern wie [sarcastic] [formal] [amused] [dry] oder aehnliches. Dein Sarkasmus muss REIN durch die Wortwahl kommen. Alles was du schreibst wird laut vorgelesen.

Du laeufst als App auf dem iPhone von ${name}. Du kannst im Internet recherchieren und Webseiten oeffnen. Den Bildschirm kannst du NICHT sehen. Wenn ${address} dich bittet etwas nachzuschauen, zu recherchieren, zu googeln, eine Seite zu oeffnen, oder irgendetwas im Internet zu tun — nutze IMMER eine Aktion. Frag nicht ob du es tun sollst, tu es einfach.

AKTIONEN - Schreibe die passende Aktion ans ENDE deiner Antwort. Der Text VOR der Aktion wird vorgelesen, die Aktion selbst wird still ausgefuehrt.
[ACTION:SEARCH] suchbegriff - Im Internet recherchieren und Ergebnisse zusammenfassen. Schreibe einen kurzen Satz davor.
[ACTION:OPEN] url - Webseite auf dem iPhone oeffnen
[ACTION:NEWS] - Aktuelle Weltnachrichten abrufen. Nutze diese Aktion wenn nach News, Nachrichten, was in der Welt passiert, aktuelle Lage oder Weltgeschehen gefragt wird. Schreibe einen kurzen Satz davor wie "Ich schaue nach den aktuellen Nachrichten."

WENN ${name} "Jarvis activate" sagt:
- Begruesse ihn passend zur Tageszeit (aktuelle Zeit: ${time}).
- ${weatherRule}
- Es sind keine Aufgaben hinterlegt — erwaehne keine Aufgaben.
- Sei kreativ bei der Begruessung.

=== AKTUELLE DATEN ===
Heutiges Datum: ${date}, ${time}
${weather || "Wetter: nicht verfuegbar"}
===`;
}

function missingFields() {
    const labels = { gemini: "Gemini API Key", eleven: "ElevenLabs API Key", name: "Name", address: "Anrede" };
    return Object.keys(labels).filter((k) => !settings[k]).map((k) => labels[k]);
}

// ------------------------------------------------------------ gemini

let thinkingOff = true;  // some models reject thinkingBudget 0 — then we drop it

function historyContents() {
    const contents = [];
    for (const m of history.slice(-16)) {
        if (!contents.length && m.role === "model") continue;
        const last = contents[contents.length - 1];
        if (last && last.role === m.role) last.parts.push({ text: m.text });
        else contents.push({ role: m.role, parts: [{ text: m.text }] });
    }
    return contents;
}

function geminiError(status, body) {
    let msg = "";
    try { msg = JSON.parse(body).error.message; } catch { msg = body.slice(0, 120); }
    if (status === 429) return "Gemini-Tageslimit erreicht. Morgen geht es weiter — oder im Google AI Studio die Abrechnung aktivieren.";
    if (/API key/i.test(msg) || status === 401 || status === 403) return "Gemini API Key ungueltig — bitte in den Einstellungen (⚙) pruefen.";
    if (status === 404) return `Gemini-Modell "${settings.model}" nicht gefunden — bitte in den Einstellungen pruefen.`;
    if (status === 503) return "Gemini ist gerade ueberlastet. Bitte gleich nochmal versuchen.";
    return `Gemini-Fehler ${status}: ${msg}`;
}

async function gemini({ system, contents, maxTokens = 400, schema = null, tools = null, temperature }) {
    const body = { contents, generationConfig: { maxOutputTokens: maxTokens } };
    if (system) body.systemInstruction = { parts: [{ text: system }] };
    if (schema) {
        body.generationConfig.responseMimeType = "application/json";
        body.generationConfig.responseSchema = schema;
    }
    if (tools) body.tools = tools;
    if (temperature !== undefined) body.generationConfig.temperature = temperature;

    const post = () => fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(settings.model)}:generateContent`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": settings.gemini },
            body: JSON.stringify(body),
        }
    );

    if (thinkingOff) body.generationConfig.thinkingConfig = { thinkingBudget: 0 };
    let res = await post();
    if (res.status === 400 && thinkingOff) {
        thinkingOff = false;
        delete body.generationConfig.thinkingConfig;
        res = await post();
    }
    if (!res.ok) throw new Error(geminiError(res.status, await res.text()));

    const data = await res.json();
    const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    return parts.filter((p) => p.text && !p.thought).map((p) => p.text).join("").trim();
}

const TURN_SCHEMA = {
    type: "OBJECT",
    properties: {
        heard: { type: "STRING" },
        reply: { type: "STRING" },
    },
    required: ["heard", "reply"],
};

// One request per spoken sentence: Gemini transcribes and answers together.
async function askWithAudio(wavBase64) {
    const contents = historyContents();
    contents.push({
        role: "user",
        parts: [
            { inlineData: { mimeType: "audio/wav", data: wavBase64 } },
            { text: "Das ist eine Sprachaufnahme. Schreibe in 'heard' wortgetreu, was gesagt wurde (leer, wenn nur Geraeusche oder keine verstaendliche Sprache zu hoeren ist). Schreibe in 'reply' deine Antwort als Jarvis nach allen Regeln oben, inklusive Aktion falls noetig (leer, wenn 'heard' leer ist)." },
        ],
    });
    const raw = await gemini({ system: systemPrompt(), contents, maxTokens: 600, schema: TURN_SCHEMA });
    try {
        const parsed = JSON.parse(raw);
        return { heard: (parsed.heard || "").trim(), reply: (parsed.reply || "").trim() };
    } catch {
        return { heard: "", reply: "" };
    }
}

let searchAvailable = true;

async function research(query) {
    const { date } = today();
    return gemini({
        system: `Du bist Jarvis. Recherchiere mit der Google-Suche und fasse das Ergebnis KURZ auf Deutsch zusammen, maximal 3 Saetze, im Jarvis-Stil (trocken, britisch-hoeflich). Sprich den Nutzer als ${settings.address} an und sieze ihn. KEINE Tags in eckigen Klammern, keine Links, keine Aufzaehlungen. Heutiges Datum: ${date}.`,
        contents: [{ role: "user", parts: [{ text: query }] }],
        maxTokens: 400,
        tools: [{ google_search: {} }],
    });
}

// ------------------------------------------------------------ actions

const ACTION_PATTERN = /\[ACTION:(\w+)\]\s*(.*?)$/ms;

function extractAction(text) {
    const m = ACTION_PATTERN.exec(text);
    if (!m) return { spoken: text.trim(), action: null };
    return { spoken: text.slice(0, m.index).trim(), action: { type: m[1], payload: m[2].trim() } };
}

async function say(text) {
    addLine("jarvis", text);
    history.push({ role: "model", text });
    await speak(text);
}

async function handleReply(reply) {
    const { spoken, action } = extractAction(reply);
    if (spoken) await say(spoken);
    if (!action) return;

    if (action.type === "OPEN") {
        let url = action.payload.split(/\s/)[0];
        if (!/^https?:\/\//i.test(url)) url = "https://" + url;
        addLink(url);
        window.open(url, "_blank");  // may be blocked by iOS — the link above always works
        return;
    }

    if (action.type === "SEARCH" || action.type === "NEWS") {
        const query = action.type === "NEWS"
            ? `Die wichtigsten aktuellen Weltnachrichten von heute (${today().date})`
            : action.payload;
        setMode("thinking", action.type === "NEWS" ? "Lese die Nachrichten..." : "Recherchiere...");
        let summary = "";
        if (searchAvailable) {
            try {
                summary = extractAction(await research(query)).spoken;
            } catch (e) {
                console.warn("[jarvis] research failed", e);
                // Google-Search grounding is not part of every free Gemini plan
                if (/Tageslimit/.test(e.message)) searchAvailable = false;
            }
        }
        if (!summary) {
            const url = action.type === "NEWS"
                ? "https://news.google.com/?hl=de&gl=DE&ceid=DE:de"
                : "https://www.google.com/search?q=" + encodeURIComponent(query);
            addLink(url);
            window.open(url, "_blank");
            summary = `Die Live-Recherche ist mit Ihrem Gemini-Zugang leider nicht freigeschaltet, ${settings.address}. Ich habe Ihnen die Ergebnisse verlinkt.`;
        }
        await say(summary);
    }
}

// ------------------------------------------------------------ audio

let ctx = null;
let analyser = null;
const mic = { level: 0, threshold: 0.01, onBlock: null };
const BLOCK_SIZE = 2048;

// Safari mutes Web Audio in silent mode unless the page declares it plays real audio
function setAudioSession(type) {
    try { if (navigator.audioSession) navigator.audioSession.type = type; } catch {}
}

function ensureOutput() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (!analyser) {
        analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.connect(ctx.destination);
    }
}

let processor = null;
let micStream = null;
let micSource = null;

async function startAudio() {
    setAudioSession("play-and-record");
    ensureOutput();
    await ctx.resume();

    processor = ctx.createScriptProcessor(BLOCK_SIZE, 1, 1);
    processor.onaudioprocess = (e) => {
        const data = e.inputBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
        const rms = Math.sqrt(sum / data.length);
        mic.level = rms;
        if (mic.onBlock) mic.onBlock(new Float32Array(data), rms);
    };
    const silent = ctx.createGain();  // the processor only runs while connected to the output
    silent.gain.value = 0;
    processor.connect(silent);
    silent.connect(ctx.destination);

    await connectMic();
}

// (Re)opens the microphone. iOS can kill the mic track when the screen locks,
// so this is also what the mic button and returning to the app use.
async function connectMic() {
    disconnectMic();
    micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
    micSource = ctx.createMediaStreamSource(micStream);
    micSource.connect(processor);
}

function disconnectMic() {
    if (micSource) micSource.disconnect();
    if (micStream) micStream.getTracks().forEach((t) => t.stop());
    micSource = null;
    micStream = null;
    mic.level = 0;
}

function micAlive() {
    const track = micStream && micStream.getAudioTracks()[0];
    return !!track && track.readyState === "live" && !track.muted;
}

function calibrate(seconds = 1) {
    return new Promise((resolve) => {
        const levels = [];
        mic.onBlock = (_, rms) => levels.push(rms);
        setTimeout(() => {
            mic.onBlock = null;
            levels.sort((a, b) => a - b);
            const noise = levels.length ? levels[Math.floor(levels.length * 0.9)] : 0;
            mic.threshold = Math.max(noise * 2.5, 0.008);
            console.log(`[jarvis] Grundrauschen ${noise.toFixed(4)}, Schwelle ${mic.threshold.toFixed(4)}`);
            resolve();
        }, seconds * 1000);
    });
}

// Resolves with the samples of one spoken sentence, an empty array for noise,
// or null when listening was interrupted (pause or typed message).
function recordUtterance() {
    return new Promise((resolve) => {
        const blockSec = BLOCK_SIZE / ctx.sampleRate;
        const prerollMax = Math.ceil(0.3 / blockSec);
        const preroll = [];
        let frames = [];
        let speaking = false;
        let loudRun = 0;
        let silence = 0;
        let speech = 0;

        const finish = (result) => {
            mic.onBlock = null;
            clearInterval(interruptCheck);
            resolve(result);
        };
        const interruptCheck = setInterval(() => {
            if (state.paused || state.muted || state.busy) finish(null);
        }, 150);

        mic.onBlock = (block, rms) => {
            if (!speaking) {
                preroll.push(block);
                if (preroll.length > prerollMax) preroll.shift();
                loudRun = rms > mic.threshold ? loudRun + 1 : 0;
                if (loudRun >= 3) {
                    speaking = true;
                    frames = preroll.slice();
                    speech = loudRun * blockSec;
                }
                return;
            }
            frames.push(block);
            if (rms > mic.threshold * 0.7) {
                silence = 0;
                speech += blockSec;
            } else {
                silence += blockSec;
            }
            if (silence >= 0.9 || frames.length * blockSec >= 30) {
                if (speech < 0.25) return finish(new Float32Array(0));
                const out = new Float32Array(frames.length * BLOCK_SIZE);
                frames.forEach((f, i) => out.set(f, i * BLOCK_SIZE));
                finish(out);
            }
        };
    });
}

function toWavBase64(samples, inRate) {
    const outRate = 16000;
    const ratio = inRate / outRate;
    const n = Math.floor(samples.length / ratio);
    const buf = new ArrayBuffer(44 + n * 2);
    const v = new DataView(buf);
    const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    str(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); str(8, "WAVE");
    str(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, outRate, true); v.setUint32(28, outRate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    str(36, "data"); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) {
        // average the input samples that fall into this output sample (cheap low-pass)
        const start = Math.floor(i * ratio);
        const end = Math.min(samples.length, Math.floor((i + 1) * ratio));
        let sum = 0;
        for (let j = start; j < end; j++) sum += samples[j];
        const s = Math.max(-1, Math.min(1, sum / Math.max(1, end - start)));
        v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    const bytes = new Uint8Array(buf);
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
}

function splitForTts(text) {
    if (text.length <= 250) return [text];
    const chunks = [];
    let current = "";
    for (const s of text.split(/(?<=[.!?])\s+/)) {
        if (current && current.length + s.length > 250) {
            chunks.push(current.trim());
            current = s;
        } else {
            current = (current + " " + s).trim();
        }
    }
    if (current) chunks.push(current.trim());
    return chunks;
}

async function tts(text) {
    const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(settings.voice)}?output_format=mp3_44100_128`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json", "xi-api-key": settings.eleven },
            body: JSON.stringify({
                text,
                model_id: "eleven_turbo_v2_5",
                voice_settings: { stability: 0.5, similarity_boost: 0.85 },
            }),
        }
    );
    if (res.status === 401) throw new Error("ElevenLabs API Key ungueltig — bitte in den Einstellungen pruefen.");
    if (res.status === 402) throw new Error("Diese ElevenLabs-Stimme braucht einen bezahlten Tarif.");
    if (!res.ok) throw new Error(`ElevenLabs-Fehler ${res.status}`);
    const data = await res.arrayBuffer();
    return new Promise((resolve, reject) => ctx.decodeAudioData(data, resolve, reject));
}

async function speak(text) {
    if (!ctx || !text) return;
    let buffers;
    try {
        buffers = await Promise.all(splitForTts(text).map(tts));
    } catch (e) {
        statusEl.textContent = e.message;
        await sleep(2000);
        return;
    }
    setMode("speaking");
    for (const buffer of buffers) {
        await new Promise((resolve) => {
            const src = ctx.createBufferSource();
            src.buffer = buffer;
            src.connect(analyser);
            src.onended = resolve;
            src.start();
        });
    }
}

// ------------------------------------------------------------ main flow

async function showError(e) {
    console.error("[jarvis]", e);
    setMode("idle", e.message || String(e));
    await sleep(3500);
}

async function sendText(text, { hidden = false } = {}) {
    state.busy = true;
    if (!hidden) addLine("user", text);
    history.push({ role: "user", text });
    setMode("thinking", "Jarvis denkt nach...");
    try {
        const reply = await gemini({ system: systemPrompt(), contents: historyContents() });
        await handleReply(reply);
    } catch (e) {
        await showError(e);
    }
    state.busy = false;
}

async function listenLoop() {
    while (true) {
        if (state.muted) {
            if (!state.busy) setMode("idle", "Mikrofon aus — Mikrofon-Taste antippen zum Zuhoeren");
            await sleep(200);
            continue;
        }
        if (state.paused) {
            setMode("idle", "Pausiert — Kreis antippen zum Fortsetzen");
            await sleep(200);
            continue;
        }
        if (state.busy) {
            await sleep(100);
            continue;
        }
        setMode("listening", "Ich hoere zu...");
        const samples = await recordUtterance();
        if (!samples || !samples.length || state.busy) continue;

        state.busy = true;
        setMode("thinking", "Verstehe...");
        try {
            const { heard, reply } = await askWithAudio(toWavBase64(samples, ctx.sampleRate));
            if (heard) {
                addLine("user", heard);
                history.push({ role: "user", text: heard });
                if (reply) await handleReply(reply);
            }
        } catch (e) {
            await showError(e);
        }
        state.busy = false;
    }
}

async function start() {
    if (!isSetUp()) {
        openSettings();
        return;
    }
    state.started = true;
    setMode("thinking", "Starte...");
    try {
        await startAudio();
    } catch (e) {
        state.started = false;
        setMode("idle", "Kein Mikrofonzugriff. Bitte in Safari erlauben und nochmal tippen.");
        console.error(e);
        return;
    }
    updateMicButton();
    setMode("idle", "Kalibriere Mikrofon... bitte kurz still sein");
    const [w] = await Promise.all([loadWeather(), calibrate()]);
    weather = w;
    await sendText("Jarvis activate", { hidden: true });
    listenLoop();
}

orb.addEventListener("click", () => {
    if (!state.started) return start();
    if (ctx && ctx.state !== "running") ctx.resume();
    state.paused = !state.paused;
    orb.classList.toggle("paused", state.paused);
});

$("text-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("text-input");
    const text = input.value.trim();
    if (!text || state.busy) return;
    input.value = "";
    input.blur();
    if (!isSetUp()) return openSettings();
    if (!ctx) {
        // typing before starting: set up audio output only (tap counts as user gesture)
        setAudioSession("playback");
        ensureOutput();
        ctx.resume();
    }
    sendText(text);
});

// ------------------------------------------------------------ mic button

const micBtn = $("mic-btn");

function updateMicButton() {
    const on = state.started && !state.muted;
    micBtn.classList.toggle("off", !on);
    micBtn.setAttribute("aria-label", on ? "Mikrofon stummschalten" : "Mikrofon einschalten");
}

async function setMuted(muted) {
    if (muted) {
        disconnectMic();
        setAudioSession("playback");
        state.muted = true;
    } else {
        setAudioSession("play-and-record");
        try {
            if (ctx.state !== "running") await ctx.resume();
            await connectMic();
            state.muted = false;
            state.paused = false;
        } catch (e) {
            console.error("[jarvis] mic restart failed", e);
            state.muted = true;
            statusEl.textContent = "Mikrofon konnte nicht gestartet werden. Bitte nochmal tippen.";
        }
    }
    updateMicButton();
}

micBtn.addEventListener("click", () => {
    if (!state.started) return start();
    setMuted(!state.muted);
});

// iOS suspends audio in the background and may kill the mic when the screen locks.
// On return try to revive both; if that fails, the mic button restarts the mic by hand.
document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState !== "visible" || !ctx) return;
    if (ctx.state !== "running") ctx.resume().catch(() => {});
    if (!state.started || state.muted || !processor || micAlive()) return;
    try {
        await connectMic();
    } catch (e) {
        console.warn("[jarvis] mic did not come back", e);
        disconnectMic();
        state.muted = true;
        updateMicButton();
    }
});

// ------------------------------------------------------------ orb animation

const wave = new Float32Array(1024);
let smoothed = 0;

function animate() {
    const t = performance.now() / 1000;
    let level;
    if (state.mode === "listening") {
        level = Math.min(1, mic.level / (mic.threshold * 3));
    } else if (state.mode === "speaking" && analyser) {
        analyser.getFloatTimeDomainData(wave);
        let sum = 0;
        for (let i = 0; i < wave.length; i++) sum += wave[i] * wave[i];
        level = Math.min(1, Math.sqrt(sum / wave.length) * 5);
    } else if (state.mode === "thinking") {
        level = 0.3 + 0.3 * Math.sin(t * 8);
    } else {
        level = 0.15 + 0.15 * Math.sin(t * 2);
    }
    smoothed += (level - smoothed) * 0.3;
    orb.style.transform = `scale(${1 + smoothed * 0.3})`;
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
updateMicButton();
if (!isSetUp()) openSettings();
