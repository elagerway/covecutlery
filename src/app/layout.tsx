import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BookingProvider } from '@/components/BookingProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Cove Cutlery | Professional Knife Sharpening in Vancouver',
  description: "Vancouver's premier knife sharpening service. Mobile service that comes to you, or use our 24/7 secure drop box. Serving the North Shore, Vancouver, Burnaby, and the Lower Mainland since 2020.",
  keywords: 'knife sharpening Vancouver, knife sharpening North Shore, mobile knife sharpening, knife sharpening service, Cove Cutlery',
  openGraph: {
    title: 'Cove Cutlery | Professional Knife Sharpening in Vancouver',
    description: 'Mobile and drop-off knife sharpening serving the Lower Mainland. 5★ rated, 30-day guarantee.',
    url: 'https://covecutlery.com',
    siteName: 'Cove Cutlery',
    locale: 'en_CA',
    type: 'website',
  },
  metadataBase: new URL('https://covecutlery.com'),
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
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Cove Cutlery',
              description: 'Professional knife sharpening service serving Vancouver and the Lower Mainland.',
              url: 'https://covecutlery.com',
              telephone: '604-210-8180',
              email: 'info@covecutlery.ca',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '4086 Brockton Crescent',
                addressLocality: 'North Vancouver',
                addressRegion: 'BC',
                postalCode: 'V7G 1E6',
                addressCountry: 'CA',
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '10:00',
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
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5',
                reviewCount: '50',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}><BookingProvider>{children}</BookingProvider></body>
    </html>
  )
}
