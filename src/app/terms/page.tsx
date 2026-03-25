import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Cove Cutlery",
  description: "Terms of service for Cove Cutlery sharpening services.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D1117] pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-[#6B7280] text-sm mb-10">Last updated: March 25, 2026</p>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-[#9CA3AF]">

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Services</h2>
              <p>Cove Cutlery provides professional cutlery and blade sharpening services in Metro Vancouver and the Lower Mainland, BC. Services include mobile sharpening, drop-off, and special event sharpening.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. Bookings & Payment</h2>
              <p>A deposit is collected at the time of booking to secure your appointment. The remaining balance is due upon completion of service. Prices are per piece as listed on our website.</p>
              <p className="mt-3">We accept cash, Interac e-Transfer, and credit/debit card. All payments are processed securely.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. 30-Day Sharpness Guarantee</h2>
              <p>We stand behind our work. If a blade loses its edge within 30 days of service through normal use, we will re-sharpen it at no charge. This guarantee does not cover damage caused by misuse, improper storage, cutting on hard surfaces (e.g. glass, ceramic, stone), or accidental damage.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Liability</h2>
              <p>We take great care with every blade entrusted to us. In the rare event of damage during sharpening, our liability is limited to the fair market value of the item. We are not responsible for pre-existing damage, cracks, or defects not visible at drop-off.</p>
              <p className="mt-3">Customers use sharpened blades at their own risk. Sharp knives are inherently dangerous — always handle with care.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Cancellations</h2>
              <p>Please provide at least 24 hours notice to cancel or reschedule a mobile appointment. Deposits may be forfeited for no-shows or late cancellations at our discretion.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Service Area</h2>
              <p>Mobile service is available within our service area (North Shore to Chilliwack, and surrounding Lower Mainland communities). Addresses outside this area or requiring ferry travel cannot be accommodated. We verify service area eligibility at the time of booking.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Changes to Terms</h2>
              <p>We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the updated terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Contact</h2>
              <p>Questions about these terms? Reach us at:</p>
              <p className="mt-2">
                <strong className="text-white">Cove Cutlery</strong><br />
                North Vancouver, BC<br />
                <a href="mailto:info@covecutlery.ca" className="text-[#D4A017] hover:underline">info@covecutlery.ca</a><br />
                <a href="tel:6043731500" className="text-[#D4A017] hover:underline">604 373 1500</a>
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
