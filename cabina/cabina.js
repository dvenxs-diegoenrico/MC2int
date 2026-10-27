/* =================================================================
   LA CABINA
   The second layer of the site: the control room where MC² was
   recorded. index.html downloads this file (and cabina.css) the first
   time someone presses "Apagar la luz", so the store stays as fast as
   it was.

   How it is put together:
   1. MEDIA: every photo, audio and video placeholder, in one place.
      Write a path there and the real file replaces the placeholder.
   2. build() writes the whole layer once.
   3. enter() / exit() show it over the store and hide it again.
   4. The address drives the screens: #cabina is the hub and
      #cabina/consola a station, so the phone's back button works and
      any screen can be linked.
   5. One block per station, further down.
   ================================================================= */

/* ---------------------------------------------------------------
   1. MEDIA (placeholders)
   Empty = the placeholder stays. Paths are relative to index.html,
   for example "cabina/img/consola.jpg".
   --------------------------------------------------------------- */
const MEDIA = {
  // The room's objects (ventana … apagador) were generated with Canva AI
  // in the style of the session Polaroids; swap them for real photos anytime.
  photos: {
    ventana:    "photos/cabina-ventana.jpg",   // FOTO: el vidrio de la cabina hacia la sala   → sala de huéspedes
    monitor:    "photos/cabina-monitor.jpg",   // FOTO: la tele / monitor de la cabina         → canal mc²
    archivero:  "photos/cabina-archivero.jpg",   // FOTO: el archivero                           → archivo
    consola:    "photos/cabina-consola.jpg",   // FOTO: la consola, los faders                 → consola
    perilla:    "photos/cabina-perilla.jpg",   // FOTO: la perilla, vista desde arriba (cuadrada) → frecuencia
    hoja:       "photos/cabina-hoja.jpg",   // FOTO: la hoja de sesión (track sheet)        → acta
    ranura:     "photos/cabina-ranura.jpg",   // FOTO: la ranura de la llave                  → llave
    apagador:   "photos/cabina-apagador.jpg",   // FOTO: el apagador de la cabina               → pared 08, prender la luz
    boveda:     "photos/sesion-fender.jpg",   // FOTO: lo que abre la llave MC2-TEE-01
    mits:       "",   // FOTO: sesión invitada MITS
    ripe:       "",   // FOTO: sesión invitada RiPE
    sonicranch: "photos/sesion-sonic-ranch.jpg",   // FOTO: sesión invitada Sonic Ranch
  },
  // FOTO PANORÁMICA: the whole control room in one photo, wrapped on
  // the 220° curve around the fan. Generated with Canva AI; a real
  // panorama of the room (the phone's panorama mode) can replace it. If
  // you change it, move the objects in OBJECTS to where things are.
  panorama: "photos/cabina-panoramica.jpg",
  panoramaRatio: 1628 / 644,   // its width / height
  // AUDIO: the fragment heard once the signal is tuned (mp3 or m4a).
  // Empty = a test chord made by the browser.
  frecuencia: "",
  // VIDEO: the transmissions of Canal MC². Each one is a video file
  // (video) or a YouTube video (youtube = its id, the part after youtu.be/).
  // inicio / fin (seconds) play only a fragment of it. Nothing = "sin señal".
  canal: [
    { id: "tx-01", titulo: "todo cae · lyric video", youtube: "7zEhOL9S19s" },
    { id: "tx-02", titulo: "la cabina, de noche",            video: "" },
    { id: "tx-03", titulo: "tornillo, tx · camino al estudio", video: "" },
    { id: "tx-04", titulo: "mesa de mezcla · overdubs",      video: "" },
  ],
};

// The single on air. Tuning 106.0 in Frecuencia reveals it, with the
// official Spotify player (loaded only then, never before).
const SINGLE = {
  titulo: "Todo Cae",
  datos: "dstance · 2026 · 4:29",
  spotifyEmbed: "https://open.spotify.com/embed/album/135QtRswX1tefmyG1kXxxh?theme=0",
  links: [
    ["Spotify", "https://open.spotify.com/album/135QtRswX1tefmyG1kXxxh"],
    ["Apple Music", "https://music.apple.com/mx/album/todo-cae/6805595531?i=6805595532"],
    ["YouTube", "https://youtu.be/7zEhOL9S19s"],
  ],
};

// The test keys. Each one opens its own hidden content in the slot.
// Compared without dashes or spaces, so "mc2 tee 01" works too.
const LLAVES = {
  MC2TEE01: {
    id: "MC2-TEE-01",
    titulo: "la toma que no salió",
    texto: "contenido oculto de prueba. aquí va lo que solo abre la llave de la playera: una toma, una foto, una nota de voz.",
    photo: "boveda",
  },
};

// Wash lot shown on the archive cards. Placeholder: confirm the real lot.
const LOTE = "lote 01 · session 01";

const COORDS = "31.4456°N 106.0078°W";

// The room is one panoramic photo on a 220° curve around the fan. Each
// object is a place in that photo: x, y are its center and w, h its
// size, all in % of the photo. Sizes follow the real things: a tiny
// light switch, a huge console. You start facing the glass.
const OBJECTS = [
  { nombre: "el apagador",       lights: true,          x: 1.8,  y: 51, w: 2.6, h: 10 },
  { nombre: "el archivero",      station: "archivo",    x: 22.5, y: 63, w: 9,   h: 54 },
  { nombre: "la consola",        station: "consola",    x: 40,   y: 70, w: 24,  h: 18 },
  { nombre: "la perilla",        station: "frecuencia", x: 53,   y: 58, w: 6,   h: 10 },
  { nombre: "el vidrio",         station: "huespedes",  x: 53.5, y: 33, w: 30,  h: 34, home: true },
  { nombre: "la ranura",         station: "llave",      x: 84,   y: 63, w: 10,  h: 8, photo: "ranura" },
  { nombre: "la tele",           station: "canal",      x: 86,   y: 44, w: 12,  h: 22 },
  { nombre: "la hoja de sesión", station: "acta",       x: 91,   y: 84, w: 11,  h: 14 },
];
const SIGN = { x: 53.5, y: 11 };          // the live session light, over the glass
const ARC = 220;                          // how far around you the room goes
const SLICES = 22;                        // the panorama is drawn as this many flat strips
const SLICE = ARC / SLICES;               // degrees per strip
const deg = (o) => o.x / 100 * ARC;       // where an object is on the curve
const HOME = deg(OBJECTS.find((o) => o.home));

// The hotspots: station number, what it is in the room, which photo.
const STATIONS = {
  frecuencia: { n: "01", nombre: "frecuencia",        objeto: "perilla",        photo: "perilla" },
  consola:    { n: "02", nombre: "consola",           objeto: "faders",         photo: "consola" },
  canal:      { n: "03", nombre: "canal mc²",         objeto: "monitor",        photo: "monitor" },
  archivo:    { n: "04", nombre: "archivo",           objeto: "archivero",      photo: "archivero" },
  llave:      { n: "05", nombre: "llave",             objeto: "ranura",         photo: "ranura" },
  huespedes:  { n: "06", nombre: "sala de huéspedes", objeto: "ventana",        photo: "ventana" },
  acta:       { n: "07", nombre: "acta",              objeto: "hoja de sesión", photo: "hoja" },
};


/* ---------------------------------------------------------------
   THE FAN'S STATE, kept in this browser
   Same rule as "Mi lista" in the store: localStorage can be blocked
   (private windows), so every use is wrapped in try/catch and the
   cabin still works, it just forgets.
   --------------------------------------------------------------- */
const STATE_KEY = "mc2-cabina";
const state = { llaves: [], sintonizada: false, overdubs: 20, acta: false, ...loadState() };
if (!Array.isArray(state.llaves)) state.llaves = [];

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STATE_KEY));
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}
function saveState() {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch { /* not saved, still works */ }
}


/* SMALL HELPERS */
const noMotion = matchMedia("(prefers-reduced-motion: reduce)");
const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const esc = (text) => String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// A placeholder card. aria-hidden: the button around it carries the name.
function ph(key, label, extra = "") {
  return `<span class="ph ${extra}" data-photo="${key}" aria-hidden="true">FOTO: ${esc(label)}</span>`;
}

