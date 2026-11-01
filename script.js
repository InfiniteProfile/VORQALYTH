(() => {
  "use strict";

  const BATCH_SIZE = 300;
  const PRELOAD_AT = 100;
  const WINDOW_SIZE = 34;
  const OVERSCAN = 8;
  const CARD_HEIGHT = 174;
  const GAP = 13;
  const ROW_HEIGHT = CARD_HEIGHT + GAP;

  const grid = document.getElementById("profileGrid");
  const countNode = document.getElementById("createdCount");
  const loadingNode = document.getElementById("loadingStatus");
  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");
  const searchStatus = document.getElementById("searchStatus");
  const detailLayer = document.getElementById("detailLayer");

  const namesA = ["Aev", "Vael", "Nyri", "Oryn", "Zhae", "Ily", "Qori", "Thalen", "Mira", "Keth", "Soryn", "Elya", "Vey", "Orra", "Cael", "Nym"];
  const namesB = ["rith", "vane", "ora", "yss", "eth", "quinn", "aris", "ovar", "eon", "yra", "ith", "ael", "une", "oth", "iv", "essa"];
  const classes = ["Luminous Cartographer", "Voidborn Archivist", "Prism Warden", "Echo Weaver", "Astral Nomad", "Gravity Artisan", "Dream Forger", "Rift Listener", "Chronicle Keeper", "Nebula Kin", "Aether Sentinel", "Resonance Seer"];
  const origins = ["The Glass Expanse", "Nacreon Reach", "The Quiet Meridian", "Vespera Fold", "The Unwritten Belt", "Ilyth Deep", "The Halcyon Rift", "Orbits of Serein", "The Pale Constellary", "Morrowlight Basin"];
  const personalities = ["patient and observant", "bold but quietly thoughtful", "curious, warm, and inventive", "reserved with a fierce sense of duty", "playful, perceptive, and adaptable", "calm under impossible pressure", "independent and deeply empathetic", "methodical with a restless imagination"];
  const abilities = ["weaves light into navigable paths", "hears memories held by distant matter", "folds small distances through harmonic patterns", "translates the motion of celestial bodies", "shapes protective fields from ambient energy", "stores moments as visible constellations", "senses fractures between neighboring realms", "restores fading signals across the dark"];
  const traits = ["opal markings, mirrored eyes", "floating crest and luminous freckles", "layered crystalline mantle", "soft bioluminescent patterns", "four delicate orbiting shards", "silken antennae and star-like pupils", "translucent ridges along the arms", "shifting geometric skin patterns"];
  const descriptors = ["maps forgotten passages between quiet worlds", "collects fragments of stories from abandoned horizons", "guards a sanctuary built around a sleeping star", "studies the language of drifting light", "guides lost signals toward their intended homes", "creates small wonders from the dust of old realms", "keeps watch where the fabric of space grows thin", "searches for the source of an ancient celestial melody"];

  let generated = 0n;
  let nextId = 1n;
  let preparedThrough = 0n;
  let visibleStart = 0;
  let rendered = [];
  let renderQueued = false;
  let batchBusy = false;
  let searchMode = false;
  let activeProfile = null;
  let scrollRebase = 0;

  const mod = (n, m) => Number(n % BigInt(m));
  function hashId(id) {
    let h = 2166136261 >>> 0;
    for (const ch of id) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function makeProfile(idValue) {
    const id = String(idValue);
    const h = hashId(id);
    const pick = (arr, shift = 0) => arr[((h >>> (shift % 24)) + shift * 13) % arr.length];
    const name = namesA[h % namesA.length] + pick(namesB, 3);
    const classification = pick(classes, 5);
    const origin = pick(origins, 7);
    const personality = pick(personalities, 11);
    const ability = pick(abilities, 13);
    const trait = pick(traits, 17);
    const descriptor = pick(descriptors, 19);
    return {
      id, name, classification, origin, personality, ability, trait, descriptor,
      bio: `${name} is a ${classification.toLowerCase()} from ${origin}. Known for being ${personality}, this identity ${descriptor}. Their signature gift ${ability}.`,
      hue: h % 360, hue2: (h * 7 + 105) % 360, shape: h % 5
    };
  }

  function artwork(p, large = false) {
    const s = p.shape, hue = p.hue, hue2 = p.hue2;
    const cx = 120 + (s * 9), cy = 105 + ((s % 3) * 8);
    const body = [
      `<path d="M${cx-45} 205 Q${cx-53} 146 ${cx-25} 126 Q${cx} 108 ${cx+25} 126 Q${cx+53} 146 ${cx+45} 205Z" fill="url(#g)" opacity=".92"/>`,
      `<path d="M${cx-52} 185 Q${cx-91} 135 ${cx-64} 91 Q${cx-42} 118 ${cx-27} 131 M${cx+52} 185 Q${cx+91} 135 ${cx+64} 91 Q${cx+42} 118 ${cx+27} 131" fill="none" stroke="hsl(${hue2} 85% 75%)" stroke-width="7" stroke-linecap="round" opacity=".65"/>`,
      `<path d="M${cx-37} 155 L${cx-63} 193 L${cx-28} 183 M${cx+37} 155 L${cx+63} 193 L${cx+28} 183" fill="none" stroke="hsl(${hue} 80% 75%)" stroke-width="5" opacity=".8"/>`,
      `<path d="M${cx-29} 100 Q${cx-38} 49 ${cx} 45 Q${cx+38} 49 ${cx+29} 100 Q${cx} 128 ${cx-29} 100Z" fill="url(#g)" stroke="hsl(${hue2} 90% 80%)" stroke-width="1.5"/>`
    ][s % 4];
    const eyes = `<ellipse cx="${cx-12}" cy="${cy-1}" rx="4" ry="6" fill="#d8ffff"/><ellipse cx="${cx+12}" cy="${cy-1}" rx="4" ry="6" fill="#d8ffff"/>`;
    const stars = Array.from({length:13},(_,i)=>{const x=(i*47+hue)%240,y=(i*31+hue2)%220,r=(i%3)+.7;return `<circle cx="${x}" cy="${y}" r="${r}" fill="#d7faff" opacity="${.25+(i%4)*.13}"/>`;}).join("");
    return `<svg viewBox="0 0 240 220" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Original abstract portrait of ${p.name}">
      <defs><radialGradient id="bg${p.id}"><stop stop-color="hsl(${hue2} 55% 29%)"/><stop offset="1" stop-color="#0c0b1b"/></radialGradient><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl(${hue} 78% 69%)"/><stop offset="1" stop-color="hsl(${hue2} 75% 43%)"/></linearGradient></defs>
      <rect width="240" height="220" fill="url(#bg${p.id})"/>${stars}
      <circle cx="${cx}" cy="${cy}" r="69" fill="none" stroke="hsl(${hue2} 80% 75%)" opacity=".22" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="84" fill="none" stroke="hsl(${hue} 80% 75%)" opacity=".15" stroke-dasharray="3 8"/>
      ${body}${eyes}<path d="M${cx-8} 112 Q${cx} 117 ${cx+8} 112" fill="none" stroke="#f2ffff" stroke-width="1.5" opacity=".7"/>
      <path d="M0 199 Q70 179 120 204 T240 195 V220 H0Z" fill="#080817" opacity=".55"/>
    </svg>`;
  }

  function cardMarkup(p) {
    return `<article class="profile-card" data-id="${p.id}">
      <div class="artwork">${artwork(p)}</div>
      <div class="profile-info">
        <div class="profile-meta"><span>IDENTITY FILE</span><span class="profile-id">#${p.id}</span></div>
        <h3 class="profile-name">${p.name}</h3>
        <div class="profile-class">${p.classification}</div>
        <p class="profile-description">${p.descriptor}.</p>
        <div class="card-bottom"><span class="origin-label">${p.origin}</span><button class="view-button" type="button" data-open="${p.id}">View profile ↗</button></div>
      </div>
    </article>`;
  }

  function prepareBatch() {
    if (batchBusy || preparedThrough >= generated) return;
    batchBusy = true;
    loadingNode.hidden = false;
    // The data is deterministic; preparing a batch advances the permanent ID sequence.
    const target = generated + BigInt(BATCH_SIZE);
    preparedThrough = target;
    generated = target;
    countNode.textContent = generated.toString();
    batchBusy = false;
    loadingNode.hidden = true;
    queueRender();
  }

  function initialize() {
    generated = BigInt(BATCH_SIZE);
    preparedThrough = generated;
    nextId = 1n;
    countNode.textContent = generated.toString();
    queueRender();
  }

  function queueRender() {
    if (renderQueued || searchMode) return;
    renderQueued = true;
    requestAnimationFrame(() => { renderQueued = false; renderWindow(); });
  }

  function renderWindow() {
    if (searchMode) return;
    const scrollY = window.scrollY;
    const localY = Math.max(0, scrollY - document.querySelector("main").offsetTop);
    let first = Math.max(0, Math.floor(localY / ROW_HEIGHT) - OVERSCAN);
    const localTotalBig = generated - BigInt(scrollRebase);
    const total = Number(localTotalBig > 1000000000000000000n ? 1000000000000000000n : localTotalBig);
    first = Math.min(first, Math.max(0, total - 1));
    visibleStart = first;
    const end = Math.min(total, first + WINDOW_SIZE);
    const pieces = [];
    if (first > 0) pieces.push(`<div class="virtual-spacer" style="height:${first * ROW_HEIGHT}px"></div>`);
    for (let i = first; i < end; i++) {
      const p = makeProfile(BigInt(scrollRebase + i + 1));
      pieces.push(cardMarkup(p));
    }
    const remaining = Math.max(0, total - end);
    if (remaining) pieces.push(`<div class="virtual-spacer" style="height:${remaining * ROW_HEIGHT}px"></div>`);
    grid.innerHTML = pieces.join("");
    if (BigInt(scrollRebase + end + PRELOAD_AT) >= preparedThrough) prepareBatch();
  }

  function onScroll() {
    queueRender();
    const main = document.querySelector("main");
    const relative = Math.max(0, window.scrollY - main.offsetTop);
    const approximateIndex = Math.floor(relative / ROW_HEIGHT);
    if (!searchMode && BigInt(scrollRebase + approximateIndex + PRELOAD_AT) >= preparedThrough) prepareBatch();

    // Rebase before browser scroll-height limits become relevant. The visible content
    // is re-created at the same visual position; no programmatic scroll-to-bottom occurs.
    if (window.scrollY > 650000 && !searchMode) {
      const shiftRows = Math.floor(300000 / ROW_HEIGHT);
      const shiftPx = shiftRows * ROW_HEIGHT;
      scrollRebase += shiftRows;
      window.scrollTo({top: window.scrollY - shiftPx, behavior: "instant"});
      // Keep the logical sequence advancing after a long session.
      queueRender();
    }
  }

  function openProfile(id) {
    const p = makeProfile(id);
    activeProfile = p;
    document.getElementById("detailArtwork").innerHTML = artwork(p, true);
    document.getElementById("detailId").textContent = "#" + p.id;
    document.getElementById("detailName").textContent = p.name;
    document.getElementById("detailClassification").textContent = p.classification;
    document.getElementById("detailBio").textContent = p.bio;
    document.getElementById("detailOrigin").textContent = p.origin;
    document.getElementById("detailPersonality").textContent = p.personality;
    document.getElementById("detailAbilities").textContent = p.ability;
    document.getElementById("detailTraits").textContent = p.trait;
    detailLayer.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("closeDetail").focus();
  }
  function closeProfile() {
    detailLayer.hidden = true;
    document.body.style.overflow = "";
    activeProfile = null;
  }

  function runSearch() {
    const q = searchInput.value.trim();
    clearSearch.hidden = !q;
    if (!q) { exitSearch(); return; }
    searchMode = true;
    const exactId = /^[0-9]+$/.test(q) ? q.replace(/^0+(?=\d)/, "") : null;
    let matches = [];
    if (exactId) {
      const p = makeProfile(exactId);
      matches = [p];
      searchStatus.textContent = `Exact ID match · #${p.id}`;
    } else {
      const needle = q.toLowerCase();
      const scanCount = Number(generated > 6000n ? 6000n : generated);
      for (let i = 1; i <= scanCount; i++) {
        const p = makeProfile(BigInt(i));
        const haystack = `${p.name} ${p.classification} ${p.personality} ${p.origin} ${p.trait} ${p.descriptor}`.toLowerCase();
        if (haystack.includes(needle)) matches.push(p);
        if (matches.length >= 60) break;
      }
      searchStatus.textContent = matches.length ? `${matches.length} matching identities found in the prepared archive.` : "No match in the currently prepared archive. Try an exact numerical ID.";
    }
    searchStatus.hidden = false;
    grid.innerHTML = matches.length ? matches.map(cardMarkup).join("") : `<div class="search-status">No matching identity found.</div>`;
    loadingNode.hidden = true;
  }

  function exitSearch() {
    searchMode = false;
    searchStatus.hidden = true;
    searchStatus.textContent = "";
    queueRender();
  }

  grid.addEventListener("click", e => {
    const button = e.target.closest("[data-open]");
    if (button) openProfile(button.dataset.open);
  });
  document.getElementById("closeDetail").addEventListener("click", closeProfile);
  detailLayer.addEventListener("click", e => { if (e.target.dataset.close) closeProfile(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !detailLayer.hidden) closeProfile(); });
  searchInput.addEventListener("keydown", e => { if (e.key === "Enter") runSearch(); });
  searchInput.addEventListener("input", () => { clearSearch.hidden = !searchInput.value; if (!searchInput.value.trim()) exitSearch(); });
  document.getElementById("searchButton").addEventListener("click", () => searchInput.focus());
  clearSearch.addEventListener("click", () => { searchInput.value = ""; clearSearch.hidden = true; exitSearch(); searchInput.focus(); });
  window.addEventListener("scroll", onScroll, {passive:true});
  window.addEventListener("resize", queueRender, {passive:true});

  initialize();
})();