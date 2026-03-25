import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BookingProvider } from '@/components/BookingProvider'
import { safeJsonLd } from '@/lib/schema'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Cove Cutlery | Professional Cutlery Sharpening in Vancouver',
  description: "Vancouver's premier cutlery sharpening service. Mobile service that comes to you, or use our 24/7 secure drop box. Serving the North Shore, Vancouver, Burnaby, and the Lower Mainland since 2020.",
  keywords: 'cutlery sharpening Vancouver, cutlery sharpening North Shore, mobile cutlery sharpening, cutlery sharpening service, Cove Cutlery',
  openGraph: {
    title: 'Cove Cutlery | Professional Cutlery Sharpening in Vancouver',
    description: 'Mobile and drop-off cutlery sharpening serving the Lower Mainland. 30-day guarantee.',
    url: 'https://covecutlery.ca',
    siteName: 'Cove Cutlery',
    locale: 'en_CA',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  metadataBase: new URL('https://covecutlery.ca'),
  icons: {
    icon: '/logo-icon-512.png',
    apple: '/logo-icon-512.png',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Cove Cutlery',
              description: 'Professional cutlery sharpening service serving Vancouver and the Lower Mainland.',
              url: 'https://covecutlery.ca',
              telephone: '604 373 1500',
              email: 'info@covecutlery.ca',
              foundingDate: '2020',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '4086 Brockton Crescent',
                addressLocality: 'North Vancouver',
                addressRegion: 'BC',
                postalCode: 'V7G 1E6',
                addressCountry: 'CA',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 49.3198,
                longitude: -123.0725,
              },
              sameAs: [
                'https://www.instagram.com/covecutlery/',
                'https://www.facebook.com/covecutlery',
                'https://www.youtube.com/@covecutlery',
              ],
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '12:00',
                  closes: '19:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Saturday'],
                  opens: '12:00',
                  closes: '16:00',
                },
              ],
              priceRange: '$$',
            }),
          }}
        />
      </head>
      <body className={inter.className}><BookingProvider>{children}</BookingProvider></body>
    </html>
  )
}