// A tiny seeded random generator, so the acta's texture doesn't flicker while typing.
function seeded(seed) {
  return () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


/* ---------------------------------------------------------------
   2. BUILD: the whole layer, written once
   --------------------------------------------------------------- */
let root = null;
const $ = (selector) => root.querySelector(selector);

// An object in the room: an outline over the thing in the photo, its tag
// under it. The ranura isn't in the photo, so its own photo is laid in.
function spot(o, i) {
  const area = (inside = "") => `<span class="spot-area" aria-hidden="true">${inside}</span>`;
  if (o.lights) {
    return `
      <button class="spot spot-apagador" type="button" data-obj="${i}" data-lights-on aria-label="apagador: prender la luz y salir de la cabina">
        ${area()}<span class="spot-tag" aria-hidden="true"><b>00</b> // prender la luz ↗</span>
      </button>`;
  }
  const s = STATIONS[o.station];
  const photo = o.photo && MEDIA.photos[o.photo] ? `<img src="${MEDIA.photos[o.photo]}" alt="">` : "";
  return `
    <button class="spot spot-${o.station}" type="button" data-obj="${i}" data-go="${o.station}" aria-label="${s.n} ${s.nombre}, ${s.objeto}: abrir estación">
      ${area(photo)}<span class="spot-tag" aria-hidden="true"><b>${s.n}</b> // ${s.nombre} ↗</span>
    </button>`;
}

// The studio's "on air" light: it turns on when the lights go off.
function onAir(id) {
  return `<p class="onair" id="${id}" role="img" aria-label="live session: grabando"><span class="onair-dot" aria-hidden="true"></span><span aria-hidden="true">live session</span></p>`;
}

function station(name, body) {
  const s = STATIONS[name];
  return `
    <section class="cab-station" data-screen="${name}" hidden aria-labelledby="st-${name}">
      <div class="st-inner">
        <div class="st-head">
          <button class="cab-btn" type="button" data-back>‹ regresar</button>
          <span class="st-code"><b>${s.n}</b> // ${s.objeto}</span>
        </div>
        <h2 id="st-${name}" tabindex="-1">${s.nombre}</h2>
        ${MEDIA.photos[s.photo] ? `<figure class="st-hero" aria-hidden="true"><img src="${MEDIA.photos[s.photo]}" alt=""></figure>` : ""}
        ${body}
      </div>
    </section>`;
}

function build() {
  root = el("div", "cab");
  root.id = "cabina-root";
  root.hidden = true;
  root.setAttribute("role", "region");
  root.setAttribute("aria-label", "La Cabina");

  const ticks = Array.from({ length: 60 }, (_, i) => {
    const a = (i / 60) * Math.PI * 2, long = i % 5 === 0;
    const r1 = long ? 40 : 43, r2 = 47;
    const p = (r) => [50 + Math.sin(a) * r, 50 - Math.cos(a) * r].map((v) => v.toFixed(2));
    const [x1, y1] = p(r1), [x2, y2] = p(r2);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${long ? 1 : .6}"/>`;
  }).join("");

  const random = seeded(31);
  const dust = Array.from({ length: 22 }, () =>
    `<i style="left:${(random() * 100).toFixed(1)}%;top:${(random() * 100).toFixed(1)}%"></i>`).join("");

  const fader = (name, value, r) => `
    <div class="ch${name === "overdubs" ? " ch-od" : ""}">
      <span class="ch-tape" style="--r:${r}deg">${name}</span>
      <div class="fader-slot"><input type="range" min="0" max="100" value="${value}" data-ch="${name}" aria-label="fader ${name}"></div>
      <span class="ch-db" aria-hidden="true"></span>
    </div>`;

  root.innerHTML = `
    <div class="cab-bar">
      <span class="cab-coords">${COORDS}</span>
      <button class="cab-btn" type="button" data-lights-on>prender la luz</button>
    </div>

    <section class="cab-boot" data-screen="boot" aria-label="Entrada">
      <p class="cab-coords">${COORDS}</p>
      <p role="progressbar" aria-label="calibrando la señal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="boot-bar">calibrando la señal… <span class="boot-pct" id="boot-pct">0%</span></p>
      ${onAir("boot-sign")}
    </section>

    <section class="cab-hub" data-screen="hub" hidden tabindex="-1" aria-label="La cabina: mira alrededor y elige un objeto">
      <div class="room" id="room"${MEDIA.panorama ? ` style="--pano: url('${new URL(MEDIA.panorama, document.baseURI).href}')"` : ""}>
        <!-- The URL is absolute: inside a CSS variable it would otherwise
             resolve against cabina.css instead of the page. -->
        ${Array.from({ length: SLICES }, (_, i) => `<div class="slice" data-slice="${i}" style="--i:${i}"></div>`).join("")}
        <div class="room-item" data-sign>${onAir("hub-sign")}</div>
        ${OBJECTS.map(spot).join("")}
      </div>
      <div class="cab-dust" aria-hidden="true">${dust}</div>
      <button class="cab-btn gyro" id="gyro" type="button" aria-pressed="false" hidden>mover el teléfono: off</button>
      <div class="hub-nav">
        <button class="cab-btn turn" id="turn-left" type="button" aria-label="girar a la izquierda">‹</button>
        <p><span id="rumbo"></span><span id="hub-status"></span></p>
        <button class="cab-btn turn" id="turn-right" type="button" aria-label="girar a la derecha">›</button>
      </div>
      <p class="sr-only" id="hub-live" aria-live="polite"></p>
    </section>

    ${station("frecuencia", `
      <p class="st-lead">la sesión sigue al aire en algún punto del cuadrante. gira la perilla hasta que la estática se limpie.</p>
      <div class="fq" id="fq">
        <div class="fq-screen">
          <canvas width="120" height="52" aria-hidden="true"></canvas>
          <p class="fq-read"><span class="fq-mhz" id="fq-mhz"></span><span>mhz</span><span class="fq-state" id="fq-state"></span></p>
        </div>
        <div class="fq-controls">
          <div class="dial" id="fq-dial" role="slider" tabindex="0" aria-label="perilla de frecuencia"
               aria-valuemin="87.5" aria-valuemax="108">
            <svg viewBox="0 0 100 100" aria-hidden="true">${ticks}</svg>
            <span class="dial-knob"></span>
          </div>
          <div class="fq-side">
            <p class="meter" id="fq-meter" aria-hidden="true"></p>
            <button class="cab-btn" type="button" id="fq-sound" aria-pressed="true">sonido: on</button>
            <p class="st-note">pista: la señal está en las coordenadas.</p>
            <p class="st-note">AUDIO: ${MEDIA.frecuencia ? "fragmento de la sesión" : "tono de prueba (placeholder)"}</p>
          </div>
        </div>
        <div class="sp" id="fq-sp">
          <!-- Two short lines of Todo Cae. In the static, each one overlaps a
               line from the verses; tuned, they collapse into the chorus. -->
          <p class="st-tag">fragmento en superposición // todo cae</p>
          <p class="sp-line"><span class="sp-a">todo cae en su lugar</span><span class="sp-b" aria-hidden="true">pensando en que perdí</span></p>
          <p class="sp-line"><span class="sp-a">solo hay que esperar</span><span class="sp-b" aria-hidden="true">cuesta dejarlos ir</span></p>
        </div>
        <div class="fq-air" id="fq-air" hidden tabindex="-1">
          <p class="st-tag">al aire // <b>single 01</b></p>
          <h3>${esc(SINGLE.titulo)}</h3>
          <p class="st-note">${esc(SINGLE.datos)}</p>
          <div class="fq-player" id="fq-player"></div>
          <ul class="fq-links">
            ${SINGLE.links.map(([name, url]) => `<li><a class="cab-btn" href="${url}" target="_blank" rel="noopener">${name} ↗</a></li>`).join("")}
          </ul>
        </div>
        <p class="sr-only" id="fq-live" aria-live="polite"></p>
      </div>`)}

    ${station("consola", `
      <p class="st-lead">cuatro canales de la toma 01. el último decide qué tan en vivo quedó.</p>
      <p class="take"><span class="take-word" id="take-word" aria-live="polite"></span><small>toma 01 // session 01 · sonic ranch</small></p>
      <div class="desk">
        ${fader("voz", 72, -2)}${fader("guitarras", 60, 1.5)}${fader("sala", 45, -1)}${fader("overdubs", state.overdubs, 2)}
      </div>
      <p class="st-note">la posición del fader overdubs viaja a tu acta.</p>`)}

    ${station("canal", `
      <p class="st-lead">la tele de la cabina. las transmisiones se prenden por fases.</p>
      <div class="tv">
        <div class="tv-screen" id="tv-screen">
          <canvas width="96" height="72" aria-hidden="true"></canvas>
          <video playsinline controls hidden></video>
          <div class="tv-msg" id="tv-msg" aria-live="polite"><strong>sin señal</strong><span>canal mc² · en espera</span></div>
          <span class="tv-ch" aria-hidden="true">ch 03</span>
        </div>
        <div class="tv-foot" aria-hidden="true"><span>${COORDS}</span><span>archive locked</span></div>
      </div>
      <ul class="tx-list">
        ${MEDIA.canal.map((tx, i) => `
          <li><button class="tx" type="button" data-tx="${i}">
            <b>${esc(tx.id)}</b><span>${esc(tx.titulo)}</span><span>${tx.video || tx.youtube ? "al aire" : "sin señal"}</span>
          </button></li>`).join("")}
      </ul>
      <p class="st-note">VIDEO: cada transmisión es un placeholder.</p>`)}

    ${station("archivo", `
      <p class="st-lead">las fichas de session 01. tiraje cerrado: se consultan, no se mueven.</p>
      <div class="fichas" id="fichas"></div>`)}

    ${station("llave", `
      <p class="st-lead">cada pieza trae su llave. insértala y la cabina abre lo que estaba guardado.</p>
      ${ph("ranura", "ranura de la llave", "slot-ph")}
      <form class="key-form" id="key-form" novalidate>
        <label class="qty-label" for="key-input">código de la llave</label>
        <div class="key-row">
          <input class="cab-input" id="key-input" autocomplete="off" autocapitalize="characters" spellcheck="false"
                 placeholder="MC2-XXX-00" maxlength="16" aria-describedby="key-msg">
          <button class="cab-btn solid" type="submit">insertar ↗</button>
        </div>
        <p class="key-msg" id="key-msg" aria-live="polite"></p>
      </form>
      <div class="vault" id="vault" hidden tabindex="-1">
        <p class="st-tag">llave aceptada // <b id="vault-id"></b></p>
        <h3 id="vault-title"></h3>
        <p class="st-lead" id="vault-text"></p>
        <span class="ph" id="vault-ph" aria-hidden="true"></span>
      </div>
      <p class="st-note" id="key-list"></p>`)}

    ${station("huespedes", `
      <p class="st-lead">del otro lado del vidrio. las sesiones invitadas entran por fases.</p>
      <div class="guests">
        ${[["mits", "MITS"], ["ripe", "RiPE"], ["sonicranch", "Sonic Ranch"]].map(([key, name]) => `
          <article class="guest">
            ${ph(key, name)}
            <h3>${name}</h3>
            <p>sesión invitada · próximamente</p>
            <p>archive locked</p>
          </article>`).join("")}
      </div>`)}

    ${station("acta", `
      <p class="st-lead">firma la hoja de sesión y la cabina te da tu acta: con la toma, las coordenadas y la fecha.</p>
      <div class="acta-grid">
        <form id="acta-form" novalidate>
          <label class="field">
            <span class="qty-label">Tu nombre</span>
            <input id="acta-name" maxlength="28" autocomplete="name" placeholder="como quieres que aparezca" aria-describedby="acta-error">
          </label>
          <p class="field-error" id="acta-error" aria-live="polite"></p>
          <fieldset class="opt">
            <legend>La toma</legend>
            <div class="pills">
              <label class="pill"><input type="radio" name="toma" value="live"><span>recorded live</span></label>
              <label class="pill"><input type="radio" name="toma" value="od"><span>some overdubs</span></label>
            </div>
          </fieldset>
          <div class="acta-actions">
            <button class="cab-btn solid" type="submit">descargar acta ↗</button>
            <button class="cab-btn" type="button" id="acta-share" hidden>compartir ↗</button>
          </div>
          <p class="st-note">el acta se hace en tu teléfono. no se envía a ningún lado.</p>
        </form>
        <figure class="acta-preview">
          <canvas id="acta-canvas" width="1080" height="1350" role="img" aria-label="vista previa de tu acta MC²"></canvas>
        </figure>
      </div>`)}

    <div class="cab-flash" aria-hidden="true"></div>
    <canvas class="cab-quantum" hidden aria-hidden="true"></canvas>`;

  document.body.append(root);

  // Real photos replace their placeholders.
  for (const card of root.querySelectorAll("[data-photo]")) usePhoto(card, card.dataset.photo);

  // Navigation, for every button in the layer.
  root.addEventListener("click", (event) => {
    const go = event.target.closest("[data-go]");
    if (go && !jumping) {
      lastSpot = go.dataset.go;
      history.pushState({ fromHub: true }, "", "#cabina/" + go.dataset.go);
      quantumJump(go, () => openScreen(go.dataset.go, true));
    }
    if (event.target.closest("[data-back]")) back();
    if (event.target.closest("[data-lights-on]")) leaveTo(null);
  });
  // Touch screens have no hover: the object lights up while the finger is on it.
  const glowing = ".spot, .ficha, .guest, .tx, .tv";
  root.addEventListener("pointerdown", (event) => {
    const target = event.pointerType !== "mouse" && event.target.closest(glowing);
    if (target) target.classList.add("lit");
  });
  const unlight = () => {
    for (const lit of root.querySelectorAll(".lit:not(.jumping)")) setTimeout(() => lit.classList.remove("lit"), 350);
  };
  root.addEventListener("pointerup", unlight);
  root.addEventListener("pointercancel", unlight);
  // Esc goes back from a station. Listened on the whole window: after a
  // drag the keyboard focus can be outside the cabin (on the page body).
  window.addEventListener("keydown", (event) => {
    if (open && event.key === "Escape" && STATIONS[current]) { event.preventDefault(); back(); }
  });
  window.addEventListener("hashchange", () => {
    if (!open) return;
    if (!location.hash.startsWith("#cabina")) exit();
    else if (!booting) route();
  });

  setupRoom();
  setupFrecuencia();
  setupConsola();
  setupCanal();
  setupLlave();
  setupActa();
}

function usePhoto(card, key) {
  const src = MEDIA.photos[key];
  card.classList.toggle("has-photo", Boolean(src));
  card.style.backgroundImage = src ? `url("${src}")` : "";
}


/* ---------------------------------------------------------------
   3. ENTER AND EXIT
   The cabin is a full-screen layer over the store. The store stays
   right where it was underneath (same scroll), made "inert" so the
   keyboard and screen readers only see the cabin.
   --------------------------------------------------------------- */
let open = false, booting = false, booted = false, current = null, lastSpot = null;
const viewport = document.querySelector('meta[name="viewport"]');
const viewportBase = viewport ? viewport.content : "";

export function enter() {
  if (open) return;
  if (!root) build();
  open = true;
  document.documentElement.classList.add("cabina-on");
  for (const node of document.body.children) if (node !== root) node.inert = true;
  // Like an app: no pinch zoom inside the cabin (the store keeps it).
  if (viewport) viewport.content = viewportBase + ", maximum-scale=1, user-scalable=no";
  // Full screen on phones that allow it (Android). iPhones only do it
  // from the home screen, which the meta tags in index.html prepare.
  if (matchMedia("(pointer: coarse)").matches && document.fullscreenEnabled && !document.fullscreenElement) {
    document.documentElement.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
  }
  root.hidden = false;
  if (!location.hash.startsWith("#cabina")) history.pushState(null, "", "#cabina");
  boot().then(() => { if (open) route(); });
}

function exit() {
  if (!open) return;
  open = false;
  stopStation(current);
  current = null;
  root.hidden = true;
  document.documentElement.classList.remove("cabina-on");
  for (const node of document.body.children) node.inert = false;
  if (viewport) viewport.content = viewportBase;
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  window.MC2.lightsOn();
  document.getElementById("lights")?.focus({ preventScroll: true });
}

// "Prender la luz" (and "ver en la tienda"): a new history step back to the store.
function leaveTo(then) {
  history.pushState(null, "", location.pathname + location.search);
  exit();
  if (then) then();
}

/* 1. ENTRADA: black, the coordinates, and a counter to 100%.
   It loads the real photos meanwhile, and waits for them at 99%.
   The first visit takes ~2.5 s; coming back is quicker. */
function boot() {
  booting = true;
  show("boot");
  const pct = $("#boot-pct"), bar = $("#boot-bar"), sign = $("#boot-sign");
  sign.classList.remove("on");
  const duration = noMotion.matches ? 500 : booted ? 900 : 2600;
  let loaded = false;
  preload().then(() => { loaded = true; });

  return new Promise((resolve) => {
    const start = performance.now();
    let shown = 0;
    const done = () => { booting = false; booted = true; resolve(); };
    (function step(now) {
      if (!open) return done();
      const t = Math.min(1, (now - start) / duration);
      // Uneven on purpose, like a tape finding its speed.
      let target = Math.floor(100 * (1 - Math.pow(1 - t, 2.2)));
      if (!loaded) target = Math.min(target, 99);
      if (target > shown && (noMotion.matches || target === 100 || Math.random() > .4)) shown = target;
      pct.textContent = shown + "%";
      bar.setAttribute("aria-valuenow", shown);
      // At 100% the "live session" light flickers on, then the room appears.
      if (shown >= 100) {
        sign.classList.add("on");
        return void setTimeout(done, noMotion.matches ? 300 : booted ? 700 : 1100);
      }
      requestAnimationFrame(step);
    })(start);
  });
}

function preload() {
  const each = Object.values(MEDIA.photos).filter(Boolean).map((src) => new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = resolve;
    img.src = src;
  }));
  return Promise.race([Promise.all(each), new Promise((resolve) => setTimeout(resolve, 4000))]);
}


