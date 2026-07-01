import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { WORLDS } from '../data/worlds'
import { motion, MOBILE, REDUCED } from '../state/motion'

const BASE_FOV = 55
const FOV_KICK = REDUCED ? 0 : MOBILE ? 6 : 13

// One continuous CatmullRom path that weaves through every world (single-take).
export default function CameraRig() {
  const scroll = useScroll()
  const { camera } = useThree()

  // expose the scroll element to the HTML overlay (dots nav)
  useEffect(() => { motion.scrollEl = scroll.el }, [scroll])

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

  useFrame((state, dt) => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1)
    const still = REDUCED || motion.frozen        // a11y: no sway, no kicks
    curve.getPointAt(t, pos)
    // subtle mouse parallax so the shot feels alive even when still
    if (!still) {
      pos.x += state.pointer.x * 0.7
      pos.y += state.pointer.y * 0.45
    }
    camera.position.lerp(pos, still ? 0.3 : 0.07)
    // always look a little further down the path → cinematic "flying forward"
    curve.getPointAt(Math.min(t + 0.045, 1), look)
    if (!still) look.x += state.pointer.x * 0.5
    camera.lookAt(look)

    // ---- shared motion state (velocity / world index / boundary pulse) ----
    motion.offset = t
    const vel = Math.min(1, Math.abs(scroll.delta) * 60)
    motion.velocity = THREE.MathUtils.lerp(motion.velocity, vel, 0.08)
    motion.pulse = Math.max(0, motion.pulse - dt * 2.2)

    // nearest world by camera depth (spacing along the path is not uniform)
    let nearest = 0, best = Infinity
    for (let i = 0; i < WORLDS.length; i++) {
      const d = Math.abs(camera.position.z - (WORLDS[i].z + 6))
      if (d < best) { best = d; nearest = i }
    }
    if (nearest !== motion.worldIndex) {
      motion.worldIndex = nearest
      if (!still) motion.pulse = 1          // flash on entering a new world
    }
    motion.arrival = THREE.MathUtils.clamp(1 - best / 9, 0, 1)

    // warp FOV kick — speed sensation while scrolling fast
    const targetFov = BASE_FOV + (still ? 0 : motion.velocity * FOV_KICK)
    if (Math.abs(camera.fov - targetFov) > 0.05) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.1)
      camera.updateProjectionMatrix()
    }
  })

  return null
}
