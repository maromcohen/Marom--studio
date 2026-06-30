import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { WORLDS } from '../data/worlds'

// One continuous CatmullRom path that weaves through every world (single-take).
export default function CameraRig() {
  const scroll = useScroll()
  const { camera } = useThree()

  const curve = useMemo(() => {
    const pts = []
    // start slightly in front of the first world, then thread between worlds with lateral sway
    pts.push(new THREE.Vector3(0, 0, WORLDS[0].z + 9))
    WORLDS.forEach((w, i) => {
      const sway = i % 2 === 0 ? 1 : -1
      pts.push(new THREE.Vector3((w.x || 0) + sway * 1.4, (w.y || 0) + 0.6, w.z + 5))
    })
    pts.push(new THREE.Vector3(0, 0.4, WORLDS[WORLDS.length - 1].z - 6))
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4)
  }, [])

  const pos = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1)
    curve.getPointAt(t, pos)
    // subtle mouse parallax so the shot feels alive even when still
    pos.x += state.pointer.x * 0.7
    pos.y += state.pointer.y * 0.45
    camera.position.lerp(pos, 0.07)
    // always look a little further down the path → cinematic "flying forward"
    curve.getPointAt(Math.min(t + 0.045, 1), look)
    look.x += state.pointer.x * 0.5
    camera.lookAt(look)
  })

  return null
}