/* ---------------------------------------------------------------
   4. SCREENS
   --------------------------------------------------------------- */
function show(name) {
  for (const screen of root.querySelectorAll("[data-screen]")) screen.hidden = screen.dataset.screen !== name;
  $(".cab-bar").hidden = name === "boot";
}

function route() {
  const name = location.hash.slice(1).split("/")[1];
  openScreen(STATIONS[name] ? name : "hub");
}

function openScreen(name, quiet = false) {
  if (name === current) return;
  const previous = current;
  stopStation(current);
  // Back from a station: the object it came from rematerializes in the hub.
  const returning = name === "hub" && STATIONS[previous] && $(`[data-go="${previous}"]`);
  if (!returning && !quiet && !noMotion.matches) {
    const flash = $(".cab-flash");
    flash.classList.remove("on");
    void flash.offsetWidth;   // restart the animation
    flash.classList.add("on");
  }
  show(name);
  current = name;
  if (returning) quantumJump(returning, null, true);   // measured now that the hub is visible
  if (name === "hub") {
    refreshHub();
    room.start();
    const from = lastSpot && $(`[data-go="${lastSpot}"]`);
    (from || $(".cab-hub")).focus({ preventScroll: true });
  } else {
    starts[name]?.();
    $(`[data-screen="${name}"]`).scrollTop = 0;
    $(`#st-${name}`).focus({ preventScroll: true });
  }
}

