// Synthesized UI sound — Web Audio only, no assets. An airy filtered-noise
// whoosh whose gain follows scroll velocity, plus a soft chime on world arrival.
// Off by default (autoplay policy), toggled from the overlay, persisted in
// localStorage, and disabled entirely under prefers-reduced-motion.
import { motion, REDUCED } from '../state/motion'

const KEY = 'marom-sound'
let ctx = null
let noiseGain = null
let filter = null
let raf = 0
let lastWorld = -1
let enabled = typeof localStorage !== 'undefined' && localStorage.getItem(KEY) === '1'

export const isSoundOn = () => enabled && !REDUCED

function ensureContext() {
  if (ctx) return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  ctx = new AC()

  // looped white-noise buffer → lowpass → gain (the whoosh bed)
  const seconds = 2
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop = true
  filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 240
  filter.Q.value = 0.6
  noiseGain = ctx.createGain()
  noiseGain.gain.value = 0
  src.connect(filter).connect(noiseGain).connect(ctx.destination)
  src.start()
}

function chime(worldIndex) {
  if (!ctx) return
  // gentle pentatonic step per world — soft sine with a fast attack, slow release
  const steps = [0, 3, 5, 7, 10, 12]
  const f = 392 * Math.pow(2, (steps[worldIndex % steps.length]) / 12)
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = f
  g.gain.setValueAtTime(0, ctx.currentTime)
  g.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 0.03)
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9)
  osc.connect(g).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 1)
}

function loop() {
  raf = requestAnimationFrame(loop)
  if (!ctx || !noiseGain) return
  const v = motion.velocity
  // whoosh follows scroll speed
  noiseGain.gain.value += ((v * 0.14) - noiseGain.gain.value) * 0.1
  filter.frequency.value += ((240 + v * 1400) - filter.frequency.value) * 0.08
  if (motion.worldIndex !== lastWorld) {
    lastWorld = motion.worldIndex
    chime(lastWorld)
  }
}

export function toggleSound() {
  if (REDUCED) return false
  enabled = !enabled
  try { localStorage.setItem(KEY, enabled ? '1' : '0') } catch {}
  if (enabled) {
    ensureContext()               // created inside the user gesture → allowed
    if (ctx) { ctx.resume(); lastWorld = motion.worldIndex; cancelAnimationFrame(raf); loop() }
  } else {
    cancelAnimationFrame(raf)
    if (noiseGain) noiseGain.gain.value = 0
    if (ctx) ctx.suspend()
  }
  return enabled
}
