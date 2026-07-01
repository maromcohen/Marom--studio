import { useEffect, useRef, useState } from 'react'
import { motion } from '../state/motion'

// ווידג'ט נגישות בתקן הישראלי (ת"י 5568) — כל 17 הפיצ'רים, נשמר ב-localStorage
// תחת "a11y". פילטרים (ניגודיות / אפור / היפוך) חלים על כל העמוד כולל קנבס
// ה-WebGL; אפשרויות גופן ומרווח פועלות על שכבות ה-HTML; "עצירת אנימציות"
// מקפיאה את המצלמה, הפוסט-אפקטים ואנימציות ה-CSS דרך motion.frozen.
const KEY = 'a11y'
const TOGGLES = ['contrast', 'gray', 'invert', 'noimages', 'links', 'headings', 'focus', 'guide', 'bigcur', 'readable', 'dyslexia', 'stop', 'spacing', 'letters']

const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} } }

function apply(state, guideEl) {
  const root = document.documentElement
  root.classList.toggle('a11y-fs1', state.fs === 1)
  root.classList.toggle('a11y-fs2', state.fs === 2)
  TOGGLES.forEach((k) => root.classList.toggle('a11y-' + k, !!state[k]))
  if (guideEl) guideEl.style.display = state.guide ? 'block' : 'none'
  motion.frozen = !!state.stop
  motion.noMedia = !!state.noimages
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
}

const SECTIONS = [
  {
    label: 'גודל תצוגה',
    items: [
      { k: 'fontUp', ico: 'A+', label: 'הגדל טקסט' },
      { k: 'fontDown', ico: 'A-', label: 'הקטן טקסט' },
      { k: 'spacing', ico: '☰', label: 'מרווח שורות' },
      { k: 'letters', ico: 'a‥b', label: 'מרווח אותיות' }
    ]
  },
  {
    label: 'צבעים ותצוגה',
    items: [
      { k: 'contrast', ico: '◑', label: 'ניגודיות גבוהה' },
      { k: 'gray', ico: '◐', label: 'גווני אפור' },
      { k: 'invert', ico: '◕', label: 'היפוך צבעים' },
      { k: 'noimages', ico: '⊘', label: 'הסתרת מדיה' }
    ]
  },
  {
    label: 'ניווט וקריאה',
    items: [
      { k: 'links', ico: '⌁', label: 'הדגשת קישורים' },
      { k: 'headings', ico: 'H', label: 'הדגשת כותרות' },
      { k: 'focus', ico: '⊡', label: 'הדגשת פוקוס' },
      { k: 'guide', ico: '─', label: 'קו הנחיה לקריאה' },
      { k: 'bigcur', ico: '↖', label: 'סמן גדול' },
      { k: 'readable', ico: 'Aa', label: 'גופן קריא' },
      { k: 'dyslexia', ico: 'Dy', label: 'גופן לדיסלקטים' },
      { k: 'stop', ico: '⏸', label: 'עצירת אנימציות' }
    ]
  }
]

export default function A11y({ onStatement }) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState(load)
  const fabRef = useRef()
  const panelRef = useRef()
  const guideRef = useRef()

  useEffect(() => { apply(state, guideRef.current) }, [state])

  // קו ההנחיה עוקב אחרי הסמן
  useEffect(() => {
    if (!state.guide) return
    const onMove = (e) => { if (guideRef.current) guideRef.current.style.top = e.clientY + 'px' }
    addEventListener('pointermove', onMove, { passive: true })
    return () => removeEventListener('pointermove', onMove)
  }, [state.guide])

  // לחיצה מחוץ לפאנל סוגרת — contains() כדי שגם ילדי ה-SVG של הכפתור ייחשבו
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (!fabRef.current.contains(e.target) && !panelRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); fabRef.current?.focus() } }
    document.addEventListener('pointerdown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  const act = (k) => {
    setState((s) => {
      if (k === 'fontUp') return { ...s, fs: Math.min(2, (s.fs || 0) + 1) }
      if (k === 'fontDown') return { ...s, fs: Math.max(0, (s.fs || 0) - 1) }
      if (k === 'reset') return {}
      return { ...s, [k]: !s[k] }
    })
  }

  const on = (k) => (k === 'fontUp' || k === 'fontDown' ? (state.fs || 0) > 0 : !!state[k])

  return (
    <>
      <button
        ref={fabRef}
        className="a11y-fab"
        onClick={() => setOpen(!open)}
        aria-label="תפריט נגישות"
        aria-expanded={open}
        aria-controls="a11y-panel"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="4.5" r="2.2" />
          <path d="M12 8c-.6 0-4.6-.5-6.7-.8a.9.9 0 0 0-1 .8.9.9 0 0 0 .8 1l5 .7c.3 0 .5.3.5.6v1.9c0 .3 0 .6-.2.9l-2.8 6a.95.95 0 0 0 .5 1.3.95.95 0 0 0 1.2-.5l2.4-5.2c.1-.2.5-.2.6 0l2.4 5.2a.95.95 0 0 0 1.2.5.95.95 0 0 0 .5-1.3l-2.8-6a2.2 2.2 0 0 1-.2-.9v-1.9c0-.3.2-.6.5-.6l5-.7a.9.9 0 0 0 .8-1 .9.9 0 0 0-1-.8C16.6 7.5 12.6 8 12 8z" />
        </svg>
      </button>

      <div ref={panelRef} id="a11y-panel" className={`a11y-panel${open ? ' open' : ''}`} role="dialog" aria-label="הגדרות נגישות">
        <h4>תפריט נגישות</h4>
        {SECTIONS.map((sec) => (
          <div key={sec.label}>
            <h5>{sec.label}</h5>
            <div className="a11y-grid">
              {sec.items.map((it) => (
                <button key={it.k} type="button" className={on(it.k) ? 'on' : ''} onClick={() => act(it.k)} aria-pressed={on(it.k)}>
                  <span className="a11y-ico" aria-hidden="true">{it.ico}</span>{it.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="a11y-grid" style={{ marginTop: 10 }}>
          <button type="button" className="a11y-reset" onClick={() => act('reset')}>
            <span className="a11y-ico" aria-hidden="true">↺</span>איפוס כל ההגדרות
          </button>
        </div>
        <button type="button" className="a11y-statement" onClick={() => { setOpen(false); onStatement() }}>
          הצהרת נגישות
        </button>
      </div>

      <div ref={guideRef} className="a11y-reading-guide" aria-hidden="true" />
    </>
  )
}