function stopStation(name) {
  if (name === "hub") room.stop();
  stops[name]?.();
}

// "‹ regresar": back in history when we came from the hub, so the phone's
// back button and this one do the same thing.
function back() {
  if (history.state && history.state.fromHub) history.back();
  else { history.replaceState(null, "", "#cabina"); openScreen("hub"); }
}

const starts = {}, stops = {};

function refreshHub() {
  $(".spot-frecuencia").classList.toggle("done", Boolean(state.sintonizada));
  $(".spot-llave").classList.toggle("done", state.llaves.length > 0);
  $(".spot-acta").classList.toggle("done", Boolean(state.acta));
  $("#hub-status").textContent =
    "arrastra para girar · señal " + (state.sintonizada ? "sintonizada" : "calibrada") + " · llaves " + state.llaves.length;
}


/* ---------------------------------------------------------------
   THE HUB: one room, 220° around you
   The panorama is cut into flat strips standing on a curve, with the
   eye at its center: each strip and each object carries its own CSS
   perspective, so the browser never has to sort them in 3D. The
   objects sit a little in front of the photo, over the things they
   are. Where you look is one number, the angle (0 = the left end):
   - drag (finger or mouse) looks around, a flick carries on a little;
   - ‹ › turn a bit, as do the arrow keys; Tab turns to each object;
   - "mover el teléfono": the phone's compass (asks first on iPhone).
   The view stops at the ends of the photo. Things far to the side are
   not drawn, but stay in the Tab order.
   --------------------------------------------------------------- */
const room = { start() {}, stop() {} };

