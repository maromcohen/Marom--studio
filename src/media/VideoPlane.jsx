import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

// THREE.VideoTexture mapped onto custom 3D geometry.
export default function VideoPlane({ src, width = 6, height = 3.4, ...props }) {
  const { texture, video } = useMemo(() => {
    const video = document.createElement('video')
    video.src = src
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    const texture = new THREE.VideoTexture(video)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    return { texture, video }
  }, [src])

  useEffect(() => {
    video.play().catch(() => {})
    return () => video.pause()
  }, [video])

  return (
    <mesh {...props}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} transparent />
    </mesh>
  )
}
