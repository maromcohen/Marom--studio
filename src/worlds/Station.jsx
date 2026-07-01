import { Suspense } from 'react'
import { Float } from '@react-three/drei'
import SpatialText from '../ui/SpatialText'
import ParallaxVideo from '../media/ParallaxVideo'

// A "station" along the camera path: floating 3D headline + a luminous structure,
// with an optional Higgsfield parallax-video backdrop. No HTML boxes — all native 3D.
export default function Station({ world }) {
  const isHero = world.id === 'hero'
  return (
    <group position={[world.x || 0, world.y || 0, world.z]}>
      {world.video && (
        <ParallaxVideo src={world.video} position={[0, 0, -3.4]} width={10} height={5.6} strength={0.05} opacity={0.9} />
      )}

      <Float speed={1.3} rotationIntensity={0.7} floatIntensity={0.9}>
        <mesh position={[0, isHero ? -0.2 : 0, isHero ? -1.2 : 0]}>
          <icosahedronGeometry args={[isHero ? 1.6 : 1.25, 0]} />
          <meshStandardMaterial
            color={world.color}
            emissive={world.color}
            emissiveIntensity={0.55}
            metalness={0.7}
            roughness={0.18}
            flatShading
            transparent
            opacity={0.82}
          />
        </mesh>
      </Float>

      <Suspense fallback={null}>
        <SpatialText position={[0, 2.1, 0.6]} fontSize={0.22} color="#cfd6ff" letterSpacing={0.28} fillOpacity={0.85}>
          {world.eyebrow}
        </SpatialText>
        <SpatialText position={[0, 1.1, 0.6]} fontSize={isHero ? 1.7 : 0.82} color={world.color} letterSpacing={isHero ? 0.18 : 0.02}>
          {world.title}
        </SpatialText>
        <SpatialText position={[0, -1.8, 0.6]} fontSize={0.2} color="#9aa6c0" maxWidth={6.2} textAlign="center" lineHeight={1.5}>
          {world.body}
        </SpatialText>
      </Suspense>
    </group>
  )
}