function setupRoom() {
  const hub = $(".cab-hub"), stage = $("#room");
  const slices = [...root.querySelectorAll(".slice")];
  const items = [...root.querySelectorAll("[data-obj]")].map((node) => ({ node, o: OBJECTS[node.dataset.obj] }));
  items.push({ node: $("[data-sign]"), o: { ...SIGN, w: 8, h: 4, sign: true } });
  const heading = $("#rumbo"), live = $("#hub-live"), gyroButton = $("#gyro");
  const RAD = Math.PI / 180;
  let angle = HOME, target = HOME, frame = 0, radius = 500, half = 20, panoH = 760, spoken = "";
  const wrap = (d) => ((d % 360) + 540) % 360 - 180;
  const clamp = (a) => half * 2 >= ARC ? ARC / 2 : Math.min(ARC - half, Math.max(half, a));
  const nearest = (a) => OBJECTS.reduce((best, o) => Math.abs(deg(o) - a) < Math.abs(deg(best) - a) ? o : best);

  // The radius makes the photo at least as tall as the room on screen,
  // and keeps wide screens from seeing more than ~100° at once.
  function size() {
    const box = hub.getBoundingClientRect();
    const sliceW = (r) => 2 * r * Math.tan(SLICE / 2 * RAD);
    const ratio = MEDIA.panoramaRatio || 2;
    const tallness = SLICES * sliceW(1) / ratio;                 // photo height per unit of radius
    radius = Math.max(box.height / tallness, box.width * .42);
    half = Math.atan(box.width / 2 / radius) / RAD;
    panoH = SLICES * sliceW(radius) / ratio;
    stage.style.setProperty("--slice-w", (sliceW(radius) + 1).toFixed(1) + "px");   // +1px hides the seams
    stage.style.setProperty("--pano-w", (SLICES * sliceW(radius)).toFixed(1) + "px");
    stage.style.setProperty("--pano-h", panoH.toFixed(1) + "px");
    // Each object is a flat card whose edges touch the curve, so it covers
    // its thing in the photo; it sits that much closer to you.
    for (const item of items) {
      const span = item.o.w / 100 * ARC * RAD;
      item.depth = radius * Math.cos(span / 2);
      const k = item.depth / radius;
      const w = 2 * radius * Math.sin(span / 2), h = item.o.h / 100 * panoH * k;
      item.y = (item.o.y / 100 - .5) * panoH * k;
      Object.assign(item.node.style, { width: w + "px", height: h + "px", marginLeft: -w / 2 + "px", marginTop: -h / 2 + "px" });
    }
    angle = clamp(angle);
    target = clamp(target);
  }

  function render() {
    const r = radius.toFixed(1);
    const place = (node, offset, depth, y = 0) => {
      node.style.transform = `perspective(${r}px) translateZ(${r}px) rotateY(${(-offset).toFixed(2)}deg) translateZ(${(-depth).toFixed(1)}px) translateY(${y.toFixed(1)}px)`;
    };
    for (const slice of slices) {
      const offset = (Number(slice.dataset.slice) + .5) * SLICE - angle;
      const far = Math.abs(offset) > half + SLICE;
      slice.classList.toggle("far", far);
      if (!far) place(slice, offset, radius);
    }
    for (const item of items) {
      const o = item.o, offset = o.x / 100 * ARC - angle;
      const far = Math.abs(offset) > half + o.w / 100 * ARC / 2 + 4;
      item.node.classList.toggle("far", far);
      if (!far) place(item.node, offset, item.depth, item.y);
    }
    const rumbo = ((Math.round(angle - HOME) % 360) + 360) % 360;
    heading.textContent = "rumbo " + String(rumbo).padStart(3, "0") + "° · " + nearest(angle).nombre;
    $("#turn-left").disabled = target <= clamp(-Infinity) + .5;
    $("#turn-right").disabled = target >= clamp(Infinity) - .5;
  }
  function announce() {
    const name = nearest(angle).nombre;
    if (name !== spoken) { live.textContent = "frente a ti: " + name; spoken = name; }
  }
  function tick() {
    frame = 0;
    angle += (target - angle) * .14;
    if (Math.abs(target - angle) < .05) angle = target;
    render();
    if (angle !== target) frame = requestAnimationFrame(tick);
    else announce();
  }
  function turnTo(next) {
    target = clamp(next);
    if (noMotion.matches) { angle = target; render(); announce(); }
    else if (!frame) frame = requestAnimationFrame(tick);
  }
  const turn = (by) => turnTo(target + by);

  // Dragging. A drag is not a tap: the click that follows it is swallowed.
  let dragging = false, moved = false, startX = 0, startAngle = 0, lastX = 0, lastT = 0, speed = 0;
  const perPx = () => 1 / (radius * RAD);   // degrees per pixel, in front of you
  hub.addEventListener("pointerdown", (event) => {
    if (event.button > 0 || event.target.closest(".hub-nav, .gyro")) return;
    gyroOff();
    dragging = true;
    moved = false;
    startX = lastX = event.clientX;
    lastT = event.timeStamp;
    speed = 0;
    startAngle = angle;
    cancelAnimationFrame(frame);
    frame = 0;
  });
  window.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    if (!moved && Math.abs(dx) < 8) return;
    moved = true;
    speed = (event.clientX - lastX) / Math.max(1, event.timeStamp - lastT);   // px per ms
    lastX = event.clientX;
    lastT = event.timeStamp;
    // Past an end the view only gives a little, like pushing a wall.
    const wanted = startAngle - dx * perPx();
    angle = target = clamp(wanted) + (wanted - clamp(wanted)) * .25;
    render();
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    if (!moved) return;
    // A flick carries the look on a little, then it settles where it is.
    const carry = Math.max(-15, Math.min(15, -speed * 220 * perPx()));
    turnTo(angle + carry);
  };
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);
  hub.addEventListener("click", (event) => {
    if (!moved) return;
    moved = false;
    event.stopPropagation();
    event.preventDefault();
  }, true);

  $("#turn-left").addEventListener("click", () => turn(-30));
  $("#turn-right").addEventListener("click", () => turn(30));
  hub.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); turn(-30); }
    if (event.key === "ArrowRight") { event.preventDefault(); turn(30); }
  });
  // Tab to an object: you turn to face it.
  hub.addEventListener("focusin", (event) => {
    const node = event.target.closest("[data-obj]");
    if (node) turnTo(deg(OBJECTS[node.dataset.obj]));
    stage.scrollLeft = stage.scrollTop = 0;   // focus must never scroll the room
  });
  stage.addEventListener("scroll", () => { stage.scrollLeft = stage.scrollTop = 0; });

  // The phone's compass. Turning left (alpha grows) looks left.
  let gyro = null;
  const onTilt = (event) => {
    if (event.alpha == null || !gyro) return;
    if (gyro.base == null) { gyro.base = event.alpha; gyro.from = angle; }
    angle = target = clamp(gyro.from - wrap(event.alpha - gyro.base));
    render();
  };
  function gyroLabel(on) {
    gyroButton.textContent = "mover el teléfono: " + (on ? "on" : "off");
    gyroButton.setAttribute("aria-pressed", String(on));
  }
  async function gyroOn() {
    try {
      const ask = window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission;
      if (ask && (await DeviceOrientationEvent.requestPermission()) !== "granted") return;
    } catch { return; }
    gyro = { base: null };
    window.addEventListener("deviceorientation", onTilt);
    gyroLabel(true);
  }
  function gyroOff() {
    if (!gyro) return;
    gyro = null;
    window.removeEventListener("deviceorientation", onTilt);
    gyroLabel(false);
  }
  if (matchMedia("(pointer: coarse)").matches && "DeviceOrientationEvent" in window) {
    gyroButton.hidden = false;
    gyroButton.addEventListener("click", () => (gyro ? gyroOff() : gyroOn()));
  }

  window.addEventListener("resize", () => { if (current === "hub") { size(); render(); } });
  room.start = () => { size(); render(); announce(); };
  room.stop = () => gyroOff();
}


/* ---------------------------------------------------------------
   THE QUANTUM JUMP between screens
   The object you touched breaks into particles. On the way, each
   particle is in superposition: every frame it shows up in one of
   several possible places, and the further it travels the fewer
   places are left. They collapse into the green line of the signal,
   the line opens into the next screen, and the light fades.
   Going back plays it in reverse: the line closes and the particles
   fly home, so the object rematerializes where it was.
   --------------------------------------------------------------- */
let jumping = false;

function quantumJump(el, swap, reverse = false) {
  if (noMotion.matches || !el) { swap?.(); return; }
  jumping = true;
  const canvas = $(".cab-quantum"), ctx = canvas.getContext("2d");
  const W = root.clientWidth, H = root.clientHeight, ratio = window.devicePixelRatio || 1;
  canvas.width = W * ratio;
  canvas.height = H * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  canvas.hidden = false;

  // One particle per cell of the object, at most ~900.
  const box = el.querySelector(".spot-area").getBoundingClientRect(), frame0 = root.getBoundingClientRect();
  const step = Math.max(5, Math.sqrt((box.width * box.height) / 900));
  const lineY = H / 2;
  const green = token("--chem-green"), ivory = token("--ivory");
  const particles = [];
  for (let x = box.left; x < box.right; x += step) {
    for (let y = box.top; y < box.bottom; y += step) {
      particles.push({
        hx: x - frame0.left + Math.random() * step, hy: y - frame0.top + Math.random() * step,
        tx: Math.random() * W, ty: lineY + (Math.random() - .5) * 3,
        ghosts: [0, 1].map(() => [(Math.random() - .5) * 90, (Math.random() - .5) * 90]),
        color: Math.random() < .85 ? green : ivory,
        size: Math.random() < .3 ? 3 : 2,
      });
    }
  }

  const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  // p = 0: the particles are the object; p = 1: they are the line.
  function drawParticles(p) {
    const spread = Math.sin(Math.PI * p);   // most uncertain halfway
    for (const q of particles) {
      let x = q.hx + (q.tx - q.hx) * p, y = q.hy + (q.ty - q.hy) * p - spread * 40;
      const roll = Math.random();
      ctx.globalAlpha = 1;
      if (roll < spread * .55) {
        // Measured somewhere else this frame…
        const [gx, gy] = q.ghosts[roll < spread * .27 ? 0 : 1];
        x += gx * spread;
        y += gy * spread;
      } else if (roll > 1 - spread * .25) {
        // …or faintly in both places at once.
        ctx.globalAlpha = .35;
        ctx.fillStyle = q.color;
        ctx.fillRect(x + q.ghosts[0][0] * spread, y + q.ghosts[0][1] * spread, q.size, q.size);
      }
      ctx.fillStyle = q.color;
      ctx.fillRect(x, y, q.size, q.size);
    }
    ctx.globalAlpha = p * p;
    ctx.fillStyle = green;
    ctx.fillRect(0, lineY - 1, W, 2);
    ctx.globalAlpha = 1;
  }
  // b = 0: a thin line; b = 1: a band of light over the whole screen.
  function drawBand(b, alpha) {
    const h = 2 + (H - 2) * b;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = green;
    ctx.fillRect(0, lineY - h / 2, W, h);
    ctx.globalAlpha = 1;
  }

  const DURATION = reverse ? 800 : 950, SPLIT = reverse ? .4 : .55;
  const start = performance.now();
  let swapped = false;
  el.classList.add("lit", "jumping");
  if (reverse) { swap?.(); swapped = true; }

  (function tick(now) {
    if (!open) { canvas.hidden = true; jumping = false; el.classList.remove("jumping", "lit"); return; }
    const t = Math.min(1, (now - start) / DURATION);
    ctx.clearRect(0, 0, W, H);
    if (!reverse) {
      if (t < SPLIT) drawParticles(ease(t / SPLIT));
      else {
        if (!swapped) { swapped = true; el.classList.remove("jumping", "lit"); swap?.(); }
        const b = ease((t - SPLIT) / (1 - SPLIT));
        drawBand(b, (1 - b) * .85);
      }
    } else if (t < SPLIT) {
      const b = 1 - ease(t / SPLIT);
      drawBand(b, .25 + (1 - b) * .6);
    } else {
      drawParticles(1 - ease((t - SPLIT) / (1 - SPLIT)));
    }
    if (t < 1) return void requestAnimationFrame(tick);
    ctx.clearRect(0, 0, W, H);
    canvas.hidden = true;
    jumping = false;
    if (reverse) {
      el.classList.remove("jumping");
      setTimeout(() => el.classList.remove("lit"), 500);   // it glows a moment after landing
    }
  })(start);
}


