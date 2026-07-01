import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'

// Cinematic entry: a black curtain with the MAROM monogram breathing, a
// percentage counter that eases toward real asset progress, and a two-panel
// curtain wipe once everything is ready. The app renders behind it from frame
// one — the preloader only reveals, it never gates mounting.
const MIN_TIME = 1600 // never flash — hold at least this long

export default function Preloader({ onDone }) {
  const { progress } = useProgress()
  const [shown, setShown] = useState(0)      // eased counter 0..100
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)
  const start = useRef(performance.now())
  const raf = useRef(0)
  const real = useRef(0)

  real.current = progress

  useEffect(() => {
    let last = performance.now()
    const tick = (now) => {
      raf.current = requestAnimationFrame(tick)
      const dt = Math.min(0.2, (now - last) / 1000)
      last = now
      const elapsed = now - start.current
      // time-based floor that always reaches 100 (~3s) — asset progress can
      // only pull the counter ahead, never strand it (video/font loads don't
      // report through THREE's manager). dt-based easing keeps the pace
      // identical at any frame rate.
      const floor = Math.min(100, (elapsed / 3000) * 100)
      const target = Math.max(real.current, floor)
      setShown((s) => {
        const next = s + (target - s) * Math.min(1, dt * 6)
        return next > 99 ? 100 : next
      })
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  useEffect(() => {
    if (shown >= 100 && !leaving) {
      const elapsed = performance.now() - start.current
      const wait = Math.max(0, MIN_TIME - elapsed)
      const t1 = setTimeout(() => {
        setLeaving(true)
        onDone?.()
        setTimeout(() => setGone(true), 1400)
      }, wait + 250)
      return () => clearTimeout(t1)
    }
  }, [shown, leaving, onDone])

  if (gone) return null

  return (
    <div className={`preloader${leaving ? ' leaving' : ''}`} aria-hidden={leaving}>
      <div className="preloader-panel top" />
      <div className="preloader-panel bottom" />
      <div className="preloader-core">
        <svg className="preloader-mark" viewBox="0 0 100 100" width="64" height="64" aria-hidden="true">
          <path d="M22 74 L22 26 L50 56 L78 26 L78 74" fill="none" stroke="#b38bff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="preloader-count">{Math.floor(shown)}<span>%</span></div>
        <div className="preloader-tag">חוויה קולנועית במסע אחד</div>
      </div>
    </div>
  )
}
