export const revalidate = 300;

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
