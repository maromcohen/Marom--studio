// The journey "The Ascent" — six worlds the camera flies through (Z descending).
// CDN assets reused from the previous build (Higgsfield-generated).
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FiJmqy12NASFK67PFaBPuFwpXv/'

export const BG = '#070710'

export const WORLDS = [
  {
    id: 'hero', z: 4, x: 0, y: 0, color: '#b38bff', fog: '#070710',
    eyebrow: 'DIGITAL STUDIO · TEL AVIV', title: 'MAROM',
    body: 'We design and develop premium digital experiences that elevate brands beyond the ordinary.',
    video: CDN + 'hf_20260630_172110_7c6ffccb-1e6a-4e7f-b667-982929c1a26b.mp4'
  },
  {
    id: 'about', z: -14, x: 1.6, y: 0.6, color: '#5ad1ff', fog: '#03121a',
    eyebrow: 'ABOUT', title: 'Crafting with purpose',
    body: 'A boutique digital studio in Tel Aviv. We partner with brands to build websites that don’t just look beautiful — they perform.',
    bg: CDN + 'hf_20260630_191502_e36683e7-9df5-4f1c-af2e-5e727a682397_min.webp'
  },
  {
    id: 'services', z: -28, x: -1.8, y: -0.5, color: '#ff8fd8', fog: '#170414',
    eyebrow: 'SERVICES', title: 'What we do',
    body: 'Web design · Development · Brand identity · Motion design · Creative direction.',
    bg: CDN + 'hf_20260630_191512_bea5b1af-6cbe-4973-b438-20774552f43c_min.webp'
  },
  {
    id: 'work', z: -42, x: 1.8, y: 0.4, color: '#9affd6', fog: '#04140d',
    eyebrow: 'WORK', title: 'Selected work',
    body: 'Cinematic, award-level websites for brands that refuse the ordinary.',
    bg: CDN + 'hf_20260630_191513_83acd9f8-e213-4a66-be61-bea8dc561257_min.webp'
  },
  {
    id: 'process', z: -56, x: -1.2, y: 0.5, color: '#8fb4ff', fog: '#060a1a',
    eyebrow: 'PROCESS', title: 'How we build',
    body: 'Intent over decoration. Every motion, every pixel earns its place. Performance is design.',
    bg: CDN + 'hf_20260630_191521_c8f0b364-6f41-4a5e-96ac-8070a5fb7b83_min.webp'
  },
  {
    id: 'contact', z: -70, x: 0, y: 0.8, color: '#ffd98f', fog: '#161003',
    eyebrow: 'CONTACT', title: 'Let’s build something',
    body: 'marom7777@icloud.com · Tel Aviv',
    bg: CDN + 'hf_20260630_191523_fd491970-6fb9-4f86-805f-574a20e6d88a_min.webp'
  }
]
