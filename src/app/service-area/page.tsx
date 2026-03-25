import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, MapPin, Phone } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { cities } from '@/data/cities'
import { safeJsonLd, breadcrumbSchema, faqPageSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Knife Sharpening Service Areas | Metro Vancouver | Cove Cutlery',
  description:
    'Cove Cutlery provides mobile knife sharpening across Metro Vancouver. Serving North Vancouver, Vancouver, Burnaby, West Vancouver, and Coquitlam. Book online today.',
  alternates: { canonical: '/service-area' },
}

const hubFaqs = [
  {
    question: 'What areas does Cove Cutlery serve for mobile knife sharpening?',
    answer:
      'We serve the entire Metro Vancouver region including North Vancouver, Vancouver, Burnaby, West Vancouver, Coquitlam, Port Moody, and Port Coquitlam. Based in North Vancouver, we reach most Lower Mainland addresses within 35 minutes.',
  },
  {
    question: 'Is there a minimum order for mobile knife sharpening?',
    answer:
      'Yes. Mobile visits require a minimum of 5 knives ($60) for Vancouver, North Shore, and Burnaby. This covers travel while keeping per-knife pricing affordable at $12 for standard blades.',
  },
  {
    question: 'Can I drop off my knives instead of booking mobile service?',
    answer:
      'Absolutely. Our 24/7 secure drop-off box is at 4086 Brockton Crescent in North Vancouver. No minimum order and 24–48 hour turnaround. Many customers across Metro Vancouver prefer this convenient option.',
  },
  {
    question: 'How do I book a mobile knife sharpening visit?',
    answer:
      'Book online through our website or call 604-373-1500. Choose your preferred date and time, and we will confirm your appointment. We bring our full sharpening setup to your door.',
  },
]

export default function ServiceAreaPage() {
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: 'https://covecutlery.ca' },
    { name: 'Service Areas', url: 'https://covecutlery.ca/service-area' },
  ])

  const faqJsonLd = faqPageSchema(hubFaqs)

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0D1117', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
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
              Knife Sharpening Across{' '}
              <span style={{ color: '#D4A017' }}>Metro Vancouver</span>
            </h1>
            <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Cove Cutlery provides mobile knife sharpening to homes, restaurants, and businesses
              across Metro Vancouver. Based in North Vancouver, we serve the entire Lower Mainland
              within a 90 km radius.
            </p>
          </div>
        </section>

        {/* City Grid */}
        <section className="py-16 px-6" style={{ borderTop: '1px solid #30363D' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: '#FFFFFF' }}>
              Areas We <span style={{ color: '#D4A017' }}>Serve</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map(city => (
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
              Book a mobile visit or drop off your knives at our 24/7 secure box in North Vancouver.
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
                href="tel:6043731500"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
                style={{ borderColor: '#D4A017', color: '#D4A017' }}
              >
                <Phone size={16} />
                604 373 1500
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
