import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLDS } from '../data/worlds'
import { motion } from '../state/motion'

// Lerp the fog + background colour toward the world the camera is currently in,
// so each section reads as a distinct atmosphere with no hard cut. On a world
// boundary crossing (motion.pulse) the fog flashes briefly toward the world's
// accent colour — the "burst" of diving into a new world.
export default function Mood() {
  const { scene } = useThree()
  const target = useMemo(() => new THREE.Color(), [])
  const accent = useMemo(() => new THREE.Color(), [])

  useFrame(() => {
    const w = WORLDS[motion.worldIndex]
    target.set(w.fog)
    if (motion.pulse > 0.01) {
      accent.set(w.color)
      target.lerp(accent, motion.pulse * 0.3)    // flash toward the accent
    }
    const k = 0.05 + motion.pulse * 0.25         // pulse pushes the lerp hard
    if (scene.fog) scene.fog.color.lerp(target, k)
    if (scene.background && scene.background.lerp) scene.background.lerp(target, k)
  })

  return null
}
