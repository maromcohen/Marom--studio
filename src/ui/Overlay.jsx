import { useEffect, useRef, useState } from 'react'
import { WORLDS } from '../data/worlds'
import { motion, worldFraction } from '../state/motion'
import { isSoundOn, toggleSound } from '../audio/sound'

// Fixed HTML layer over the 3D canvas: wordmark, world-dots nav, progress bar,
// sound toggle and a contact CTA on the last world. The container never captures
// input (pointer-events:none) — only the interactive bits do.
export default function Overlay() {
  const [wi, setWi] = useState(0)
  const [sound, setSound] = useState(isSoundOn())
  const barRef = useRef()

  useEffect(() => {
    let raf
    const tick = () => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${motion.offset})`
      setWi((w) => (w === motion.worldIndex ? w : motion.worldIndex))   // re-render only on change
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const go = (i) => {
    const el = motion.scrollEl
    if (!el) return
    const top = (el.scrollHeight - el.clientHeight) * worldFraction(WORLDS, i)
    el.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div className="overlay">
      <a className={`wordmark${wi === 0 ? ' hidden' : ''}`} href="#top" onClick={(e) => { e.preventDefault(); go(0) }}>MAROM</a>

      <nav className="dots" aria-label="Worlds">
        {WORLDS.map((w, i) => (
          <button
            key={w.id}
            className={`dot${i === wi ? ' active' : ''}`}
            style={{ '--c': w.color }}
            onClick={() => go(i)}
            aria-label={w.eyebrow}
          >
            <span className="dot-label">{w.eyebrow.split('·')[0].trim()}</span>
          </button>
        ))}
      </nav>

      <button className="sound-toggle" onClick={() => setSound(toggleSound())} aria-pressed={sound} aria-label="Toggle sound">
        {sound ? '♪ on' : '♪ off'}
      </button>

      <a className={`cta${wi === WORLDS.length - 1 ? ' show' : ''}`} href="mailto:marom7777@icloud.com">
        Let’s talk →
      </a>

      <div className="progress"><div ref={barRef} className="progress-bar" /></div>
    </div>
  )
}
