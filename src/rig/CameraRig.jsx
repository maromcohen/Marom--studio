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
    // gentle, mostly-centred path: approach each world head-on so its text frames,
    // with a soft lateral/vertical sway for life
    pts.push(new THREE.Vector3(0, 0, WORLDS[0].z + 10))
    WORLDS.forEach((w, i) => {
      pts.push(new THREE.Vector3(Math.sin(i * 1.7) * 0.6, Math.cos(i * 1.3) * 0.3, w.z + 6))
    })
    pts.push(new THREE.Vector3(0, 0, WORLDS[WORLDS.length - 1].z - 5))
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.3)
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
