// המסע — שישה עולמות וידאו קולנועיים (Higgsfield) שהמצלמה טסה דרכם
// (Z יורד). בלי גאומטריה פרוצדורלית — כל עולם הוא סביבה חיה שנוצרה ב-AI,
// ממורכזת על מסלול המצלמה.
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FiJmqy12NASFK67PFaBPuFwpXv/'

export const BG = '#050509'

const MOBILE = typeof window !== 'undefined' && window.innerWidth < 768

export const WORLDS = [
  {
    id: 'hero', z: 4, x: 0, y: 0, color: '#b38bff', fog: '#070710',
    eyebrow: 'סטודיו דיגיטלי · תל אביב', title: 'MAROM', menu: 'בית', brand: true,
    body: 'אנחנו מעצבים ומפתחים חוויות דיגיטליות ברמה קולנועית — אתרים שמרימים מותגים מעל הרגיל.',
    video: CDN + 'hf_20260630_172110_7c6ffccb-1e6a-4e7f-b667-982929c1a26b.mp4'
  },
  {
    id: 'about', z: -14, x: 0, y: 0, color: '#5ad1ff', fog: '#03121a',
    eyebrow: 'עלינו', title: 'יוצרים עם כוונה', menu: 'עלינו',
    body: 'סטודיו בוטיק בתל אביב. אנחנו שותפים של מותגים לבניית אתרים שלא רק נראים מדהים — הם עובדים.',
    video: CDN + 'hf_20260701_033400_0fbb1273-54a9-499e-9c30-7fd0b986edb6.mp4'
  },
  {
    id: 'services', z: -32, x: 0, y: 0, color: '#ff8fd8', fog: '#170414',
    eyebrow: 'שירותים', title: 'מה אנחנו עושים', menu: 'שירותים',
    body: 'עיצוב אתרים · פיתוח · שפה מותגית · מושן דיזיין · הכוונה קריאטיבית.',
    video: CDN + 'hf_20260701_033401_3cfc3e8f-953a-4088-a967-306c801292f8.mp4'
  },
  {
    id: 'work', z: -50, x: 0, y: 0, color: '#9affd6', fog: '#04140d',
    eyebrow: 'עבודות', title: 'עבודות נבחרות', menu: 'עבודות',
    body: 'אתרים קולנועיים, ברמה של פרסים, למותגים שמסרבים לרגיל. המשיכו לטוס — הפרויקטים חולפים לצידכם.',
    video: CDN + 'hf_20260701_033411_116372ec-9d98-46e5-8415-cfad080da25b.mp4'
  },
  {
    id: 'process', z: -78, x: 0, y: 0, color: '#8fb4ff', fog: '#060a1a',
    eyebrow: 'תהליך', title: 'איך אנחנו בונים', menu: 'תהליך',
    body: 'כוונה לפני קישוט. כל תנועה וכל פיקסל מרוויחים את מקומם. ביצועים הם עיצוב.',
    video: CDN + 'hf_20260701_033413_95d33aca-d35b-4b31-84d4-f748066eda9d.mp4'
  },
  {
    id: 'contact', z: -96, x: 0, y: 0, color: '#ffd98f', fog: '#161003',
    eyebrow: 'צרו קשר', title: 'בואו נבנה משהו ביחד', menu: 'צרו קשר',
    body: 'marom7777@icloud.com · תל אביב',
    video: CDN + 'hf_20260701_033421_714ba4f5-1e06-401c-b5c7-115f74b28bf9.mp4'
  }
]

// גלריית התעופה — סטילס פורטפוליו שנוצרו ב-Higgsfield, מפוזרים ימינה
// ושמאלה לאורך המסלול בין "עבודות" ל"תהליך".
const GX = MOBILE ? 1.05 : 2.55
export const PROJECTS = [
  {
    title: 'Cocktails & Dreams', tag: 'בר קוקטיילים · חוויית ווב', color: '#ffd98f',
    image: CDN + 'hf_20260701_203215_e3ddab14-0e8f-4d38-8230-37b45ebaa2e0.png',
    pos: [-GX, 0.5, -56]
  },
  {
    title: 'Atelier Noir', tag: 'אופנה · איקומרס', color: '#b38bff',
    image: CDN + 'hf_20260701_203218_94abc68e-0494-48c0-8231-2847e096f714.png',
    pos: [GX, -0.4, -61.5]
  },
  {
    title: 'Synthesis AI', tag: 'טכנולוגיה · אתר מוצר', color: '#5ad1ff',
    image: CDN + 'hf_20260701_203220_01484007-df17-4851-85bc-122b81d4db99.png',
    pos: [-GX, -0.5, -67]
  },
  {
    title: 'Pulse Festival', tag: 'מוזיקה · חוויה אימרסיבית', color: '#ff8fd8',
    image: CDN + 'hf_20260701_203222_7546d4a6-c0f4-49fe-bef4-97696834a090.png',
    pos: [GX, 0.6, -72.5]
  }
]
