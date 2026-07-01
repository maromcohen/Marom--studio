import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, AdaptiveDpr } from '@react-three/drei'
import CameraRig from './rig/CameraRig'
import Particles from './fx/Particles'
import Mood from './fx/Mood'
import PostFX from './fx/PostFX'
import Station from './worlds/Station'
import WorkGallery from './worlds/WorkGallery'
import Overlay from './ui/Overlay'
import Preloader from './ui/Preloader'
import Cursor from './ui/Cursor'
import Menu from './ui/Menu'
import Legal from './ui/Legal'
import A11y from './ui/A11y'
import { WORLDS, BG } from './data/worlds'

const mobile = typeof window !== 'undefined' && window.innerWidth < 768

function CookieNote() {
  const [seen, setSeen] = useState(() => {
    try { return localStorage.getItem('cookie-consent') === '1' } catch { return true }
  })
  if (seen) return null
  const ok = () => {
    try { localStorage.setItem('cookie-consent', '1') } catch {}
    setSeen(true)
  }
  return (
    <div className="cookie-note" role="region" aria-label="הודעת פרטיות">
      <p>אין כאן מעקב — האתר שומר על המכשיר שלכם רק את ההעדפות שלכם עצמכם (סאונד ונגישות).</p>
      <button onClick={ok}>הבנתי</button>
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [legal, setLegal] = useState(null)

  // lock scrolling until the curtain lifts
  useEffect(() => {
    document.documentElement.classList.toggle('loading', !ready)
  }, [ready])

  return (
    <>
      <Canvas
        dpr={[1, mobile ? 1 : 2]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 14], fov: 55, near: 0.1, far: 220 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh' }}
      >
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 8, 48]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 10]} intensity={0.85} color="#cdd6ff" />
        <pointLight position={[-8, -4, -10]} intensity={0.5} color="#ff8fd8" />

        <ScrollControls pages={WORLDS.length * 2 + 1} damping={0.4} enabled={ready}>
          <Mood />
          <CameraRig />
          <Particles count={mobile ? 700 : 1400} />
          {WORLDS.map((w) => (
            <Station key={w.id} world={w} />
          ))}
          <WorkGallery />
        </ScrollControls>

        <PostFX />
        <AdaptiveDpr pixelated />
      </Canvas>

      <Overlay onLegal={setLegal} />
      <Menu onLegal={setLegal} />
      <A11y onStatement={() => setLegal('a11y')} />
      <Legal doc={legal} onClose={() => setLegal(null)} />
      <CookieNote />
      <Cursor />
      <Preloader onDone={() => setReady(true)} />
      <div className="scroll-hint">גללו כדי להמריא</div>
    </>
  )
}
