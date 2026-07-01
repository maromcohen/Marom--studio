import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from '../state/motion'

// A cinematic video PORTAL: the Higgsfield world seen through a soft elliptical
// aperture that melts into the fog (no hard rectangle), with a rim of the world's
// accent colour that flares as the camera dives through it. Keeps the 2.5D
// mouse-parallax (luminance pseudo-depth) and pauses decode when far away.
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uMouse;
  uniform float uStrength;
  uniform float uOpacity;
  uniform vec3 uRimColor;
  uniform float uRim;        // rim glow intensity (proximity + crossing flare)
  varying vec2 vUv;
  void main(){
    vec2 q = vUv * 2.0 - 1.0;                       // -1..1 across the plane
    float r = length(q * vec2(1.0, 1.12));          // slightly tighter vertically
    vec3 base = texture2D(uMap, vUv).rgb;
    float depth = dot(base, vec3(0.299, 0.587, 0.114));   // luminance as pseudo depth
    vec2 offset = uMouse * (depth - 0.5) * uStrength;
    vec3 col = texture2D(uMap, vUv + offset).rgb;

    float mask = smoothstep(1.0, 0.55, r);          // soft elliptical aperture
    float rim  = smoothstep(0.55, 0.92, r) * smoothstep(1.08, 0.92, r);
    col += uRimColor * rim * uRim;

    float alpha = mask * uOpacity + rim * uRim * 0.55;
    gl_FragColor = vec4(col, alpha);
  }
`

export default function VideoPortal({ src, color = '#b38bff', width = 8, height = 4.6, strength = 0.07, opacity = 1, ...props }) {
  const matRef = useRef()
  const meshRef = useRef()
  const tmp = useMemo(() => new THREE.Vector3(), [])

  const { texture, video } = useMemo(() => {
    const video = document.createElement('video')
    video.src = src
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    video.preload = 'auto'
    const texture = new THREE.VideoTexture(video)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    return { texture, video }
  }, [src])

  useEffect(() => {
    video.play().catch(() => {})
    return () => { video.pause(); video.src = '' }
  }, [video])

  const uniforms = useMemo(() => ({
    uMap: { value: texture },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uStrength: { value: strength },
    uOpacity: { value: opacity },
    uRimColor: { value: new THREE.Color(color) },
    uRim: { value: 0.25 }
  }), [texture, strength, opacity, color])

  useFrame((s) => {
    if (matRef.current) matRef.current.uniforms.uMouse.value.lerp(s.pointer, 0.06)
    if (meshRef.current) {
      meshRef.current.getWorldPosition(tmp)
      const dz = tmp.z - s.camera.position.z
      const adz = Math.abs(dz)
      // pause decode when the portal is far from the camera
      if (adz > 24) { if (!video.paused) video.pause() }
      else if (video.paused) video.play().catch(() => {})
      if (matRef.current) {
        // rim breathes with proximity and FLARES as the camera crosses the portal
        const near = THREE.MathUtils.clamp(1 - adz / 16, 0, 1)
        const crossing = THREE.MathUtils.clamp(1 - adz / 2.4, 0, 1)
        const target = 0.22 + near * 0.55 + crossing * 1.6 + motion.pulse * 0.4
        const u = matRef.current.uniforms.uRim
        u.value = THREE.MathUtils.lerp(u.value, target, 0.12)
      }
    }
  })

  return (
    <mesh ref={meshRef} {...props}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        toneMapped={false}
      />
    </mesh>
  )
}
