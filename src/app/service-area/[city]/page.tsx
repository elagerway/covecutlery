import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, MapPin, Phone, Clock, Shield } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { cities, getCityBySlug, getRelatedCities } from '@/data/cities'
import { safeJsonLd, breadcrumbSchema, faqPageSchema } from '@/lib/schema'

export function generateStaticParams() {
  return cities.map(city => ({ city: city.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) return {}

  return {
    title: city.metaTitle,
    description: city.metaDescription,
    alternates: { canonical: `/service-area/${city.slug}` },
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) notFound()

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: 'https://coveblades.com' },
    { name: 'Service Areas', url: 'https://coveblades.com/service-area' },
    { name: city.name, url: `https://coveblades.com/service-area/${city.slug}` },
  ])

  const faqJsonLd = faqPageSchema(city.faqs)

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Knife Sharpening in ${city.name}`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Cove Blades',
      url: 'https://coveblades.com',
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'British Columbia',
      },
    },
    description: `Professional mobile knife sharpening service in ${city.name}, BC. We come to your home or restaurant.`,
  }

  const paragraphs = city.description.split('\n\n')
  const relatedCities = getRelatedCities(city, 3)

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0D1117', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceJsonLd) }} />
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
            <nav className="text-sm mb-8" style={{ color: '#6B7280' }}>
              <Link href="/" className="hover:text-[#D4A017] transition-colors">Home</Link>
              {' / '}
              <Link href="/service-area" className="hover:text-[#D4A017] transition-colors">Service Areas</Link>
              {' / '}
              <span style={{ color: '#D4A017' }}>{city.name}</span>
            </nav>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: '#FFFFFF' }}
            >
              {city.dropOffEmphasis
                ? <>Looking for Knife Sharpening in <span style={{ color: '#D4A017' }}>{city.name}</span>, BC?</>
                : <>Mobile Knife Sharpening in <span style={{ color: '#D4A017' }}>{city.name}</span>, BC</>}
            </h1>
            <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              {city.driveTime}.{' '}
              {city.dropOffEmphasis
                ? 'Mobile service, 24/7 drop-off, and $12/knife with a 30-day edge guarantee.'
                : 'We come to your home or restaurant. $12/knife with a 30-day edge guarantee.'}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-6" style={{ borderTop: '1px solid #30363D' }}>
          <div className="max-w-3xl mx-auto">
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="text-base leading-relaxed mb-6"
                style={{ color: '#9CA3AF' }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section
          className="py-16 px-6"
          style={{ backgroundColor: '#161B22', borderTop: '1px solid #30363D' }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: '#FFFFFF' }}>
              How Mobile Sharpening Works in{' '}
              <span style={{ color: '#D4A017' }}>{city.name}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Book Online or Call',
                  description: `Schedule a mobile visit to your ${city.name} address. Choose a date and time that works for you.`,
                  icon: Phone,
                },
                {
                  step: '2',
                  title: 'We Come to You',
                  description: `We drive to ${city.name} (${city.driveTime.toLowerCase()}) with our full portable sharpening setup.`,
                  icon: Clock,
                },
                {
                  step: '3',
                  title: 'Sharp Knives, Guaranteed',
                  description: 'We sharpen on-site in 15–30 minutes. Every blade backed by our 30-day edge guarantee.',
                  icon: Shield,
                },
              ].map(item => (
                <div key={item.step} className="text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: 'rgba(212,160,23,0.1)' }}
                  >
                    <item.icon size={24} style={{ color: '#D4A017' }} />
                  </div>
                  <div
                    className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: '#D4A017' }}
                  >
                    Step {item.step}
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: '#FFFFFF' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Neighbourhoods */}
        <section className="py-16 px-6" style={{ borderTop: '1px solid #30363D' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: '#FFFFFF' }}>
              Neighbourhoods We Serve in{' '}
              <span style={{ color: '#D4A017' }}>{city.name}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {city.neighbourhoods.map(hood => (
                <div
                  key={hood}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 border"
                  style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
                >
                  <MapPin size={14} style={{ color: '#D4A017' }} className="shrink-0" />
                  <span className="text-sm" style={{ color: '#9CA3AF' }}>
                    {hood}
                  </span>
                </div>
              ))}
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
              {city.name} Knife Sharpening{' '}
              <span style={{ color: '#D4A017' }}>FAQs</span>
            </h2>
            <div className="flex flex-col gap-5">
              {city.faqs.map(faq => (
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

        {/* Related Service Areas */}
        {relatedCities.length > 0 && (
          <section className="py-14 px-6" style={{ borderTop: '1px solid #30363D' }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center" style={{ color: '#FFFFFF' }}>
                Also serving{' '}
                <span style={{ color: '#D4A017' }}>nearby</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedCities.map(rc => (
                  <Link
                    key={rc.slug}
                    href={`/service-area/${rc.slug}`}
                    className="group rounded-lg border p-4 transition-all duration-200 hover:border-[#D4A017]/50"
                    style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} style={{ color: '#D4A017' }} />
                        <span className="font-semibold text-sm" style={{ color: '#FFFFFF' }}>
                          {rc.name}
                        </span>
                      </div>
                      <ChevronRight
                        size={14}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                        style={{ color: '#6B7280' }}
                      />
                    </div>
                    <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
                      {rc.driveTime}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 px-6 text-center" style={{ borderTop: '1px solid #30363D' }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
              Ready to Get Your <span style={{ color: '#D4A017' }}>Knives Sharp?</span>
            </h2>
            <p className="text-base mb-8" style={{ color: '#6B7280' }}>
              {city.dropOffEmphasis
                ? `Book a mobile visit to ${city.name} or drop off your knives at our 24/7 secure box in North Vancouver.`
                : `Book a mobile visit and we'll come to your ${city.name} address — no need to drop off or ship your knives.`}
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

            {/* Back to hub */}
            <div className="mt-8">
              <Link
                href="/service-area"
                className="text-sm transition-colors hover:text-[#D4A017]"
                style={{ color: '#6B7280' }}
              >
                ← View all service areas
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
