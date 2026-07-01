import { Suspense } from 'react'
import { Float } from '@react-three/drei'
import SpatialText from '../ui/SpatialText'
import ParallaxVideo from '../media/ParallaxVideo'
import { FONT_SERIF, FONT_SANS, FONT_SANS_MED } from '../ui/fonts'

// A "station" along the camera path: a large cinematic Higgsfield video world
// the camera flies toward and through, with floating 3D headlines in front.
export default function Station({ world }) {
  const isHero = world.id === 'hero'
  return (
    <group position={[world.x || 0, world.y || 0, world.z]}>
      {/* the AI-generated cinematic world — big parallax video plane */}
      {world.video && (
        <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.4}>
          <ParallaxVideo
            src={world.video}
            position={[0, 0, -3.6]}
            width={isHero ? 15 : 17}
            height={isHero ? 8.4 : 9.6}
            strength={0.06}
            opacity={0.96}
          />
        </Float>
      )}

      <Suspense fallback={null}>
        <SpatialText font={FONT_SANS_MED} position={[0, 1.5, 0.8]} fontSize={0.2} color="#eaf0ff" letterSpacing={0.3} fillOpacity={0.9}>
          {world.eyebrow}
        </SpatialText>
        <SpatialText font={FONT_SERIF} position={[0, 0.55, 0.8]} fontSize={isHero ? 1.7 : 0.9} color="#ffffff" letterSpacing={isHero ? 0.18 : 0.02}>
          {world.title}
        </SpatialText>
        <SpatialText font={FONT_SANS} position={[0, -1.2, 0.8]} fontSize={0.19} color="#c3ccec" maxWidth={6.4} textAlign="center" lineHeight={1.5} fillOpacity={0.9}>
          {world.body}
        </SpatialText>
      </Suspense>
    </group>
  )
}
