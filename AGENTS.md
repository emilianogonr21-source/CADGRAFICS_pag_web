# AGENTS.md

## Cursor Cloud specific instructions

### What this repo is
A **static marketing website** for CADGRAFICS (Spanish, Mexican market). Pure HTML/CSS/JS with all styles and scripts inline — there is **no build step, no package manager, and no backend in the repo**.

- Entry point: `index.html` at repo root.
- Additional pages under `pages/` (`adobe/`, `autodesk/`, `hp/`, `chaos/`) and `aviso-privacidad.html`.
- Media in `assets/` (images + video).

### Running the site (dev)
There is no `npm start`. Serve the repo root as static files, e.g.:

```
python3 -m http.server 5501
```

Then open `http://localhost:5501/index.html`. Port `5501` is only a convention from `.vscode/settings.json` (VS Code Live Server); any port works. There is no lint/test/build tooling — "testing" means serving the files and clicking through pages/forms.

### Non-obvious gotchas
- **Video assets are Git LFS.** `*.mp4` files (see `.gitattributes`) are stored via Git LFS. On a fresh checkout they are ~130-byte pointer files until `git lfs pull` hydrates them; the site loads either way, but hero/background videos are broken until pulled. The startup update script runs `git lfs pull`.
- **Lead forms POST to `/api/leads`, which does not exist in this repo.** Submitting a form (e.g. the hero "Cuéntanos de tu Proyecto" form on `index.html`, or the modal `#leadForm`) triggers `fetch('/api/leads')`. With only the static server running, this request fails and the form shows the error / WhatsApp fallback message — this is expected, not a bug. Client-side validation still runs before the fetch.
- Google Fonts load from a CDN (optional; system fonts are used as fallback if offline).
