import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { motion, MOBILE, REDUCED } from '../state/motion'

// The film look: soft bloom on headlines/particles/portal rims, cinematic grain,
// vignette, and a chromatic-aberration kick that scales with scroll velocity.
// Mobile keeps the grade (bloom+grain+vignette) but drops CA and multisampling.
export default function PostFX() {
  const bloomRef = useRef()
  // the effect keeps this exact Vector2 instance as its uniform → mutate per frame
  const caOffset = useMemo(() => new THREE.Vector2(0.0005, 0.0003), [])

  useFrame(() => {
    if (REDUCED) return
    const v = motion.velocity
    const o = 0.0005 + v * 0.0038 + motion.pulse * 0.0022
    caOffset.set(o, o * 0.6)
    if (bloomRef.current) {
      bloomRef.current.intensity = (MOBILE ? 0.4 : 0.6) + v * 0.9 + motion.pulse * 0.7
    }
  })

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        ref={bloomRef}
        intensity={MOBILE ? 0.4 : 0.6}
        luminanceThreshold={0.32}
        luminanceSmoothing={0.28}
        mipmapBlur
        radius={0.72}
      />
      {!MOBILE && (
        <ChromaticAberration
          offset={caOffset}
          radialModulation
          modulationOffset={0.35}
        />
      )}
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={MOBILE ? 0.55 : 0.85} />
      <Vignette eskil={false} offset={0.18} darkness={0.78} />
    </EffectComposer>
  )
}