/* ---------------------------------------------------------------
   STATIC: a tiny canvas of random pixels, blown up and pixelated.
   level() says how much static (0 = clean, 1 = all noise). A thin
   green line is the signal; it steadies as the static clears.
   --------------------------------------------------------------- */
function makeStatic(canvas, level) {
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(canvas.width, canvas.height);
  const px = image.data;
  let frame = 0, last = 0;

  function draw() {
    const n = level();
    for (let i = 0; i < px.length; i += 4) {
      const v = Math.random() * 255;
      px[i] = px[i + 1] = px[i + 2] = v;
      px[i + 3] = v * n * .9;
    }
    ctx.putImageData(image, 0, 0);
    if (n < 1) {
      ctx.globalAlpha = 1 - n;
      ctx.fillStyle = token("--chem-green");
      const y = Math.round(canvas.height / 2 + (Math.random() - .5) * n * canvas.height * .7);
      ctx.fillRect(0, y, canvas.width, 1);
      ctx.globalAlpha = 1;
    }
  }
  function loop(time) {
    frame = requestAnimationFrame(loop);
    if (time - last < 50) return;   // ~20 frames a second is enough for static
    last = time;
    draw();
  }
  return {
    start() { if (noMotion.matches) draw(); else if (!frame) frame = requestAnimationFrame(loop); },
    stop() { cancelAnimationFrame(frame); frame = 0; },
    draw,
  };
}


/* ---------------------------------------------------------------
   01 FRECUENCIA
   Turn the dial (drag around it, the mouse wheel or the arrow keys).
   Two full turns cover the band, 87.5–108 MHz. The signal is at
   106.0, from 106.0078°W. Close to it, the static and its hiss fade
   and the fragment comes into focus; on it, the fragment collapses.
   --------------------------------------------------------------- */
const FQ = { min: 87.5, max: 108, target: 106.0, start: 93.1, turns: 2 };

function setupFrecuencia() {
  const box = $("#fq"), dial = $("#fq-dial"), knob = $(".dial-knob"), sp = $("#fq-sp");
  const mhz = $("#fq-mhz"), status = $("#fq-state"), meter = $("#fq-meter"), live = $("#fq-live");
  const soundButton = $("#fq-sound");
  let raw = FQ.start, level = 1, audio = null, sound = true, holdTimer = 0, collapsed = false;
  const noise = makeStatic($(".fq-screen canvas"), () => level);

  const closeness = (f) => Math.max(0, 1 - Math.abs(f - FQ.target) / 1.2);

  function setFreq(f) {
    raw = Math.min(FQ.max, Math.max(FQ.min, f));
    const shown = Math.round(raw * 10) / 10;
    const tuned = Math.abs(shown - FQ.target) < .01;
    const c = closeness(raw);
    const words = tuned ? "señal limpia" : c > .6 ? "casi" : c > 0 ? "interferencia" : "ruido";

    mhz.textContent = shown.toFixed(1);
    status.textContent = words;
    knob.style.setProperty("--angle", ((raw - FQ.min) / (FQ.max - FQ.min) * 360 * FQ.turns).toFixed(1) + "deg");
    dial.setAttribute("aria-valuenow", shown.toFixed(1));
    dial.setAttribute("aria-valuetext", shown.toFixed(1) + " megahertz, " + words);
    const bars = Math.round(c * 12);
    meter.replaceChildren("señal ", el("b", "", "|".repeat(bars)), "·".repeat(12 - bars));
    box.classList.toggle("tuned", tuned);
    sp.style.setProperty("--c", (tuned ? 1 : c * .85).toFixed(3));
    level = tuned ? .05 : 1 - c * .9;
    if (noMotion.matches) noise.draw();
    if (audio) quietOrSet(c, tuned);

    // Hold the signal for half a second and the fragment collapses.
    if (tuned && !collapsed && !holdTimer) {
      holdTimer = setTimeout(() => {
        holdTimer = 0;
        collapsed = true;
        sp.classList.add("collapsed");
        live.textContent = "señal limpia. el fragmento se colapsó. al aire: " + SINGLE.titulo + ".";
        state.sintonizada = true;
        saveState();
        tuneSingle();
      }, 500);
    }
    if (!tuned) {
      clearTimeout(holdTimer);
      holdTimer = 0;
      if (collapsed) { collapsed = false; sp.classList.remove("collapsed"); live.textContent = ""; }
    }
  }

  // On air: the single and its player appear under the fragment. The
  // test chord goes quiet, so it never plays over the song.
  const air = $("#fq-air"), player = $("#fq-player");
  function tuneSingle() {
    if (!MEDIA.frecuencia) audio?.hush();
    if (!player.firstChild) {
      const frame = el("iframe");
      frame.src = SINGLE.spotifyEmbed;
      frame.title = SINGLE.titulo + " en Spotify";
      frame.height = 152;
      frame.loading = "lazy";
      frame.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      player.append(frame);
    }
    air.hidden = false;
  }

  // While the single is on air (tuned and collapsed) the test chord stays quiet.
  function quietOrSet(c, tuned) {
    if (tuned && collapsed && !MEDIA.frecuencia) audio.hush();
    else audio.set(c, tuned);
  }

  // Sound needs a tap or a key first (browsers block autoplay).
  function wakeAudio() {
    if (!sound) return;
    if (!audio) { audio = makeRadio(); if (audio) quietOrSet(closeness(raw), box.classList.contains("tuned")); }
    else audio.resume();
  }

  let grab = null;
  const angleAt = (event) => {
    const r = dial.getBoundingClientRect();
    return Math.atan2(event.clientY - (r.top + r.height / 2), event.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
  };
  dial.addEventListener("pointerdown", (event) => {
    dial.setPointerCapture(event.pointerId);
    grab = angleAt(event);
    dial.classList.add("grabbing");
    wakeAudio();
  });
  dial.addEventListener("pointermove", (event) => {
    if (grab === null) return;
    const angle = angleAt(event);
    let turn = angle - grab;
    if (turn > 180) turn -= 360;
    if (turn < -180) turn += 360;
    grab = angle;
    setFreq(raw + turn * (FQ.max - FQ.min) / (360 * FQ.turns));
  });
  const release = () => {
    if (grab === null) return;
    grab = null;
    dial.classList.remove("grabbing");
    // A gentle lock: let go close to the signal and the dial settles on it.
    if (Math.abs(raw - FQ.target) < .15) setFreq(FQ.target);
  };
  dial.addEventListener("pointerup", release);
  dial.addEventListener("pointercancel", release);
  dial.addEventListener("keydown", (event) => {
    const steps = { ArrowUp: .1, ArrowRight: .1, ArrowDown: -.1, ArrowLeft: -.1, PageUp: 1, PageDown: -1 };
    let next;
    if (event.key in steps) next = Math.round(raw * 10) / 10 + steps[event.key];
    else if (event.key === "Home") next = FQ.min;
    else if (event.key === "End") next = FQ.max;
    else return;
    event.preventDefault();
    wakeAudio();
    setFreq(next);
  });
  dial.addEventListener("wheel", (event) => {
    event.preventDefault();
    setFreq(Math.round(raw * 10) / 10 + (event.deltaY < 0 ? .1 : -.1));
  }, { passive: false });

  soundButton.addEventListener("click", () => {
    sound = !sound;
    soundButton.textContent = "sonido: " + (sound ? "on" : "off");
    soundButton.setAttribute("aria-pressed", String(sound));
    if (sound) wakeAudio();
    else { audio?.close(); audio = null; }
  });

  starts.frecuencia = () => {
    setFreq(raw);
    noise.start();
    if (state.sintonizada) tuneSingle();   // found it before: it stays on air
  };
  stops.frecuencia = () => {
    noise.stop();
    audio?.close();
    audio = null;
    clearTimeout(holdTimer);
    holdTimer = 0;
  };
  setFreq(raw);
}

/* The radio: static (white noise through a band-pass) and the signal,
   crossfaded by how close the dial is. The signal is MEDIA.frecuencia,
   or a slow test chord while there is no audio file. */
function makeRadio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  const ctx = new AudioCtx();
  const out = ctx.createGain();
  out.gain.value = .6;
  out.connect(ctx.destination);

  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  const hiss = ctx.createBufferSource();
  hiss.buffer = buffer;
  hiss.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 1600;
  band.Q.value = .7;
  const hissGain = ctx.createGain();
  hissGain.gain.value = 0;
  hiss.connect(band).connect(hissGain).connect(out);
  hiss.start();

  const signalGain = ctx.createGain();
  signalGain.gain.value = 0;
  signalGain.connect(out);
  let track = null;
  if (MEDIA.frecuencia) {
    track = new Audio(MEDIA.frecuencia);
    track.loop = true;
    ctx.createMediaElementSource(track).connect(signalGain);
    track.play().catch(() => {});
  } else {
    const warm = ctx.createBiquadFilter();
    warm.type = "lowpass";
    warm.frequency.value = 1100;
    warm.connect(signalGain);
    for (const hz of [220, 261.63, 329.63, 440]) {
      for (const detune of [-6, 6]) {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = hz;
        osc.detune.value = detune;
        gain.gain.value = .05;
        osc.connect(gain).connect(warm);
        osc.start();
      }
    }
  }

  return {
    set(c, tuned) {
      const now = ctx.currentTime;
      hissGain.gain.setTargetAtTime(tuned ? .015 : (1 - c) * .22 + .03, now, .06);
      signalGain.gain.setTargetAtTime(tuned ? .9 : c * c * .6, now, .08);
    },
    hush() {
      const now = ctx.currentTime;
      hissGain.gain.setTargetAtTime(0, now, .3);
      signalGain.gain.setTargetAtTime(0, now, .3);
    },
    resume() { ctx.resume(); track?.play().catch(() => {}); },
    close() { track?.pause(); ctx.close(); },
  };
}


