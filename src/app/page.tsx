import type { Metadata } from 'next'

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Cove Blades | Professional Knife Sharpening in Vancouver',
  description: "Vancouver's premier knife sharpening service. Mobile service that comes to you, or use our 24/7 secure drop box. Serving the North Shore, Vancouver, Burnaby, and the Lower Mainland since 2020.",
  alternates: { canonical: '/' },
}

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/sections/HeroSection'
import TrustBar from '@/components/sections/TrustBar'
import ServicesSection from '@/components/sections/ServicesSection'
import MobileServiceSection from '@/components/sections/MobileServiceSection'
import DropOffSection from '@/components/sections/DropOffSection'
import PricingSection from '@/components/sections/PricingSection'
import ReviewsSection from '@/components/sections/ReviewsSection'
import WhereWeAreSection from '@/components/sections/WhereWeAreSection'
import AboutSection from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <ServicesSection />
        <MobileServiceSection />
        <DropOffSection />
        <PricingSection />
        <ReviewsSection />
        <WhereWeAreSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
