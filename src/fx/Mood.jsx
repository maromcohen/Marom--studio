import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { WORLDS } from '../data/worlds'

// Lerp the fog + background colour toward the world the camera is currently in,
// so each section reads as a distinct atmosphere with no hard cut.
export default function Mood() {
  const { scene } = useThree()
  const scroll = useScroll()
  const target = useMemo(() => new THREE.Color(), [])

  useFrame(() => {
    const f = THREE.MathUtils.clamp(scroll.offset, 0, 1) * (WORLDS.length - 1)
    const i = Math.min(WORLDS.length - 1, Math.round(f))
    target.set(WORLDS[i].fog)
    if (scene.fog) scene.fog.color.lerp(target, 0.035)
    if (scene.background && scene.background.lerp) scene.background.lerp(target, 0.035)
  })

  return null
}
