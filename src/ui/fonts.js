// Local font files (bundled by Vite) so drei <Text> never depends on a font CDN.
// Hebrew-first pairing: Frank Ruhl Libre for headlines, Heebo for body — with
// Marcellus kept for the Latin MAROM wordmark.
import marcellus from '@expo-google-fonts/marcellus/400Regular/Marcellus_400Regular.ttf'
import frank from '@expo-google-fonts/frank-ruhl-libre/400Regular/FrankRuhlLibre_400Regular.ttf'
import frankBold from '@expo-google-fonts/frank-ruhl-libre/700Bold/FrankRuhlLibre_700Bold.ttf'
import heebo from '@expo-google-fonts/heebo/400Regular/Heebo_400Regular.ttf'
import heeboMedium from '@expo-google-fonts/heebo/500Medium/Heebo_500Medium.ttf'

export const FONT_BRAND = marcellus       // the Latin MAROM wordmark
export const FONT_SERIF = frank           // Hebrew headlines
export const FONT_SERIF_BOLD = frankBold  // Hebrew display emphasis
export const FONT_SANS = heebo            // Hebrew body copy
export const FONT_SANS_MED = heeboMedium  // Hebrew eyebrows / labels
