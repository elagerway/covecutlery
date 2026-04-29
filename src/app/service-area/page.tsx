import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, MapPin, Phone } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { cities } from '@/data/cities'
import { safeJsonLd, breadcrumbSchema, faqPageSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Knife Sharpening Service Areas | Lower Mainland BC | Cove Blades',
  description:
    'Cove Blades provides mobile knife sharpening across the Lower Mainland — 17 cities from North Vancouver and Vancouver to Abbotsford and Chilliwack. Drop-off available in North Vancouver only. Book online today.',
  alternates: { canonical: '/service-area' },
}

const hubFaqs = [
  {
    question: 'What areas does Cove Blades serve for mobile knife sharpening?',
    answer:
      'We serve 17 cities across the Lower Mainland: the North Shore (North Vancouver, West Vancouver), Vancouver and Richmond, Burnaby and New Westminster, the Tri-Cities (Coquitlam, Port Moody, Port Coquitlam), the South of Fraser (Surrey, Delta, White Rock, Langley), and the Fraser Valley (Maple Ridge, Pitt Meadows, Abbotsford, Chilliwack). Based in North Vancouver, we reach most Lower Mainland addresses within a 105 km service radius.',
  },
  {
    question: 'Is there a minimum order for mobile knife sharpening?',
    answer:
      'Yes — the minimum scales with drive distance. North Shore, Vancouver, Burnaby, and the Tri-Cities are 5 knives ($60). Surrey, Delta, New Westminster, Maple Ridge, Pitt Meadows, Langley, and White Rock are 5 knives ($60) given the longer drive but still manageable for most households. Abbotsford is 8 knives ($96), and Chilliwack is 10 knives ($120) given the 90+ minute drive each way.',
  },
  {
    question: 'Where can I drop off my knives instead of booking mobile service?',
    answer:
      'Drop-off is available only at our 24/7 secure box in North Vancouver (4086 Brockton Crescent). For every other city in our service area, mobile is the right option — we come to your home or restaurant.',
  },
  {
    question: 'How do I book a mobile knife sharpening visit?',
    answer:
      'Book online through our website or call 604-210-8180. Choose your preferred date and time, and we will confirm your appointment. For longer-drive cities like Abbotsford and Chilliwack, we typically schedule visits as planned days that hit multiple stops or as part of a regional rotation, so flexibility on timing helps.',
  },
]

// Sub-region order for the grouped city grid — defines display order on the hub page
const SUB_REGION_ORDER = [
  'North Shore',
  'Vancouver',
  'Burnaby & New West',
  'Tri-Cities',
  'South of Fraser',
  'Fraser Valley',
] as const

export default function ServiceAreaPage() {
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: 'https://coveblades.com' },
    { name: 'Service Areas', url: 'https://coveblades.com/service-area' },
  ])

  const faqJsonLd = faqPageSchema(hubFaqs)

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cove Blades service areas across the Lower Mainland',
    numberOfItems: cities.length,
    itemListElement: cities.map((city, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://coveblades.com/service-area/${city.slug}`,
      name: `Knife sharpening in ${city.name}`,
    })),
  }

  const siteNavJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: cities.map(c => c.name),
    url: cities.map(c => `https://coveblades.com/service-area/${c.slug}`),
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0D1117', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(siteNavJsonLd) }} />
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: '#0D1117' }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(212,160,23,0.07) 0%, transparent 55%, rgba(30,144,255,0.04) 100%)',
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: '#FFFFFF' }}
            >
              Knife Sharpening Across the{' '}
              <span style={{ color: '#D4A017' }}>Lower Mainland</span>
            </h1>
            <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Cove Blades provides mobile knife sharpening to homes, restaurants, and businesses
              across 17 cities in the Lower Mainland. Based in North Vancouver, we serve from
              the North Shore out to Chilliwack within a 105 km service radius.
            </p>
          </div>
        </section>

        {/* City Grid — grouped by sub-region */}
        <section className="py-16 px-6" style={{ borderTop: '1px solid #30363D' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: '#FFFFFF' }}>
              Areas We <span style={{ color: '#D4A017' }}>Serve</span>
            </h2>
            <div className="flex flex-col gap-12">
              {SUB_REGION_ORDER.map(region => {
                const regionCities = cities.filter(c => c.subRegion === region)
                if (regionCities.length === 0) return null
                return (
                  <div key={region}>
                    <h3
                      className="text-sm font-semibold uppercase tracking-widest mb-5"
                      style={{ color: '#D4A017' }}
                    >
                      {region}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {regionCities.map(city => (
                        <Link
                          key={city.slug}
                          href={`/service-area/${city.slug}`}
                          className="group rounded-xl border p-6 transition-all duration-200 hover:border-[#D4A017]/50"
                          style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <MapPin size={18} style={{ color: '#D4A017' }} />
                              <h3 className="font-bold text-lg" style={{ color: '#FFFFFF' }}>
                                {city.name}
                              </h3>
                            </div>
                            <ChevronRight
                              size={18}
                              className="mt-1 transition-transform duration-200 group-hover:translate-x-1"
                              style={{ color: '#6B7280' }}
                            />
                          </div>
                          <p className="text-sm mb-3" style={{ color: '#6B7280' }}>
                            {city.driveTime}
                          </p>
                          <p className="text-xs" style={{ color: '#6B7280' }}>
                            {city.neighbourhoods.slice(0, 4).join(' · ')}{' '}
                            {city.neighbourhoods.length > 4 && `+ ${city.neighbourhoods.length - 4} more`}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="py-16 px-6"
          style={{ backgroundColor: '#161B22', borderTop: '1px solid #30363D' }}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10" style={{ color: '#FFFFFF' }}>
              Service Area <span style={{ color: '#D4A017' }}>FAQs</span>
            </h2>
            <div className="flex flex-col gap-5">
              {hubFaqs.map(faq => (
                <div
                  key={faq.question}
                  className="rounded-xl p-6 border"
                  style={{ backgroundColor: '#0D1117', borderColor: '#30363D' }}
                >
                  <p className="font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                    {faq.question}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 text-center" style={{ borderTop: '1px solid #30363D' }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
              Ready to Get Your <span style={{ color: '#D4A017' }}>Knives Sharp?</span>
            </h2>
            <p className="text-base mb-8" style={{ color: '#6B7280' }}>
              Book a mobile visit anywhere in our 105 km service area. North Vancouver locals can also use the 24/7 drop-off box at 4086 Brockton Crescent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{ backgroundColor: '#D4A017', color: '#0D1117' }}
              >
                Book Now
                <ChevronRight size={18} />
              </Link>
              <a
                href="tel:6042108180"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
                style={{ borderColor: '#D4A017', color: '#D4A017' }}
              >
                <Phone size={16} />
                604 210 8180
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
