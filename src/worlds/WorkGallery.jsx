import { Component, Suspense, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Float } from '@react-three/drei'
import * as THREE from 'three'
import SpatialText from '../ui/SpatialText'
import { FONT_SERIF, FONT_SANS_MED } from '../ui/fonts'
import { MOBILE, REDUCED, motion } from '../state/motion'
import { PROJECTS } from '../data/worlds'

// A flythrough gallery: project cards staggered left/right along the camera
// path after the WORK station, so the journey drifts past each piece. Cards
// rest slightly dimmed and desaturated; pointer hover (or camera proximity on
// touch) wakes them — full colour, a zoom breath and an accent rim.
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uHover;      // 0 asleep → 1 awake
  uniform float uReveal;     // 0 hidden → 1 revealed (camera proximity)
  uniform vec3 uRimColor;
  varying vec2 vUv;
  void main(){
    // zoom breath toward the centre as the card wakes
    vec2 uv = (vUv - 0.5) * (1.0 - uHover * 0.06) + 0.5;
    // subtle chromatic split while waking
    float split = uHover * 0.006;
    vec3 col;
    col.r = texture2D(uMap, uv + vec2(split, 0.0)).r;
    col.g = texture2D(uMap, uv).g;
    col.b = texture2D(uMap, uv - vec2(split, 0.0)).b;
    // asleep: slightly dimmed + desaturated (still clearly present in the dark)
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(mix(vec3(lum), col, 0.55) * 0.8, col, uHover);
    // soft rounded-edge vignette mask
    vec2 q = abs(vUv * 2.0 - 1.0);
    float edge = smoothstep(1.0, 0.92, max(q.x, q.y));
    // accent rim on the frame while awake
    float rim = smoothstep(0.86, 0.98, max(q.x, q.y)) * edge;
    col += uRimColor * rim * uHover * 0.9;
    gl_FragColor = vec4(col, edge * uReveal);
  }
`

function WorkCard({ project, index }) {
  const matRef = useRef()
  const meshRef = useRef()
  const groupRef = useRef()
  const titleRef = useRef()
  const tagRef = useRef()
  const hover = useRef(0)
  const hovered = useRef(false)
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const texture = useTexture(project.image)
  texture.colorSpace = THREE.SRGBColorSpace

  const uniforms = useMemo(() => ({
    uMap: { value: texture },
    uHover: { value: 0 },
    uReveal: { value: 0 },
    uRimColor: { value: new THREE.Color(project.color) }
  }), [texture, project.color])

  const W = MOBILE ? 2.3 : 4.6
  const H = W * 0.5625

  useFrame((s) => {
    if (!meshRef.current) return
    meshRef.current.getWorldPosition(tmp)
    // signed distance: positive while the card is still ahead of the camera
    const d = s.camera.position.z - tmp.z
    const ad = Math.abs(d)
    // reveal on approach (16→6 units out), dissolve right as the camera passes
    const appear = THREE.MathUtils.smoothstep(-d, -16, -6)
    const through = THREE.MathUtils.smoothstep(d, -1.2, 1.2)
    const reveal = appear * through
    // touch devices have no hover — proximity wakes the card instead
    const near = THREE.MathUtils.clamp(1 - ad / 7, 0, 1)
    const wake = hovered.current ? 1 : near * (MOBILE ? 1 : 0.55)
    const h = hover.current = THREE.MathUtils.lerp(hover.current, wake, 0.08)

    if (matRef.current) {
      matRef.current.uniforms.uHover.value = h
      matRef.current.uniforms.uReveal.value = reveal
    }
    if (groupRef.current && !REDUCED) {
      // lean gently toward the camera while awake
      const lean = (index % 2 === 0 ? 1 : -1) * (0.22 - h * 0.16)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, lean, 0.08)
    }
    if (titleRef.current) titleRef.current.fillOpacity = reveal * (0.55 + h * 0.45)
    if (tagRef.current) tagRef.current.fillOpacity = reveal * (0.35 + h * 0.5)

    if (hovered.current !== (motion.hoverWork === index)) {
      motion.hoverWork = hovered.current ? index : (motion.hoverWork === index ? -1 : motion.hoverWork)
    }
  })

  return (
    <group position={project.pos} ref={groupRef}>
      <Float speed={0.7} rotationIntensity={0.04} floatIntensity={0.35}>
        <mesh
          ref={meshRef}
          onPointerOver={() => { hovered.current = true; document.documentElement.classList.add('cursor-view') }}
          onPointerOut={() => { hovered.current = false; document.documentElement.classList.remove('cursor-view') }}
        >
          <planeGeometry args={[W, H]} />
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            ref={matRef}
            transparent
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
        <SpatialText ref={titleRef} font={FONT_SERIF} position={[0, -H / 2 - 0.32, 0]} fontSize={MOBILE ? 0.17 : 0.26} color="#ffffff" letterSpacing={0.06} fillOpacity={0}>
          {project.title}
        </SpatialText>
        <SpatialText ref={tagRef} font={FONT_SANS_MED} position={[0, -H / 2 - (MOBILE ? 0.58 : 0.68), 0]} fontSize={MOBILE ? 0.095 : 0.12} color="#c3ccec" letterSpacing={0.06} fillOpacity={0}>
          {project.tag}
        </SpatialText>
      </Float>
    </group>
  )
}

// a failed texture fetch must never take the whole experience down — the
// card simply doesn't render
class CardBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

export default function WorkGallery() {
  return (
    <>
      {PROJECTS.map((p, i) => (
        <CardBoundary key={p.title}>
          <Suspense fallback={null}>
            <WorkCard project={p} index={i} />
          </Suspense>
        </CardBoundary>
      ))}
    </>
  )
}
