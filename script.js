(() => {
'use strict';
/* ========== VORQALYTH: deterministic generator (pure, testable) ========== */
const L = s => s.split(',');
const cap = s => s[0].toUpperCase() + s.slice(1);
const G1 = L('vor,qal,zy,thi,ny,xe,ora,kel,mir,sa,lu,dra,ve,ish,tor,ela,zan,pho,ri,cae,um,yl,nex,oth');
const G2 = L('a,e,o,i,ae,ia,u,ei');
const G3 = L('th,ra,n,x,s,el,is,on,yth,lyn');
const SPECIES = L('Lumenborn,Voidweaver,Starshard,Nebulyn,Chronofae,Gravithorn,Aetherkin,Prismoid,Umbral Drifter,Crystalline Sage,Tidecaller,Dreamwarden,Quasarling,Mossback Colossus,Echo Wraith,Sporeling,Cometbound,Glyphscribe,Mirrorkin,Stormsinger');
const RANK = L('Wanderer,Sentinel,Archivist,Cartographer,Oracle,Artisan,Warden,Herald,Scholar,Outcast,Navigator,Alchemist');
const TR = L('curious,stoic,playful,melancholic,fearless,meticulous,dreamy,sardonic,gentle,restless,devoted,cunning,serene,stubborn,whimsical,vigilant,compassionate,reckless,patient,enigmatic,proud,humble,mischievous,analytical');
const REALM = L('the Glasswind Reaches,the Hollow Meridian,the Cyanreach Archipelago,the Violet Drift,Lanternfall Deep,the Sunken Aurora,Mirrorhold Spire,the Whispering Rift,Starloom Basin,the Obsidian Cradle,the Tidal Canopy,Vesper Nine Station,the Paleglass Expanse');
const BIRTH = L('during a silent eclipse of three suns,where two rivers of starlight collide,as the echo of a forgotten song,from a seed of fallen comet-glass,in the quiet hours between cycles,inside a storm that never touched the ground,beneath a sky that had not yet learned its colors,in the wake of a dying lighthouse-star');
const KNOWN = L('mapping other people\'s dreams,tending living constellations,bargaining with gravity,forging silence into blades of light,translating the language of tides,repairing broken horizons,sailing the spaces between thoughts,teaching storms to whisper');
const QUEST = L('Their quest is to find the missing note of the first sound,They are sworn to repair a fracture running through the sky,They travel to learn why the stars hum at night,They carry a lantern toward the edge of the universe,They are searching for the door that every realm shares,They hope to wake a sleeping moon before the next eclipse');
const TWIST = L('Rumor says a fragment of their home still sleeps behind their eyes.,Few know that they once traded a name for a single secret.,Every ally they make receives a small light that never goes out.,Their footprints glow for exactly one night before fading.,They have never been seen in the same place twice at the same hour.,Old maps mark their path as a constellation that has not yet been named.');
const SKIN = L('glass-smooth skin that glows faintly from within,feathers of woven static,a body of drifting nebula-dust,obsidian plating veined with light,soft fur that shimmers like frost,scales like polished moonstone,translucent limbs filled with slow-moving stars');
const EYES = L('three cyan eyes,a single violet iris ringed in light,eyes like twin eclipses,two pale lantern-eyes,a crown of tiny watching eyes,mirror-bright eyes without pupils');
const FEAT = L('a halo of slow-orbiting shards,antlers of living crystal,a tail trailing stardust,wings of folded glass,ribbons of light instead of hair,a floating ring that hums when they speak');
const AP = L('Echo,Lumen,Void,Prism,Gravity,Dream,Chrono,Aether,Mirror,Tide,Quasar,Glyph');
const AN = L('Bloom,Step,Lance,Veil,Chorus,Anchor,Weave,Surge,Lantern,Pulse,Gate,Bind');
const AE = L('bends,calms,amplifies,unravels,freezes,mirrors,softens,redirects');
const AT = L('nearby gravity,hostile thoughts,starlight,a single heartbeat of time,the shape of shadows,distant memories,the sound of falling rain');
const AC = L('for as long as they hold their breath,once per eclipse,while singing,at the cost of a memory,whenever the moon-glass hums,only under open sky');
const QUIRK = L('collects the last words of dying stars,hums in frequencies only moths can hear,never forgets a debt or a kindness,speaks to doorways before walking through,keeps a ledger of every sunrise missed,laughs a half-second before the joke arrives');
const AFF = L('Starlight,Void,Tide,Resonance,Gravity,Dreams,Time,Glass');
const ALLEG = L('The Lantern Court,The Unbound Drifters,Order of the Hollow Meridian,The Quiet Choir,Cartographers of Dusk,A solitary path');
const MOTTO = L('Light is a promise.,Every silence has a shape.,Walk where maps end.,Be the echo that answers.,Small stars still burn.,Nothing is lost, only far away.'.replace('lost, only','lost; only'));

function seedFrom(s) {
  let a = 1779033703, b = 3144134277, c = 1013904242, d = 2773480762;
  for (let i = 0; i < s.length; i++) {
    const k = s.charCodeAt(i);
    a = b ^ Math.imul(a ^ k, 597399067); b = c ^ Math.imul(b ^ k, 2869860233);
    c = d ^ Math.imul(c ^ k, 951274213); d = a ^ Math.imul(d ^ k, 2716044179);
  }
  a = Math.imul(c ^ (a >>> 18), 597399067); b = Math.imul(d ^ (b >>> 22), 2869860233);
  c = Math.imul(a ^ (c >>> 17), 951274213); d = Math.imul(b ^ (d >>> 19), 2716044179);
  return [(a ^ b ^ c ^ d) >>> 0, (b ^ a) >>> 0, (c ^ a) >>> 0, (d ^ a) >>> 0];
}
function rng(str) {
  let [a, b, c, d] = seedFrom(str);
  const f = () => { let t = (a + b) | 0; a = b ^ (b >>> 9); b = (c + (c << 3)) | 0; c = (c << 21) | (c >>> 11); d = (d + 1) | 0; t = (t + d) | 0; c = (c + t) | 0; return (t >>> 0) / 4294967296; };
  for (let i = 0; i < 8; i++) f();
  return f;
}

/* Bijective base-128 syllable code: every positive ID <-> exactly one word. Makes full names unique and invertible. */
const CONS = 'bdfgklmnprstvwzy'.split(''), VOW = ['a', 'e', 'i', 'o', 'u', 'ae', 'ia', 'ou'];
const SYL = []; for (const c of CONS) for (const v of VOW) SYL.push(c + v);
const SIDX = new Map(SYL.map((s, i) => [s, i]));
const WORD_RE = /^(?:[bdfgklmnprstvwzy](?:ae|ia|ou|[aeiou]))+$/;
function codeWord(id) {
  let n = id, o = '';
  while (n > 0n) { const d = Number((n - 1n) % 128n); n = (n - 1n - BigInt(d)) / 128n; o += SYL[d]; }
  return cap(o);
}
function decodeWord(w) {
  w = w.toLowerCase();
  if (!WORD_RE.test(w)) return null;
  let n = 0n, p = 1n;
  for (const s of w.match(/[bdfgklmnprstvwzy](?:ae|ia|ou|[aeiou])/g)) { n += BigInt(SIDX.get(s) + 1) * p; p *= 128n; }
  return n;
}

function gen(id) {
  const s = id.toString(), r = rng(s), pick = a => a[(r() * a.length) | 0];
  const given = cap(pick(G1) + pick(G2) + (r() < .5 ? pick(G3) : ''));
  const name = given + ' ' + codeWord(id);
  const species = pick(SPECIES), rank = pick(RANK), realm = pick(REALM), birth = pick(BIRTH), known = pick(KNOWN);
  const ti = []; while (ti.length < 3) { const i = (r() * TR.length) | 0; if (!ti.includes(i)) ti.push(i); }
  const tr = ti.map(i => TR[i]);
  const ab = [], used = new Set();
  while (ab.length < 3) {
    const n = pick(AP) + ' ' + pick(AN); if (used.has(n)) continue; used.add(n);
    ab.push([n, `${cap(pick(AE))} ${pick(AT)} ${pick(AC)}.`]);
  }
  const h = 170 + ((r() * 150) | 0), h2 = Math.min(340, h + 30 + ((r() * 50) | 0));
  const look = `${cap(pick(SKIN))}, ${pick(EYES)} and ${pick(FEAT)}.`;
  const p = {
    id: s, name, given, species, rank, realm, tr, known, ab, look,
    origin: `Born in ${realm}, ${birth}.`,
    bio: `${given} was born in ${realm}, ${birth}. A ${tr[0]}, ${tr[1]} ${species.toLowerCase()} by nature, they became known for ${known}. ${pick(QUEST)}. ${pick(TWIST)}`,
    pers: `${cap(tr[0])} by nature and ${tr[1]} when pressed, ${given} ${pick(QUIRK)}. Beneath it all they remain ${tr[2]}.`,
    short: `A ${tr[0]} ${species.toLowerCase()} known for ${known}.`,
    extra: [['Age', (1 + ((r() * 9000) | 0)) + ' cycles'], ['Height', (0.4 + r() * 9).toFixed(1) + ' m'], ['Affinity', pick(AFF)], ['Allegiance', pick(ALLEG)], ['Signature hue', h + '°']],
    motto: pick(MOTTO),
    v: { h, h2, form: (r() * 6) | 0, eyes: 1 + ((r() * 3) | 0), rings: (r() * 3) | 0 }
  };
  p.hay = [name, species, rank, realm, known, look, p.pers, tr.join(' '), ab.map(a => a[0]).join(' ')].join(' ').toLowerCase();
  return p;
}

function art(p, pre) {
  const r = rng(p.id + '~'), { h, h2, form, eyes, rings } = p.v, g = pre + p.id;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${p.name}"><defs><radialGradient id="b${g}" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="hsl(${h} 70% 22%)"/><stop offset="1" stop-color="#05030d"/></radialGradient><radialGradient id="c${g}" cx="35%" cy="30%"><stop offset="0" stop-color="hsl(${h} 95% 75%)"/><stop offset="1" stop-color="hsl(${h2} 80% 38%)"/></radialGradient></defs><rect width="200" height="200" fill="url(#b${g})"/>`;
  for (let i = 0; i < 16; i++) s += `<circle cx="${(r() * 200) | 0}" cy="${(r() * 200) | 0}" r="${(r() * 1.4 + .3).toFixed(1)}" fill="#cfefff" opacity="${(r() * .6 + .2).toFixed(2)}"/>`;
  s += `<circle cx="100" cy="100" r="64" fill="hsl(${h} 90% 60%)" opacity=".12"/>`;
  for (let i = 0; i < rings; i++) s += `<ellipse cx="100" cy="102" rx="${62 + i * 14}" ry="${18 + i * 5}" fill="none" stroke="hsl(${h2} 90% 70%)" stroke-opacity=".5" transform="rotate(${(r() * 60 - 30) | 0} 100 102)"/>`;
  const f = `fill="url(#c${g})"`;
  if (form === 0) s += `<circle cx="100" cy="100" r="42" ${f}/>`;
  else if (form === 1) s += `<polygon points="100,50 146,100 100,152 54,100" ${f}/>`;
  else if (form === 2) s += `<polygon points="100,54 140,77 140,123 100,146 60,123 60,77" ${f}/>`;
  else if (form === 3) s += `<path d="M120 58a46 46 0 1 0 0 84a36 36 0 1 1 0-84z" ${f}/>`;
  else if (form === 4) { let pts = ''; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, q = i % 2 ? 26 : 52; pts += (100 + q * Math.cos(a)).toFixed(1) + ',' + (100 + q * Math.sin(a)).toFixed(1) + ' '; } s += `<polygon points="${pts}" ${f}/>`; }
  else s += `<path d="M100 48c36 10 46 50 36 80c-8 22-64 22-72 0c-10-30 0-70 36-80z" ${f}/>`;
  for (let i = 0; i < 4; i++) { const a = r() * 6.283, d = 66 + r() * 22, x = 100 + d * Math.cos(a), y = 100 + d * Math.sin(a); s += `<path d="M${x.toFixed(1)} ${(y - 5).toFixed(1)}l4 5l-4 5l-4-5z" fill="hsl(${h2} 95% 78%)" opacity=".85"/>`; }
  const ex = eyes === 1 ? [100] : eyes === 2 ? [86, 114] : [78, 100, 122];
  for (const x of ex) s += `<circle cx="${x}" cy="98" r="5" fill="#f4fdff"/><circle cx="${x}" cy="98" r="2.2" fill="hsl(${h2} 80% 20%)"/>`;
  return s + '</svg>';
}

function exactName(q) {
  const t = q.trim().split(/\s+/); if (t.length < 2) return null;
  const id = decodeWord(t[t.length - 1]); if (id === null || id < 1n) return null;
  const p = gen(id);
  return p.name.toLowerCase() === t.join(' ').toLowerCase() ? p : null;
}

if (typeof document === 'undefined') { module.exports = { gen, codeWord, decodeWord, exactName, art, rng }; return; }

/* ========== Infinite feed: sliding DOM window over an unbounded BigInt ID space ========== */
const $ = s => document.querySelector(s);
const BATCH = 300n, MAXDOM = 600, ROW = 12;
const grid = $('#grid'), live = new Map(), prep = new Map();
let first = 1n, next = 1n, busy = false, queued = false;
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const artIO = new IntersectionObserver(es => {
  for (const e of es) if (e.isIntersecting) {
    const el = e.target; artIO.unobserve(el);
    const p = live.get(el.dataset.a) || gen(BigInt(el.dataset.a));
    el.innerHTML = art(p, 'c'); 
  }
}, { rootMargin: '400px 0px' });
const watchArt = root => root.querySelectorAll('.art[data-a]:empty').forEach(el => artIO.observe(el));

const card = p => `<article class="card" data-id="${p.id}"><div class="art" data-a="${p.id}"></div><div class="cb"><span class="cls">${p.species}</span><h3>${p.name}</h3><div class="pid">ID <b>${p.id}</b></div><p>${p.short}</p><button class="vp" data-view="${p.id}">View Profile</button></div></article>`;

function prepare(start, count) {
  const k = start + ':' + count;
  if (prep.has(k)) return prep.get(k);
  try {
    const a = []; for (let i = 0n; i < count; i++) a.push(gen(start + i));
    prep.set(k, a);
    if (prep.size > 4) prep.delete(prep.keys().next().value);
    return a;
  } catch (e) { console.warn('batch failed, will retry', e); return null; }
}
function anchor() { for (const el of grid.children) { const t = el.getBoundingClientRect().top, b = el.getBoundingClientRect().bottom; if (b > 0) return { el, t }; } return null; }
function restore(a) { if (!a || !a.el.isConnected) return; const d = a.el.getBoundingClientRect().top - a.t; if (d) window.scrollBy(0, d); }
function drop(el) { live.delete(el.dataset.id); artIO.unobserve(el.firstChild); el.remove(); }

function appendBatch() {
  const a = prepare(next, BATCH); if (!a) return false;
  prep.delete(next + ':' + BATCH);
  grid.insertAdjacentHTML('beforeend', a.map(card).join(''));
  for (const p of a) live.set(p.id, p);
  next += BATCH; watchArt(grid); trimTop(); return true;
}
function prependBatch() {
  if (first <= 1n) return false;
  const s = first > BATCH ? first - BATCH : 1n, a = prepare(s, first - s); if (!a) return false;
  const an = anchor();
  grid.insertAdjacentHTML('afterbegin', a.map(card).join(''));
  for (const p of a) live.set(p.id, p);
  first = s; watchArt(grid); restore(an); trimBottom(); return true;
}
function trimTop() {
  const over = grid.children.length - MAXDOM; if (over < ROW) return;
  const lim = -innerHeight * 3.5, an = anchor(); let n = 0;
  for (const el of grid.children) { if (n >= over || el.getBoundingClientRect().bottom > lim) break; n++; }
  n -= n % ROW; if (!n) return;
  for (let i = 0; i < n; i++) drop(grid.firstElementChild);
  first = BigInt(grid.firstElementChild.dataset.id); restore(an);
}
function trimBottom() {
  const over = grid.children.length - MAXDOM; if (over < ROW) return;
  const lim = innerHeight * 4.5; let n = 0;
  for (let el = grid.lastElementChild; el && n < over && el.getBoundingClientRect().top > lim; el = el.previousElementSibling) n++;
  if (!n) return;
  for (let i = 0; i < n; i++) drop(grid.lastElementChild);
  next = BigInt(grid.lastElementChild.dataset.id) + 1n;
}
function pump() {
  if (busy) return; busy = true;
  try {
    for (let g = 0; g < 6; g++) {
      const vh = innerHeight, gap = document.documentElement.scrollHeight - scrollY - vh;
      if (gap < vh * 2.5) { if (!appendBatch()) break; continue; }
      if (scrollY < vh * 2.5 && first > 1n) { if (!prependBatch()) break; continue; }
      break;
    }
    prefetch();
  } catch (e) { console.error(e); } finally { busy = false; }
}
function prefetch() { /* start preparing next batch once the viewer is ~100 cards into the loaded range */
  const c = document.elementFromPoint(innerWidth / 2, innerHeight - 4), cd = c && c.closest && c.closest('.card');
  if (!cd) return; const id = BigInt(cd.dataset.id), idle = window.requestIdleCallback || (f => setTimeout(f, 50));
  if (next - id < 200n) idle(() => prepare(next, BATCH));
  if (first > 1n && id - first < 200n) idle(() => { const s = first > BATCH ? first - BATCH : 1n; prepare(s, first - s); });
}
const sched = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; pump(); }); };
addEventListener('scroll', sched, { passive: true });
addEventListener('resize', sched);
setInterval(() => { if (!document.hidden) pump(); }, 1000); /* watchdog: self-heals after any failed batch */

