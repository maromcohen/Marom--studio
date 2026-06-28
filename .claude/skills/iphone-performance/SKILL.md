---
name: iphone-performance
description: MUST USE before planning, adding, or changing ANY feature on the MAROM site — especially visuals, animation, WebGL/Three.js, CSS effects, scroll, or sound. The owner's top priority is that the site runs buttery-smooth (60fps) on iPhone with the SAME experience as desktop. Triggers on "add", "build", "new feature", "improve the site", "make it look better", "animation", "effect", "WebGL", "3D", "particles", "scroll", "redesign", or any change to index.html visuals. Apply its mobile budget and checklist to every plan and implementation.
---

# iPhone Performance First (MAROM)

The #1 requirement for this site: **it must feel buttery-smooth on iPhone / iOS Safari**, at ~60fps, with the **same cinematic experience** as desktop — degrade gracefully, never strip the look.

Apply this BEFORE writing a plan and BEFORE implementing. Every new visual/animation/effect must pass the checklist below.

## Hard rules (learned the hard way)

1. **No ES-modules / importmap for libraries.** iOS Safari silently failed to load Three.js via `importmap` → blank screen. Load libs as **UMD globals via `<script src>` from cdnjs** (same CDN that already serves GSAP/Lenis here). No `type="module"`, no `three/addons/*`.
2. **Always keep a fallback. Never a blank screen.** WebGL is probed on a throwaway canvas; if unavailable → Canvas 2D fallback. Any new GPU feature needs a graceful no-op/degraded path.
3. **Physics/anim in the vertex shader, not GPGPU.** Avoid float textures / FBO ping-pong (flaky on older iOS). Analytic motion (curl noise, mouse uniforms) in the shader is iOS-safe.

## Mobile budget (gate everything behind `var mobile = innerWidth < 768`)

- **DPR:** cap at **1** on mobile (`renderer.setPixelRatio(Math.min(dpr, mobile?1:2))`). High DPR × additive overdraw = the single biggest phone killer.
- **Particle counts:** mobile gets a fraction (current: dust ~2400 vs 14000, nodes ~50 vs 120). New particle work → set a mobile count.
- **Additive overdraw / bloom:** big additive sprites cost fillrate. Shrink point size on mobile (`uSizeK`), fewer/smaller glow layers. Prefer cheap glow over real post-processing.
- **Update cadence:** non-critical loops can run at half-rate on mobile (e.g. rebuild SVG path every 2nd frame). Keep scroll-coupled motion per-frame.

## CSS cost traps on mobile

- **`filter: blur()` > ~40px** (e.g. hero orbs at 110px) is very expensive — reduce to ≤55px or hide on mobile.
- **`backdrop-filter`** over a **fixed/scrolling canvas** forces constant recompute — **disable on mobile**, use a near-opaque bg instead.
- Lighter `grain`/overlays on mobile. Avoid stacking many full-screen composited layers.

## JS animation rules (all devices, critical on mobile)

- **Never read layout inside `requestAnimationFrame`.** No `getBoundingClientRect` / `offsetWidth` / `getComputedStyle` per frame — it thrashes layout. **Cache geometry; recompute on `resize`/`scroll` only.**
- Batch DOM writes; avoid interleaving reads/writes.
- Bail loops on `document.hidden`.
- Mouse-only flourishes: gate behind `!('ontouchstart' in window)` / `@media(hover:none)`. Hide the custom cursor on touch.

## Accessibility (always)

Every animation AND sound must honor **`prefers-reduced-motion`** and the site's **`a11y-stop`** class (the "Stop Animations" toggle) — freeze to a static frame / silence.

## Same-experience principle

Don't remove signature elements on mobile (e.g. the **Golden Thread stays**). Instead scale them down: fewer points, lower DPR, simpler blur, half-rate updates — keep the feel, cut the cost.

## Pre-merge checklist (answer for every change)

- [ ] What's the added per-frame cost on a phone (overdraw, layout reads, DOM writes, extra rAF loops)?
- [ ] Is there a `mobile` branch with reduced counts/size/cadence?
- [ ] Any new `blur`/`backdrop-filter`/large additive sprites — reduced or disabled on mobile?
- [ ] No `getBoundingClientRect`/layout reads inside any rAF loop?
- [ ] New lib loaded as UMD `<script src>` (no module/importmap)? Fallback present?
- [ ] Honors reduced-motion and `a11y-stop`?
- [ ] Verified the experience still looks the same on phone (just lighter)?

If a feature can't hit 60fps on iPhone without gutting the experience, propose a lighter alternative in the plan — don't ship the lag.
