import { useCallback, useEffect, useRef, useState } from 'react'
import { WORLDS } from '../data/worlds'
import { goToWorld } from '../state/motion'

// Fullscreen navigation: a two-line burger that morphs to an ✕, a curtain that
// sweeps in, and oversized serif destinations that stagger up line by line.
// Focus is trapped while open; Escape closes and returns focus to the burger.
export default function Menu({ onLegal }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef()
  const burgerRef = useRef()

  const close = useCallback(() => {
    setOpen(false)
    burgerRef.current?.focus()
  }, [])

  const go = (i) => {
    setOpen(false)
    goToWorld(WORLDS, i)
  }

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    panel.querySelector('a, button')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { close(); return }
      if (e.key !== 'Tab') return
      const items = [...panel.querySelectorAll('a[href], button:not([disabled])')]
      if (!items.length) return
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  return (
    <>
      <button
        ref={burgerRef}
        className={`burger${open ? ' open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
      >
        <span /><span />
      </button>

      <div ref={panelRef} id="site-menu" className={`menu${open ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="ניווט">
        <div className="menu-bg" onClick={close} />
        <nav className="menu-nav" aria-label="חלקי האתר">
          {WORLDS.map((w, i) => (
            <button key={w.id} className="menu-item" style={{ '--c': w.color, '--i': i }} onClick={() => go(i)}>
              <span className="menu-index">0{i + 1}</span>
              <span className="menu-title">{w.menu || w.title}</span>
            </button>
          ))}
        </nav>
        <div className="menu-foot">
          <a href="mailto:marom7777@icloud.com">marom7777@icloud.com</a>
          <a href="https://wa.me/972532748125" target="_blank" rel="noopener noreferrer">וואטסאפ</a>
          <button onClick={() => { setOpen(false); onLegal('privacy') }}>פרטיות</button>
          <button onClick={() => { setOpen(false); onLegal('terms') }}>תקנון</button>
          <button onClick={() => { setOpen(false); onLegal('a11y') }}>נגישות</button>
        </div>
      </div>
    </>
  )
}
