# VORQALYTH

**INFINITE REALMS. ENDLESS IDENTITIES. LIMITLESS DISCOVERIES.**

A static, client-side fictional identity archive built with HTML, CSS and vanilla JavaScript.

## Files
- `index.html` — page structure
- `style.css` — responsive cosmic interface
- `script.js` — deterministic profile generation, search, detail view and progressive rendering

## Run locally
Open `index.html` in a modern browser. No build step, server, API key, account or database is required.

## Publish with GitHub Pages
1. Create a repository.
2. Upload `index.html`, `style.css`, `script.js`, and this README to the repository root.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**, select the default branch and `/ (root)`, then save.
5. Open the published Pages URL after deployment finishes.

The site is static and also works on compatible static hosting providers.

## How identities work
Each identity is derived deterministically from its positive decimal ID. IDs are parsed as decimal strings and profile details are generated from the exact ID text, avoiding JavaScript `Number` precision loss for exact-ID lookups. The archive prepares an initial set of 300 and expands in batches as the user explores. Artwork is generated locally as lightweight SVG; no external image service is required.

## Notes about limits
A static browser application cannot guarantee literally unbounded storage, runtime, or scroll height: browsers and devices impose finite memory and layout limits. This implementation uses a bounded rendered window and deterministic regeneration to reduce DOM and memory pressure. Exact numeric-ID lookup can generate a profile directly for an arbitrarily long decimal ID. Text search scans a bounded portion of the prepared archive to keep low-end phones responsive.

## Customization
Edit the arrays near the top of `script.js` to add original naming fragments, classifications, origins, personality descriptions, abilities, traits and biography fragments. Keep generation deterministic so an ID always resolves to the same identity.
