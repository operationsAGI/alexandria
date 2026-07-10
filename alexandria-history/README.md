# Alexandria

A two-page React + Vite + Tailwind CSS site for alexandriasociety.org, a San Francisco reading society. Static, no backend/database/auth.

## Deploying

This repo uses a manual deploy (no CI): `gh-pages` builds the site and pushes `dist/` straight to a `gh-pages` branch.

```bash
npm run deploy
```

That's `vite build` followed by pushing `dist/` (which includes `CNAME`, so the custom domain sticks) to the `gh-pages` branch. First time only: in your repo's Settings -> Pages, set **Source** to "Deploy from a branch" and pick the `gh-pages` branch, root folder. After that, running `npm run deploy` whenever you want to publish is the whole workflow.

## Run locally

```bash
npm install
npm run dev      # start dev server (home at /, join page at /join/)
npm run build    # production build -> dist/index.html and dist/join/index.html
npm run preview  # preview the production build
```

## Pages

- `/` (home): `index.html` -> `src/main.jsx` -> `src/App.jsx`
- `/join/` (application form): `join/index.html` -> `src/main-join.jsx` -> `src/JoinApp.jsx`

Both are separate static HTML files after `npm run build` (a real multi-page Vite build, not client-side routing), so they work on any static host, including GitHub Pages, without needing SPA-fallback config.

## Structure

- `src/App.jsx`: home page composition (intro, background, nav, hero, sections, footer)
- `src/JoinApp.jsx`: join page composition (background, nav, registration form, footer; no intro)
- `src/components/IntroFlythrough.jsx`: plays a short (~1.8s) clip from the library flythrough footage, then resolves into a light flash and fades to reveal the page (~3s total). Home page only. Has a "Skip intro" button and respects `prefers-reduced-motion`
- `src/components/BackgroundVideo.jsx`: two layered fixed background videos (old book pages, plus a screen-blended gold shimmer layer) under a light black/gold scrim, paused automatically when `prefers-reduced-motion` is set. Used on both pages
- `src/components/RegistrationPage.jsx`: the `/join/` page content. Embeds the real Alexandria Application Form (Google Form) via iframe, so every submission is handled by Google Forms itself and lands in the sheet it's connected to (https://docs.google.com/spreadsheets/d/1gNCdEjFz_duOlmn7TunSQlxMVdwNsiC94wSEOhgQkNA). If you ever need to change the form, update `FORM_EMBED_URL` / `FORM_DIRECT_URL` in that file with the new form's public `/d/e/...` ID (found in the form's own "Send" -> embed `<iframe>` link, not the edit URL)
- `src/components/Gallery.jsx`: grid of real event photos
- `src/components/HistoryTimeline.jsx`: vertical, editorial-style timeline with a scroll-filled rail, year quick-jump pills, and scroll-reveal entries. Renders newest to oldest
- `src/components/Hero.jsx`, `TheIdea.jsx`, `Gatherings.jsx`, `Join.jsx`, `Footer.jsx`, `Nav.jsx`: `Nav` and `Footer` take an `onHomePage` prop so their links resolve correctly from either page
- `public/media/library-pages.mp4`: background footage (old book pages), muted and looped
- `public/media/gold-shimmer.mp4`: background footage (gold shimmer), muted, looped, screen-blended over the book pages
- `public/media/intro-library.mp4`: the intro flythrough clip
- `public/media/gallery/*.jpg`: event photos used in the Gallery section
- `src/data/events.js`: the exact event history used to render the History timeline, each with its real original RSVP link (Partiful for past events, Luma for events actually booked through Luma)
- `src/index.css`: Tailwind directives plus custom candlelit textures and animations

## Notes

- The `events.js` file is where you edit/add gatherings. The History section renders straight from it, grouped by year, newest first.
- The homepage's "Get Involved" section (`Join.jsx`) links to Luma (https://luma.com/user/agihouse) for RSVPing to a specific night, and separately links to `/join/` for applying to the society. The Nav's "Join" button and Hero's "Join the Society" button also go straight to `/join/`.
- Colors, type, and the black/gold/white/light-brown palette live in `tailwind.config.js` under `theme.extend`.
