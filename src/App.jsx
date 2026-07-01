import { Canvas } from '@react-three/fiber'
import { ScrollControls, AdaptiveDpr } from '@react-three/drei'
import CameraRig from './rig/CameraRig'
import Particles from './fx/Particles'
import Mood from './fx/Mood'
import PostFX from './fx/PostFX'
import Station from './worlds/Station'
import Overlay from './ui/Overlay'
import { WORLDS, BG } from './data/worlds'

const mobile = typeof window !== 'undefined' && window.innerWidth < 768

export default function App() {
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

        <ScrollControls pages={WORLDS.length * 2} damping={0.4}>
          <Mood />
          <CameraRig />
          <Particles count={mobile ? 700 : 1400} />
          {WORLDS.map((w) => (
            <Station key={w.id} world={w} />
          ))}
        </ScrollControls>

        <PostFX />
        <AdaptiveDpr pixelated />
      </Canvas>
      <Overlay />
      <div className="scroll-hint">scroll to explore</div>
    </>
  )
}
