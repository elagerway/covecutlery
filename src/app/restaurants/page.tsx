import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Phone, Clock, Shield, Truck, Repeat } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { safeJsonLd, breadcrumbSchema, faqPageSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Restaurant Knife Sharpening Vancouver | Cove Cutlery',
  description:
    'Scheduled mobile knife sharpening for Vancouver restaurants. Weekly or bi-weekly service, on-site sharpening, no kitchen downtime. Serving the Lower Mainland since 2020.',
  alternates: { canonical: '/restaurants' },
}

const benefits = [
  {
    icon: Truck,
    title: 'We Come to Your Kitchen',
    description:
      'No packing, shipping, or picking up knives. We arrive at your restaurant with our full mobile setup and sharpen everything on-site.',
  },
  {
    icon: Repeat,
    title: 'Scheduled Service',
    description:
      'Weekly or bi-weekly visits on a schedule that works for your kitchen. Your team always has sharp knives without thinking about it.',
  },
  {
    icon: Clock,
    title: 'Zero Downtime',
    description:
      'We work around your prep schedule. Most restaurant collections take 20–30 minutes. Your knives are back on the line immediately.',
  },
  {
    icon: Shield,
    title: '30-Day Edge Guarantee',
    description:
      'Every sharpening is backed by our guarantee. If an edge does not hold under commercial kitchen use, we re-sharpen it free on our next visit.',
  },
]

const faqs = [
  {
    question: 'How does scheduled restaurant knife sharpening work?',
    answer:
      'We visit your kitchen on a regular schedule — weekly or bi-weekly depending on your volume. Our technician works through your entire knife inventory on-site, typically in 20–30 minutes. Knives go from dull to razor-sharp without leaving your kitchen.',
  },
  {
    question: 'What is the cost for restaurant knife sharpening?',
    answer:
      'Standard kitchen knives are $12 each, same as our residential pricing. Japanese single-bevel knives are $18. Most restaurants spend $100–$200 per visit depending on inventory size. Volume discounts are available for large operations — call us to discuss.',
  },
  {
    question: 'Do you service all types of commercial kitchen knives?',
    answer:
      'Yes. We sharpen chef knives, santoku, nakiri, cleavers, boning knives, fillet knives, bread knives, and kitchen scissors. We also handle specialty items like mandoline blades and food processor blades. If it has an edge, we can sharpen it.',
  },
  {
    question: 'How often should restaurant knives be professionally sharpened?',
    answer:
      'Most high-volume kitchens benefit from weekly sharpening. Mid-volume restaurants do well with bi-weekly service. Regular honing with a steel between sharpenings extends edge life. We will help you determine the right frequency based on your volume and knife types.',
  },
  {
    question: 'What areas do you serve for restaurant knife sharpening?',
    answer:
      'We serve restaurants across Metro Vancouver including Vancouver, North Vancouver, West Vancouver, Burnaby, Coquitlam, and the Tri-Cities. Based in North Vancouver, we reach most Lower Mainland restaurants within 35 minutes.',
  },
  {
    question: 'Can you sharpen knives during service hours?',
    answer:
      'We prefer to work during prep hours to minimize disruption, but we can accommodate service-hour visits if needed. We work quietly and efficiently at a designated station, rotating knives so your line never goes without.',
  },
]

export default function RestaurantsPage() {
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: 'https://covecutlery.ca' },
    { name: 'Restaurant Service', url: 'https://covecutlery.ca/restaurants' },
  ])

  const faqJsonLd = faqPageSchema(faqs)

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
              Restaurant Knife Sharpening in{' '}
              <span style={{ color: '#D4A017' }}>Vancouver</span>
            </h1>
            <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Cove Cutlery offers scheduled mobile knife sharpening for Vancouver restaurants. We
              visit weekly or bi-weekly, sharpening your entire knife inventory on-site so your
              kitchen never misses a beat.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 px-6" style={{ borderTop: '1px solid #30363D' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: '#FFFFFF' }}>
              Why Restaurants Choose{' '}
              <span style={{ color: '#D4A017' }}>Cove Cutlery</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map(benefit => (
                <div
                  key={benefit.title}
                  className="rounded-xl border p-6"
                  style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(212,160,23,0.1)' }}
                    >
                      <benefit.icon size={20} style={{ color: '#D4A017' }} />
                    </div>
                    <h3 className="font-bold" style={{ color: '#FFFFFF' }}>
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          className="py-16 px-6"
          style={{ backgroundColor: '#161B22', borderTop: '1px solid #30363D' }}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: '#FFFFFF' }}>
              How It <span style={{ color: '#D4A017' }}>Works</span>
            </h2>
            <div className="flex flex-col gap-8">
              {[
                {
                  step: '1',
                  title: 'Contact Us to Set Up a Schedule',
                  description:
                    'Call 604-373-1500 or book through our website. We will discuss your knife inventory, volume, and preferred schedule to find the right fit.',
                },
                {
                  step: '2',
                  title: 'We Visit Your Kitchen on Schedule',
                  description:
                    'Our technician arrives at your restaurant at the agreed time with a full portable sharpening station. We work around your prep schedule.',
                },
                {
                  step: '3',
                  title: 'Every Knife Sharpened On-Site',
                  description:
                    'We inspect, sharpen, and test every blade before handing it back. The whole process takes 20–30 minutes for most restaurant collections.',
                },
                {
                  step: '4',
                  title: 'Repeat on Your Schedule',
                  description:
                    'We return weekly or bi-weekly — whatever frequency keeps your kitchen running at peak performance. Adjust anytime as your needs change.',
                },
              ].map(item => (
                <div key={item.step} className="flex gap-5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
                    style={{ backgroundColor: 'rgba(212,160,23,0.15)', color: '#D4A017' }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: '#FFFFFF' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6" style={{ borderTop: '1px solid #30363D' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10" style={{ color: '#FFFFFF' }}>
              Restaurant Sharpening{' '}
              <span style={{ color: '#D4A017' }}>FAQs</span>
            </h2>
            <div className="flex flex-col gap-5">
              {faqs.map(faq => (
                <div
                  key={faq.question}
                  className="rounded-xl p-6 border"
                  style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
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
        <section
          className="py-20 px-6 text-center"
          style={{ backgroundColor: '#161B22', borderTop: '1px solid #30363D' }}
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
              Keep Your Kitchen{' '}
              <span style={{ color: '#D4A017' }}>Running Sharp</span>
            </h2>
            <p className="text-base mb-8" style={{ color: '#6B7280' }}>
              Set up a regular sharpening schedule for your restaurant. Call us or book online to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{ backgroundColor: '#D4A017', color: '#0D1117' }}
              >
                Get Started
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
            <div className="mt-6 flex justify-center gap-6">
              <Link
                href="/mobile-service"
                className="text-sm transition-colors hover:text-[#D4A017]"
                style={{ color: '#6B7280' }}
              >
                Learn about mobile service →
              </Link>
              <Link
                href="/service-area"
                className="text-sm transition-colors hover:text-[#D4A017]"
                style={{ color: '#6B7280' }}
              >
                View service areas →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
