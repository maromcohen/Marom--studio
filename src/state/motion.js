// Shared per-frame motion state. Mutable on purpose: written once per frame by
// CameraRig, read by PostFX / Particles / Mood / Overlay / sound — zero React re-renders.
export const motion = {
  offset: 0,       // scroll offset 0..1
  velocity: 0,     // smoothed scroll speed 0..1
  worldIndex: 0,   // world the camera is currently nearest to
  arrival: 0,      // 0..1 — how centred the camera is on the nearest world
  pulse: 0,        // 1 on world-boundary crossing, decays to 0 (drives flash/flare)
  scrollEl: null,  // drei ScrollControls' scrolling element (for the overlay nav)
  frozen: false,   // a11y "stop animations" — rigs damp to stillness, jumps go instant
  noMedia: false,  // a11y "hide media" — video portals pause and fade out
  hoverWork: -1    // index of the hovered work card (-1 = none), read by the overlay
}

export const MOBILE = typeof window !== 'undefined' && window.innerWidth < 768
export const REDUCED = typeof window !== 'undefined' && !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Scroll fraction at which the camera sits in front of world i — mirrors the
// CameraRig curve geometry (start at WORLDS[0].z+10, stations at z+6, end at last.z-5).
export function worldFraction(worlds, i) {
  const start = worlds[0].z + 10
  const end = worlds[worlds.length - 1].z - 5
  return (start - (worlds[i].z + 6)) / (start - end)
}

// Smooth-scroll the drei ScrollControls element to world i — shared by the
// dots nav, the fullscreen menu and the wordmark.
export function goToWorld(worlds, i) {
  const el = motion.scrollEl
  if (!el) return
  const top = (el.scrollHeight - el.clientHeight) * worldFraction(worlds, i)
  el.scrollTo({ top, behavior: motion.frozen || REDUCED ? 'auto' : 'smooth' })
}
