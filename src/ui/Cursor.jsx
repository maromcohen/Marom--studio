import { useEffect, useRef } from 'react'
import { motion } from '../state/motion'

// Custom cursor: a crisp dot that sticks to the pointer and a lagging ring that
// breathes with scroll velocity. Interactive elements (a, button, [data-cursor])
// grow the ring and show an optional label ("view", "drag"…). Touch devices and
// reduced-motion users keep the native cursor — this layer simply never shows.
export default function Cursor() {
  const dotRef = useRef()
  const ringRef = useRef()
  const labelRef = useRef()

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    document.documentElement.classList.add('has-cursor')
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current

    let x = innerWidth / 2, y = innerHeight / 2
    let rx = x, ry = y
    let scale = 1, targetScale = 1
    let visible = false
    let raf = 0

    const onMove = (e) => {
      x = e.clientX; y = e.clientY
      if (!visible) { visible = true; rx = x; ry = y; dot.style.opacity = 1; ring.style.opacity = 1 }
      const el = e.target.closest('a, button, [data-cursor]')
      targetScale = el ? 2.6 : 1
      const text = el?.getAttribute('data-cursor') || ''
      if (label.textContent !== text) label.textContent = text
      label.style.opacity = text ? 1 : 0
    }
    const onLeave = () => { visible = false; dot.style.opacity = 0; ring.style.opacity = 0 }
    const onDown = () => { targetScale = Math.max(0.7, targetScale * 0.7) }
    const onUp = (e) => { onMove(e) }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      scale += (targetScale - scale) * 0.14
      const v = 1 + motion.velocity * 0.35     // ring breathes with scroll speed
      dot.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`
      ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${scale * v})`
    }
    raf = requestAnimationFrame(tick)

    addEventListener('pointermove', onMove, { passive: true })
    addEventListener('pointerdown', onDown, { passive: true })
    addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', onMove)
      removeEventListener('pointerdown', onDown)
      removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true"><span ref={labelRef} className="cursor-label" /></div>
    </>
  )
}
