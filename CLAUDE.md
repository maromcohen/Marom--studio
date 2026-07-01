# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MAROM Digital Studio — a Hebrew (RTL) single-take cinematic WebGL portfolio site for a boutique web design studio in Tel Aviv, in the style of Active Theory. React + Vite + React Three Fiber. The camera flies down one continuous path through six AI-generated (Higgsfield) video "worlds"; a flythrough work gallery of Higgsfield stills sits between the WORK and PROCESS stations.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — serve `dist/` on port 4173

## Deployment

- **Hosting:** GitHub Pages via GitHub Actions (`.github/workflows/static.yml`) — builds with Vite, uploads `dist/`
- **Live URL:** https://maromcohen.github.io/Marom--studio/
- Netlify also configured (`netlify.toml`, publish `dist`)

## Architecture (src/)

- `data/worlds.js` — the six WORLDS (z-positions, Hebrew copy, accent colors, Higgsfield CDN videos) + PROJECTS (work-gallery cards). All journey content lives here.
- `rig/CameraRig.jsx` — CatmullRom camera path, mouse parallax, FOV speed kick, writes shared per-frame state.
- `state/motion.js` — mutable shared motion state (offset/velocity/worldIndex/pulse/frozen/noMedia) + `goToWorld()` nav helper. `frozen`/`noMedia` are set by the accessibility widget.
- `worlds/Station.jsx` — a world stop: VideoPortal + troika 3D Hebrew headlines that breathe in on approach.
- `worlds/WorkGallery.jsx` — flythrough project cards (staggered left/right, z −56…−72.5), hover/proximity wake shader, per-card error boundary so a failed texture never crashes the app.
- `media/VideoPortal.jsx` — soft elliptical video aperture with accent rim flare; pauses decode when far/frozen/noMedia.
- `fx/` — Particles (warp streaks), PostFX (bloom/CA/grain/vignette), Mood (fog color lerp per world).
- `ui/` — Overlay (wordmark/dots/sound/contact+legal footer), Menu (fullscreen nav), Preloader (counter + curtain wipe), Cursor (custom dot+ring, `[data-cursor]` labels), A11y (17-feature Israeli-standard widget), Legal (Hebrew privacy/terms/accessibility-statement modals), fonts.js (bundled TTFs).

## RTL / Hebrew notes

- `index.html` is `lang="he" dir="rtl"`. Chrome UI uses **physical** CSS positions (left/right) deliberately — mixed-direction elements made logical properties confusing. Layout: burger + sound top-LEFT, MAROM wordmark top-RIGHT, dots nav LEFT, a11y FAB + cookie note bottom-LEFT, contact block bottom-RIGHT.
- 3D text fonts (troika): Frank Ruhl Libre (headlines), Heebo (body) — Hebrew-capable, bundled from @expo-google-fonts. Marcellus only for the Latin MAROM wordmark. Avoid letter-spacing on Hebrew display text.

## Legal compliance (Israeli law — keep intact)

- Accessibility widget (IS 5568 / WCAG 2.0 AA): 17 features, state in localStorage `a11y`. "Stop animations" and "hide media" also freeze the WebGL rig via `motion.frozen`/`motion.noMedia`.
- Legal modals in Hebrew: privacy (חוק הגנת הפרטיות + תיקון 13), terms, accessibility statement (coordinator: Marom Cohen).
- Cookie/privacy note: localStorage `cookie-consent`; the site stores preferences only, no tracking.

## Content

- Contact: WhatsApp +972532748125, email marom7777@icloud.com
- Media: Higgsfield CDN (cloudfront). Regenerate via the Higgsfield MCP tools; put new URLs in `data/worlds.js`.