/* ---------------------------------------------------------------
   02 CONSOLA
   Four faders. The last one, "overdubs", flips the take between
   "recorded live" and "some overdubs", and the acta remembers it.
   --------------------------------------------------------------- */
function setupConsola() {
  const word = $("#take-word");
  const db = (v) => {
    if (v === 0) return "-∞ db";
    const n = Math.round(20 * Math.log10(v / 75));
    return (n > 0 ? "+" : "") + n + " db";
  };
  const take = (v) => v >= 50 ? "some overdubs" : "recorded live";

  function update(input) {
    const v = Number(input.value);
    input.closest(".ch").querySelector(".ch-db").textContent = db(v);
    if (input.dataset.ch !== "overdubs") { input.setAttribute("aria-valuetext", db(v)); return; }
    input.setAttribute("aria-valuetext", v + ", " + take(v));
    if (word.textContent !== take(v)) word.textContent = take(v);   // the live region only speaks on a change
    word.classList.toggle("od", v >= 50);
    state.overdubs = v;
  }
  for (const input of root.querySelectorAll("[data-ch]")) {
    update(input);
    input.addEventListener("input", () => update(input));
    input.addEventListener("change", saveState);
  }
}


/* ---------------------------------------------------------------
   03 CANAL MC²
   An old TV. Picking a transmission "searches" for a moment; with a
   video it plays, without one it stays "sin señal". YouTube videos use
   the privacy-enhanced player (youtube-nocookie.com), created only when
   picked and removed when you leave, so nothing keeps playing.
   --------------------------------------------------------------- */
function setupCanal() {
  const screen = $("#tv-screen"), message = $("#tv-msg"), video = screen.querySelector("video");
  const noise = makeStatic(screen.querySelector("canvas"), () => .85);
  let timer = 0;

  function clearYoutube() { screen.querySelector("iframe")?.remove(); }
  function youtube(tx) {
    const params = new URLSearchParams({ autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1 });
    if (tx.inicio) params.set("start", tx.inicio);
    if (tx.fin) params.set("end", tx.fin);
    const frame = el("iframe");
    frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(tx.youtube) + "?" + params;
    frame.title = tx.titulo + " · canal mc²";
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    screen.append(frame);
  }

  function say(title, line, searching) {
    message.hidden = false;
    message.classList.toggle("searching", searching);
    message.replaceChildren(el("strong", "", title), el("span", "", line));
  }

  for (const button of root.querySelectorAll("[data-tx]")) {
    button.addEventListener("click", () => {
      const tx = MEDIA.canal[button.dataset.tx];
      for (const other of root.querySelectorAll("[data-tx]")) other.setAttribute("aria-current", String(other === button));
      clearTimeout(timer);
      video.pause();
      video.hidden = true;
      clearYoutube();
      say("sintonizando", tx.id + "…", true);
      timer = setTimeout(() => {
        if (tx.youtube) {
          youtube(tx);
          message.hidden = true;
        } else if (tx.video) {
          video.src = tx.video;
          video.hidden = false;
          message.hidden = true;
          video.play().catch(() => {});
        } else {
          say("sin señal", tx.id + " · VIDEO placeholder", false);
        }
      }, noMotion.matches ? 300 : 900);
    });
  }

  starts.canal = () => noise.start();
  stops.canal = () => {
    noise.stop();
    clearTimeout(timer);
    video.pause();
    clearYoutube();
    say("sin señal", "canal mc² · en espera", false);
    for (const button of root.querySelectorAll("[data-tx]")) button.removeAttribute("aria-current");
  };
}


/* ---------------------------------------------------------------
   04 ARCHIVO
   The three pieces as archive cards, read from the store's own
   product list (window.MC2), so there is only one copy of the facts.
   "Ver en la tienda" turns the light on and opens the piece.
   --------------------------------------------------------------- */
starts.archivo = () => {
  const store = window.MC2;
  const inList = new Set(store.cart().map((line) => line.sku));
  $("#fichas").replaceChildren(...["MC2-TEE-01", "MC2-CAP-01", "MC2-TOT-01"].map((sku) => {
    const product = store.findProduct(sku);
    const spec = (label) => ((product.specs.find(([name]) => name === label) || [])[1] || "—").toLowerCase();
    const card = el("article", "ficha");

    const top = el("p", "ficha-top");
    top.append(el("span", "", "archive id"), el("b", "", sku));
    const photo = el("figure", "ficha-photo");
    const img = el("img");
    img.src = product.photo.src;
    img.alt = product.photo.alt;
    img.loading = "lazy";
    img.onerror = () => img.remove();
    photo.append(img);

    const facts = el("dl");
    for (const [name, value] of [
      ["pieza", product.name.toLowerCase()],
      ["acabado", spec("Acabado")],
      ["lavado", spec("Lavado")],
      ["lote de lavado", LOTE],
      ["estado", "archive locked"],
    ]) facts.append(el("dt", "", name), el("dd", "", value));

    const link = el("button", "cab-btn", "ver en la tienda ↗");
    link.type = "button";
    link.addEventListener("click", () => leaveTo(() => store.openProduct(product)));

    card.append(top, el("span", "stamp", "archive locked"), photo, facts);
    if (inList.has(sku)) card.append(el("p", "in-list", "en mi lista"));
    card.append(link);
    return card;
  }));
};


/* ---------------------------------------------------------------
   05 LLAVE
   The code of a piece opens its hidden content. Opened keys are
   remembered, so the vault stays open the next time.
   --------------------------------------------------------------- */
