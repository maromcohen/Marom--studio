import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import SpatialText from '../ui/SpatialText'
import VideoPortal from '../media/VideoPortal'
import { FONT_SERIF, FONT_SANS, FONT_SANS_MED } from '../ui/fonts'
import { MOBILE, REDUCED } from '../state/motion'

// portrait phones see only ~2.5 world-units of width at the station —
// scale the type down and let titles wrap so nothing crops
const TS = MOBILE ? 0.55 : 1
const TITLE_MAX = MOBILE ? 2.5 : 40
const BODY_MAX = MOBILE ? 2.3 : 6.4

// A "station" along the camera path: a cinematic Higgsfield video PORTAL the
// camera flies toward and through, with living 3D headlines that breathe in as
// you arrive and dissolve as you pass through them.
export default function Station({ world }) {
  const isHero = world.id === 'hero'
  const textGroup = useRef()
  const eyebrowRef = useRef()
  const titleRef = useRef()
  const bodyRef = useRef()
  const fade = useRef(isHero ? 1 : 0)

  useFrame((s) => {
    if (REDUCED) return
    // signed distance from camera to the text plane (positive = still ahead of us)
    const d = s.camera.position.z - (world.z + 0.8)
    // breathe in on approach (14→5), dissolve while passing through (±1.4)
    const appear = THREE.MathUtils.smoothstep(-d, -14, -5)
    const through = THREE.MathUtils.smoothstep(d, -1.4, 1.4)
    const target = appear * through
    const f = fade.current = THREE.MathUtils.lerp(fade.current, target, 0.08)

    // cheap transforms only — no troika re-layout per frame
    if (textGroup.current) {
      textGroup.current.position.y = (f - 1) * 0.4
      textGroup.current.scale.setScalar(0.965 + f * 0.035)
    }
    if (eyebrowRef.current) {
      eyebrowRef.current.fillOpacity = 0.9 * f
      eyebrowRef.current.scale.x = 1 + f * 0.12          // tracking "expands" on arrival
    }
    if (titleRef.current) titleRef.current.fillOpacity = f
    if (bodyRef.current) bodyRef.current.fillOpacity = 0.9 * f
  })

  return (
    <group position={[world.x || 0, world.y || 0, world.z]}>
      {/* the AI-generated cinematic world — a soft-edged portal with a glowing rim */}
      {world.video && (
        <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.4}>
          <VideoPortal
            src={world.video}
            color={world.color}
            position={[0, 0, -3.6]}
            width={isHero ? 15 : 17}
            height={isHero ? 8.4 : 9.6}
            strength={0.06}
            opacity={0.96}
          />
        </Float>
      )}

      <Suspense fallback={null}>
        <group ref={textGroup}>
          <SpatialText ref={eyebrowRef} font={FONT_SANS_MED} position={[0, MOBILE ? 1.85 : 1.5, 0.8]} fontSize={0.2 * TS} color="#eaf0ff" letterSpacing={0.3} fillOpacity={0.9}>
            {world.eyebrow}
          </SpatialText>
          <SpatialText ref={titleRef} font={FONT_SERIF} position={[0, 0.55, 0.8]} fontSize={(isHero ? (MOBILE ? 1.45 : 1.7) : 0.9) * TS} color="#ffffff" letterSpacing={isHero ? 0.18 : 0.02} maxWidth={TITLE_MAX} textAlign="center" lineHeight={1.12}>
            {world.title}
          </SpatialText>
          <SpatialText ref={bodyRef} font={FONT_SANS} position={[0, MOBILE ? -1.4 : -1.2, 0.8]} fontSize={0.19 * (MOBILE ? 0.7 : 1)} color="#c3ccec" maxWidth={BODY_MAX} textAlign="center" lineHeight={1.5} fillOpacity={0.9}>
            {world.body}
          </SpatialText>
        </group>
      </Suspense>
    </group>
  )
}
