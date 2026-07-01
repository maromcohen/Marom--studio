import { useEffect, useRef, useState } from 'react'
import { WORLDS } from '../data/worlds'
import { motion, goToWorld } from '../state/motion'
import { isSoundOn, toggleSound } from '../audio/sound'

// Fixed HTML layer over the 3D canvas: wordmark, world-dots nav, progress bar,
// sound toggle, a contact CTA and legal footer links on the last world. The
// container never captures input (pointer-events:none) — only the interactive
// bits do.
export default function Overlay({ onLegal }) {
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

  const last = wi === WORLDS.length - 1

  return (
    <div className="overlay">
      <a className={`wordmark${wi === 0 ? ' hidden' : ''}`} href="#top" onClick={(e) => { e.preventDefault(); goToWorld(WORLDS, 0) }}>MAROM</a>

      <nav className="dots" aria-label="Worlds">
        {WORLDS.map((w, i) => (
          <button
            key={w.id}
            className={`dot${i === wi ? ' active' : ''}`}
            style={{ '--c': w.color }}
            onClick={() => goToWorld(WORLDS, i)}
            aria-label={w.eyebrow}
          >
            <span className="dot-label">{w.eyebrow.split('·')[0].trim()}</span>
          </button>
        ))}
      </nav>

      <button className="sound-toggle" onClick={() => setSound(toggleSound())} aria-pressed={sound} aria-label="הפעלת סאונד">
        {sound ? '♪ פועל' : '♪ כבוי'}
      </button>

      <div className={`contact-block${last ? ' show' : ''}`}>
        <a className="cta" href="mailto:marom7777@icloud.com" data-cursor="שלום">דברו איתנו ←</a>
        <a className="cta-alt" href="https://wa.me/972532748125" target="_blank" rel="noopener noreferrer">וואטסאפ</a>
        <div className="foot-legal">
          <button onClick={() => onLegal('privacy')}>פרטיות</button>
          <button onClick={() => onLegal('terms')}>תקנון</button>
          <button onClick={() => onLegal('a11y')}>נגישות</button>
          <span>© MAROM · תל אביב</span>
        </div>
      </div>

      <div className="progress"><div ref={barRef} className="progress-bar" /></div>
    </div>
  )
}