/* ========== Profile detail ========== */
const pm = $('#pm');
const sec = (t, h) => `<section><h4>${t}</h4>${h}</section>`;
function showProfile(idStr) {
  const id = BigInt(idStr), p = gen(id);
  pm.innerHTML = `<div class="pd" role="dialog" aria-modal="true"><button class="x" data-close aria-label="Close">×</button><div class="pdart">${art(p, 'm')}</div><div class="pdb"><span class="cls">${p.species} · ${p.rank}</span><h2>${p.name}</h2><div class="pid big">ID <b>${p.id}</b></div>
${sec('Biography', `<p>${p.bio}</p>`)}${sec('Origin', `<p>${p.origin}</p>`)}${sec('Appearance', `<p>${p.look}</p>`)}
${sec('Personality', `<p>${p.pers}</p><div class="chips">${p.tr.map(t => `<span>${t}</span>`).join('')}</div>`)}
${sec('Abilities', p.ab.map(a => `<div class="ab"><b>${a[0]}</b><span>${a[1]}</span></div>`).join(''))}
${sec('Characteristics', `<dl>${p.extra.map(e => `<dt>${e[0]}</dt><dd>${e[1]}</dd>`).join('')}</dl>`)}
${sec('Additional information', `<p><i>“${p.motto}”</i></p>`)}
<div class="nav"><button data-view="${id - 1n}" ${id <= 1n ? 'disabled' : ''}>← Previous</button><button data-view="${id + 1n}">Next →</button></div></div></div>`;
  pm.hidden = false; pm.scrollTop = 0;
}
function openProfile(id) { const had = !pm.hidden; showProfile(id); history[had ? 'replaceState' : 'pushState']({ p: id }, '', '#/p/' + id); }
function closeProfile() { if (pm.hidden) return; pm.hidden = true; pm.innerHTML = ''; if (history.state && history.state.p) history.back(); else history.replaceState(null, '', location.pathname + location.search); }
addEventListener('popstate', () => { const m = /^#\/p\/(\d+)$/.exec(location.hash); if (m && BigInt(m[1]) > 0n) showProfile(m[1]); else { pm.hidden = true; pm.innerHTML = ''; } });
document.addEventListener('click', e => {
  const v = e.target.closest('[data-view]'); if (v && !v.disabled) return openProfile(v.dataset.view);
  if (e.target.closest('[data-close]') || e.target === pm) closeProfile();
});
addEventListener('keydown', e => { if (e.key === 'Escape') { if (!pm.hidden) closeProfile(); else closeSearch(); } });

/* ========== Search (runs in its own overlay; never touches the feed) ========== */
const sr = $('#sr'), sl = $('#sl'), ss = $('#ss'), sin = $('#sin'), sbar = $('#sf'), inp = $('#q');
let tok = 0, cur = 1n, qt = [], running = false, got = 0; const seen = new Set();
function addResults(ps) {
  const h = []; for (const p of ps) { if (seen.has(p.id)) continue; seen.add(p.id); live.set(p.id, p); h.push(card(p)); }
  sl.insertAdjacentHTML('beforeend', h.join('')); watchArt(sl);
}
function scan(my) {
  if (my !== tok) return;
  const t = performance.now(), out = [];
  while (out.length < 24 && performance.now() - t < 14) {
    for (let i = 0; i < 40; i++, cur++) { const p = gen(cur); if (qt.every(w => p.hay.includes(w))) out.push(p); }
  }
  addResults(out); got += out.length;
  ss.textContent = `Matches found while scanning IDs 1–${cur - 1n}${got < 24 ? ' · still searching…' : ''}`;
  if (got < 24) setTimeout(scan, 0, my); else { running = false; got = 0; }
}
function startSearch(q) {
  tok++; const my = tok; sl.innerHTML = ''; seen.clear(); cur = 1n; running = false; got = 0; q = q.trim();
  if (!q) { sr.hidden = true; return; }
  sr.hidden = false; sin.scrollTop = 0;
  const d = q.replace(/[#,\s_]/g, '');
  if (/^\d+$/.test(d)) { const id = BigInt(d); if (id > 0n) { ss.textContent = 'Exact ID match'; addResults([gen(id)]); } else ss.textContent = 'IDs begin at 1.'; return; }
  const ex = exactName(q); if (ex) addResults([ex]);
  qt = q.toLowerCase().split(/\s+/); running = true; ss.textContent = 'Searching…'; scan(my);
}
sin.addEventListener('scroll', () => { if (!running && sin.scrollTop + sin.clientHeight > sin.scrollHeight - 600 && qt.length && !/^\d+$/.test(inp.value.replace(/[#,\s_]/g, ''))) { running = true; scan(tok); } }, { passive: true });
let deb; inp.addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(() => startSearch(inp.value), 350); });
$('#sf').addEventListener('submit', e => { e.preventDefault(); clearTimeout(deb); startSearch(inp.value); });
function closeSearch() { tok++; sr.hidden = true; sbar.hidden = true; inp.value = ''; }
$('#sb').addEventListener('click', () => { sbar.hidden = !sbar.hidden; if (!sbar.hidden) inp.focus(); else closeSearch(); });
$('#sx').addEventListener('click', closeSearch);

/* ========== Boot: first 300 profiles immediately ========== */
appendBatch(); pump();
const m0 = /^#\/p\/(\d+)$/.exec(location.hash); if (m0 && BigInt(m0[1]) > 0n) showProfile(m0[1]);
})();
