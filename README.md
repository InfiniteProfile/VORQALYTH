# VORQALYTH — Infinite Realms. Endless Identities.

A static, dependency-free infinite profile universe (HTML + CSS + vanilla JS).

## Run locally
Open `index.html` in any modern browser, or serve the folder: `python3 -m http.server 8000` then visit http://localhost:8000

## Publish (GitHub Pages)
1. Create a repository and upload `index.html`, `style.css`, `script.js` to the root.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Visit the URL GitHub gives you. Any static host (Netlify, Cloudflare Pages, etc.) also works: just upload the three files.

## How it works
- **Profiles are pure functions of their ID.** `gen(BigInt id)` seeds a PRNG from the decimal ID string, so a profile is identical on every visit and device. Nothing is stored or fetched.
- **IDs** are BigInt end to end and displayed in full (tested to 200 digits).
- **Names are unique and invertible.** Full name = generated given name + a bijective base-128 syllable code of the ID. This makes exact-name search deterministic for any ID; names for very large IDs are longer (about one syllable per 7 bits of ID).
- **Infinite feed.** Batches of 300 contiguous IDs are appended near the bottom. A batch is prepared once you are ~100 cards in. The DOM keeps at most ~600 cards: cards far off-screen are removed, and scroll position is compensated so the visible card never moves. Scrolling up re-creates earlier IDs. This avoids browser scroll-height limits. Triggers are a scroll listener, resize and a 1-second watchdog; failed batches are retried automatically. There is no end, no Load More, no footer, and no programmatic scrolling.
- **Artwork** is procedural inline SVG, created only when a card nears the viewport.
- **Search** (magnifier icon): exact ID (any length), exact name, partial name, species, personality and other text. Text search scans IDs from 1 upward in short time slices and continues as you scroll the results, so it is open-ended rather than limited to a fixed set. It runs in its own overlay and never interrupts the feed.
- **Profile pages** open as a detail view at `#/p/<id>` (shareable, Back-button friendly, Prev/Next buttons).

## Files
`index.html`, `style.css`, `script.js`, `README.md`
