import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BookingProvider } from '@/components/BookingProvider'
import { safeJsonLd } from '@/lib/schema'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Cove Blades | Professional Cutlery Sharpening in Vancouver',
  description: "Vancouver's premier cutlery sharpening service. Mobile service that comes to you, or use our 24/7 secure drop box. Serving the North Shore, Vancouver, Burnaby, and the Lower Mainland since 2020.",
  keywords: 'cutlery sharpening Vancouver, cutlery sharpening North Shore, mobile cutlery sharpening, cutlery sharpening service, Cove Blades',
  openGraph: {
    title: 'Cove Blades | Professional Cutlery Sharpening in Vancouver',
    description: 'Mobile and drop-off cutlery sharpening serving the Lower Mainland. 30-day guarantee.',
    url: 'https://coveblades.com',
    siteName: 'Cove Blades',
    locale: 'en_CA',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  metadataBase: new URL('https://coveblades.com'),
  icons: {
    icon: '/logo-icon-512.png',
    apple: '/logo-icon-512.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#0D1117',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
              name: 'Cove Blades',
              description: 'Professional cutlery sharpening service serving Vancouver and the Lower Mainland.',
              url: 'https://coveblades.com',
              telephone: '604 210 8180',
              email: 'info@coveblades.com',
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
                'https://www.instagram.com/coveblades/',
                'https://www.facebook.com/coveblades',
                'https://www.youtube.com/@coveblades',
                'https://www.google.com/search?q=Cove+Blades+-+Knife+Sharpening&stick=H4sIAAAAAAAA_-NgU1I1qDA1sTAzTzJOSzEyTDYzN06xMqhIM0k0SbKwtEg1MjUwNEsyWcQq55xflqrglJOYklqsoKvgnZeZlqoQnJFYVJCal5mXDgBtJBstSgAAAA',
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
