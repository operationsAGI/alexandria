# Alexandria

A single-page React + Vite + Tailwind CSS site for alexandriasociety.org, a San Francisco reading society. Static, no backend/database/auth.

## Run locally

```bash
npm install
npm run dev      # start dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## Structure

- `src/App.jsx`: page composition (intro, background, nav, hero, sections, footer)
- `src/components/IntroFlythrough.jsx`: plays a short (~1.8s) clip from the library flythrough footage, then resolves into a light flash and fades to reveal the page (~3s total). Has a "Skip intro" button and respects `prefers-reduced-motion`
- `src/components/BackgroundVideo.jsx`: two layered fixed background videos (old book pages, plus a screen-blended gold shimmer layer) under a light black/gold scrim, paused automatically when `prefers-reduced-motion` is set
- `src/components/Gallery.jsx`: grid of real event photos
- `src/components/HistoryTimeline.jsx`: vertical, editorial-style timeline with a scroll-filled rail, year quick-jump pills, and scroll-reveal entries
- `src/components/Hero.jsx`, `TheIdea.jsx`, `Gatherings.jsx`, `HistoryTimeline.jsx`, `Join.jsx`, `Footer.jsx`, `Nav.jsx`
- `public/media/library-pages.mp4`: background footage (old book pages), muted and looped
- `public/media/gold-shimmer.mp4`: background footage (gold shimmer), muted, looped, screen-blended over the book pages
- `public/media/intro-library.mp4`: the intro flythrough clip
- `public/media/gallery/*.jpg`: event photos used in the Gallery section
- `src/data/events.js`: the exact event history (26 entries, 2023 to 2025) used to render the History timeline
- `src/index.css`: Tailwind directives plus custom candlelit textures and animations

## Notes

- The `events.js` file is where you edit/add gatherings. The History section renders straight from it, grouped by year.
- Outbound links in `Join.jsx`: Book Maps & Talks and Luma are live; Slack Chat and Inspired Autodidacts (Facebook) are still placeholder `#` hrefs. Swap in the real URLs.
- Colors, type, and the black/gold/white/light-brown palette live in `tailwind.config.js` under `theme.extend`.