function setupLlave() {
  const form = $("#key-form"), input = $("#key-input"), message = $("#key-msg"), vault = $("#vault");
  const keyName = (text) => text.toUpperCase().replace(/[^A-Z0-9]/g, "");

  function showVault(key) {
    $("#vault-id").textContent = key.id;
    $("#vault-title").textContent = key.titulo;
    $("#vault-text").textContent = key.texto;
    const card = $("#vault-ph");
    card.textContent = "FOTO o VIDEO: contenido oculto de " + key.id;
    usePhoto(card, key.photo);
    vault.hidden = false;
  }
  function listKeys() {
    $("#key-list").textContent = state.llaves.length ? "llaves abiertas: " + state.llaves.join(", ") : "";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const key = LLAVES[keyName(input.value)];
    form.classList.remove("bad");
    if (!key) {
      void form.offsetWidth;   // restart the shake
      form.classList.add("bad");
      message.className = "key-msg bad";
      message.textContent = input.value.trim() ? "señal no reconocida" : "inserta una llave";
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    input.setAttribute("aria-invalid", "false");
    message.className = "key-msg ok";
    message.textContent = "llave aceptada · " + key.id;
    if (!state.llaves.includes(key.id)) state.llaves.push(key.id);
    saveState();
    listKeys();
    showVault(key);
    vault.focus({ preventScroll: true });
    vault.scrollIntoView({ behavior: noMotion.matches ? "auto" : "smooth", block: "nearest" });
  });

  starts.llave = () => {
    listKeys();
    const opened = Object.values(LLAVES).filter((key) => state.llaves.includes(key.id)).pop();
    if (opened) showVault(opened);
  };
}


/* ---------------------------------------------------------------
   07 ACTA
   The fan's name, the take, the coordinates and today's date, drawn
   on a <canvas> in the store's colors and typefaces, then saved as a
   PNG. Nothing leaves the phone.
   --------------------------------------------------------------- */
function setupActa() {
  const form = $("#acta-form"), input = $("#acta-name"), error = $("#acta-error");
  const canvas = $("#acta-canvas"), shareButton = $("#acta-share");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height, M = 90;
  let frame = 0;

  const fonts = document.fonts
    ? Promise.all(["800 100px Archivo", "400 20px 'Space Mono'", "700 20px 'Space Mono'"].map((f) => document.fonts.load(f))).catch(() => {})
    : Promise.resolve();

  // Texture tiles, made once: a few big blotches (the wash) and fine grain.
  const random = seeded(7);
  const wash = document.createElement("canvas");
  wash.width = 18; wash.height = 22;
  const grain = document.createElement("canvas");
  grain.width = grain.height = 128;
  const cracks = Array.from({ length: 900 }, () => [random(), random(), 1 + random() * 3.5, random()]);

  function paintTiles() {
    const w = wash.getContext("2d"), g = grain.getContext("2d");
    for (let x = 0; x < wash.width; x++) for (let y = 0; y < wash.height; y++) {
      w.globalAlpha = random() * .9;
      w.fillStyle = token("--mottle");
      w.fillRect(x, y, 1, 1);
    }
    const image = g.createImageData(128, 128);
    for (let i = 0; i < image.data.length; i += 4) {
      image.data[i] = 242; image.data[i + 1] = 238; image.data[i + 2] = 230;   // --ivory
      image.data[i + 3] = random() < .5 ? random() * 22 : 0;
    }
    g.putImageData(image, 0, 0);
  }

  const take = () => (new FormData(form).get("toma") === "od" ? "some overdubs" : "recorded live");
  const today = () => {
    const d = new Date();
    return [d.getDate(), d.getMonth() + 1].map((n) => String(n).padStart(2, "0")).join(".") + "." + d.getFullYear();
  };
  const folio = (name) => {
    let h = 7;
    for (const ch of name + today()) h = (h * 31 + ch.codePointAt(0)) % 10000;
    return "MC2-ACT-" + String(h).padStart(4, "0");
  };

  function write(text, x, y, font, color, spacing = 0, align = "left") {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    if ("letterSpacing" in ctx) ctx.letterSpacing = spacing + "px";
    ctx.fillText(text, x, y);
  }
  function rule(y) {
    ctx.globalAlpha = .16;
    ctx.fillStyle = token("--ivory");
    ctx.fillRect(M, y, W - M * 2, 2);
    ctx.globalAlpha = 1;
  }

  function draw() {
    const ink = { black: token("--washed-black"), ivory: token("--ivory"), green: token("--chem-green"), sepia: token("--sepia"), muted: token("--muted") };
    const name = input.value.trim().toUpperCase();
    const mono = (size, weight = 400) => `${weight} ${size}px 'Space Mono', monospace`;

    ctx.fillStyle = ink.black;
    ctx.fillRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(wash, 0, 0, W, H);

    write("ACTA DE SESIÓN", M, 130, mono(26), ink.sepia, 6);
    write(folio(name), W - M, 130, mono(26), ink.sepia, 4, "right");
    rule(162);

    // The lockup, with its small high ², then cracked like the print.
    write("MC", M - 12, 520, "800 330px Archivo, sans-serif", ink.ivory, -10);
    ctx.letterSpacing = "0px";
    ctx.font = "800 330px Archivo, sans-serif";
    const mcWidth = ctx.measureText("MC").width - 20;
    write("2", M - 12 + mcWidth + 10, 402, "800 132px Archivo, sans-serif", ink.ivory);
    ctx.fillStyle = ink.black;
    for (const [x, y, size, alpha] of cracks) {
      ctx.globalAlpha = .55 + alpha * .45;
      ctx.fillRect(M - 12 + x * (mcWidth + 90), 270 + y * 260, size, size * .6);
    }
    ctx.globalAlpha = 1;

    write("MÚSICA CUÁNTICA", M, 608, mono(36), ink.ivory, 8);
    write(COORDS, M, 664, mono(36), ink.green, 2);
    rule(716);

    // The fan's name: as big as it fits.
    write("PRESENTE EN LA SESIÓN", M, 790, mono(22), ink.sepia, 6);
    let size = 70;
    ctx.font = `800 ${size}px Archivo, sans-serif`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "-1px";
    while (size > 34 && ctx.measureText(name).width > W - M * 2) ctx.font = `800 ${--size}px Archivo, sans-serif`;
    write(name || "— — —", M, 862, ctx.font, name ? ink.ivory : ink.muted, -1);

    write("SESIÓN", M, 940, mono(22), ink.sepia, 6);
    write("01 · SONIC RANCH · TORNILLO, TX", M, 990, mono(32, 700), ink.ivory, 2);

    write("TOMA", M, 1070, mono(22), ink.sepia, 6);
    write(take().toUpperCase(), M, 1120, mono(32, 700), ink.green, 2);
    write("FECHA", W / 2 + 60, 1070, mono(22), ink.sepia, 6);
    write(today(), W / 2 + 60, 1120, mono(32, 700), ink.ivory, 2);
    rule(1176);

    write("ARCHIVE LOCKED", M, 1250, mono(28, 700), ink.ivory, 6);
    ctx.strokeStyle = ink.ivory;
    ctx.lineWidth = 3;
    for (const cx of [W - M - 92, W - M - 44]) {
      ctx.beginPath();
      ctx.arc(cx, 1240, 30, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = ctx.createPattern(grain, "repeat");
    ctx.fillRect(0, 0, W, H);
  }

  // Redraw at most once a frame while typing.
  const redraw = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; draw(); }); };
  form.addEventListener("input", () => { error.textContent = ""; input.setAttribute("aria-invalid", "false"); redraw(); });

  function png() {
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }
  function fileName() {
    const slug = input.value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return "acta-mc2-" + (slug || "fan") + ".png";
  }
  function check() {
    if (input.value.trim()) return true;
    error.textContent = "Escribe tu nombre para firmar el acta.";
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return false;
  }
  function signed() {
    state.acta = true;
    saveState();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!check()) return;
    await fonts;
    draw();
    const blob = await png();
    const url = URL.createObjectURL(blob);
    const link = el("a");
    link.href = url;
    link.download = fileName();
    root.append(link);   // inside the cabin: the store is inert
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    signed();
  });

  // Phones that can share files get a "compartir" button too.
  const probe = typeof File === "function" ? [new File([""], "acta.png", { type: "image/png" })] : null;
  if (probe && navigator.canShare && navigator.canShare({ files: probe })) {
    shareButton.hidden = false;
    shareButton.addEventListener("click", async () => {
      if (!check()) return;
      await fonts;
      draw();
      const file = new File([await png()], fileName(), { type: "image/png" });
      try { await navigator.share({ files: [file], title: "Acta MC²" }); signed(); } catch { /* cancelled */ }
    });
  }

  let painted = false;
  starts.acta = () => {
    // The take comes from the overdubs fader in the console.
    form.elements.toma.value = state.overdubs >= 50 ? "od" : "live";
    if (!painted) { paintTiles(); painted = true; }
    fonts.then(draw);
  };
}
