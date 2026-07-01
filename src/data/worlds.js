// The journey "The Ascent" — six cinematic Higgsfield video worlds the
// camera flies through (Z descending). No procedural geometry — each world
// is an AI-generated moving environment.
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FiJmqy12NASFK67PFaBPuFwpXv/'

export const BG = '#050509'

export const WORLDS = [
  {
    id: 'hero', z: 4, x: 0, y: 0, color: '#b38bff', fog: '#070710',
    eyebrow: 'DIGITAL STUDIO · TEL AVIV', title: 'MAROM',
    body: 'We design and develop premium digital experiences that elevate brands beyond the ordinary.',
    video: CDN + 'hf_20260630_172110_7c6ffccb-1e6a-4e7f-b667-982929c1a26b.mp4'
  },
  {
    id: 'about', z: -14, x: 1.2, y: 0.4, color: '#5ad1ff', fog: '#03121a',
    eyebrow: 'ABOUT', title: 'Crafting with purpose',
    body: 'A boutique digital studio in Tel Aviv. We partner with brands to build websites that don’t just look beautiful — they perform.',
    video: CDN + 'hf_20260701_033400_0fbb1273-54a9-499e-9c30-7fd0b986edb6.mp4'
  },
  {
    id: 'services', z: -28, x: -1.2, y: -0.3, color: '#ff8fd8', fog: '#170414',
    eyebrow: 'SERVICES', title: 'What we do',
    body: 'Web design · Development · Brand identity · Motion design · Creative direction.',
    video: CDN + 'hf_20260701_033401_3cfc3e8f-953a-4088-a967-306c801292f8.mp4'
  },
  {
    id: 'work', z: -42, x: 1.2, y: 0.3, color: '#9affd6', fog: '#04140d',
    eyebrow: 'WORK', title: 'Selected work',
    body: 'Cinematic, award-level websites for brands that refuse the ordinary.',
    video: CDN + 'hf_20260701_033411_116372ec-9d98-46e5-8415-cfad080da25b.mp4'
  },
  {
    id: 'process', z: -56, x: -1.0, y: 0.4, color: '#8fb4ff', fog: '#060a1a',
    eyebrow: 'PROCESS', title: 'How we build',
    body: 'Intent over decoration. Every motion, every pixel earns its place. Performance is design.',
    video: CDN + 'hf_20260701_033413_95d33aca-d35b-4b31-84d4-f748066eda9d.mp4'
  },
  {
    id: 'contact', z: -70, x: 0, y: 0.5, color: '#ffd98f', fog: '#161003',
    eyebrow: 'CONTACT', title: 'Let’s build something',
    body: 'marom7777@icloud.com · Tel Aviv',
    video: CDN + 'hf_20260701_033421_714ba4f5-1e06-401c-b5c7-115f74b28bf9.mp4'
  }
]
