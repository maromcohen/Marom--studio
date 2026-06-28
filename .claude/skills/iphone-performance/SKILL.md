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

---

## 🔴 SCROLL ON MOBILE — CRITICAL LEARNINGS (researched & battle-tested)

These patterns cause scroll to **freeze / feel stuck** on iPhone. Every one was found the hard way on this site.

### 1. `touch-action:none` on fixed overlays — KILLS SCROLL
Even with `pointer-events:none`, a fixed/absolute element with `touch-action:none` can block iOS Safari from initiating scroll. **Always use `touch-action:auto` on canvas/overlay elements.**
```css
/* ✅ correct */
#scene3d { pointer-events:none; touch-action:auto; }
/* ❌ kills iOS scroll */
#scene3d { pointer-events:none; touch-action:none; }
```

### 2. touchmove listener feeding WebGL physics — SCATTERS PARTICLES ON SCROLL
If you feed `e.touches[0].clientX/Y` into mouse-repel uniforms (`uMouse`), finger-scroll causes particles to explode outward from the touch point — feels like the page is broken. **Mouse repel is desktop-only. Never listen to touchmove for WebGL physics.**
```js
// ✅ desktop only
if(!mobile) addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; });
// ❌ never do this — scatters particles during scroll
addEventListener('touchmove', function(e){ mx=e.touches[0].clientX; my=e.touches[0].clientY; });
```

### 3. Lenis smooth scroll on mobile — BLOCKS NATIVE MOMENTUM
`new Lenis({ smoothWheel:true })` or `syncTouch:true` on mobile drives scroll through JS rAF, which fights iOS's native momentum scroll. Result: page snaps back, user can't scroll freely.
```js
// ✅ Lenis desktop-only
var lenis = null;
if(!isMobile){ lenis = new Lenis({...}); }
// On mobile → use native scroll, just listen to window.addEventListener('scroll',...)
```

### 4. `position:sticky` hero with excessive height on mobile — FEELS BROKEN
A sticky hero at `height:180vh` means 80vh of invisible scroll before content appears. User thinks the page is frozen.
- **On mobile: set hero to `height:100vh` + `position:relative`** (no sticky scroll zone).
- Desktop keeps the full cinematic `height:300vh` sticky experience.
```css
@media(max-width:767px){
  .hero { height:100vh; }
  .hero-pin { position:relative; top:auto; }
}
```

### 5. GSAP ScrollTrigger + iOS Safari bugs
- iOS Safari **misreports `scrollY` and `event.clientX/Y`** intermittently during scroll → causes jitter/jump.
- `ScrollTrigger.normalizeScroll(true)` is GSAP's workaround: intercepts native scroll on the JS thread, skips every other touchmove. **Use on mobile only, with caution** — can cause scroll to stop early at page bottom.
- Always add: `ScrollTrigger.config({ ignoreMobileResize: true })` on mobile to prevent unnecessary refreshes when Safari's address bar shows/hides.
- **Never mix `scroll-behavior: smooth` with ScrollTrigger** — causes scroll-to-top bug on iOS 16+.
- `position:sticky` pinning with ScrollTrigger causes bumpy scroll on Safari, especially with mousewheel. **Disable sticky scroll sections on mobile.**

### 6. `overscroll-behavior` — NOT supported on iOS Safari
`overscroll-behavior: contain` (prevents rubber-band/scroll-chain) works on Chrome/Firefox but **not iOS Safari**. Don't rely on it for mobile.

### 7. WebGL canvas resize on iOS — memory leak
Resizing canvas `width`/`height` properties on iOS Safari causes memory leak (no desktop equivalent). Safari address bar show/hide resizes the viewport → triggers resize events → can cause canvas jumps.
- Use `100dvh` instead of `100vh` for the canvas/pin height to account for dynamic viewport.
- Debounce resize handler (already done on this site).
- Consider `ScrollTrigger.config({ ignoreMobileResize:true })` to avoid layout recalc on address bar toggle.

### 8. WebGL uniform uploads on Apple Metal/Safari
iOS uses Metal (not OpenGL) internally. GSAP-style uniform updates at the wrong moment can cause 150ms hitches. Keep uniform updates inside the rAF loop, not in scroll event handlers.

### Scroll debugging checklist (when mobile scroll feels stuck/wrong)
- [ ] Any `touch-action:none` on fixed/absolute overlays?
- [ ] Any `touchmove` listener feeding mouse/physics coordinates?
- [ ] Lenis or any smooth-scroll lib active on mobile?
- [ ] Sticky section with large height requiring invisible scroll before content?
- [ ] `scroll-behavior:smooth` anywhere in CSS?
- [ ] ScrollTrigger pin on mobile causing jump?
- [ ] Canvas resize loop causing constant repaints?

---

## Pre-merge checklist (answer for every change)

- [ ] What's the added per-frame cost on a phone (overdraw, layout reads, DOM writes, extra rAF loops)?
- [ ] Is there a `mobile` branch with reduced counts/size/cadence?
- [ ] Any new `blur`/`backdrop-filter`/large additive sprites — reduced or disabled on mobile?
- [ ] No `getBoundingClientRect`/layout reads inside any rAF loop?
- [ ] New lib loaded as UMD `<script src>` (no module/importmap)? Fallback present?
- [ ] Honors reduced-motion and `a11y-stop`?
- [ ] Verified the experience still looks the same on phone (just lighter)?
- [ ] **Scroll checklist above passed?**

If a feature can't hit 60fps on iPhone without gutting the experience, propose a lighter alternative in the plan — don't ship the lag.
