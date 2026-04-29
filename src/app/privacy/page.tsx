import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Cove Blades",
  description: "Privacy policy for Cove Blades — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D1117] pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-[#6B7280] text-sm mb-10">Last updated: April 29, 2026</p>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-[#9CA3AF]">

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Information We Collect</h2>
              <p>When you book a service, request training, or contact us, we collect:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Name, email address, and phone number</li>
                <li>Service address (for mobile bookings)</li>
                <li>Payment information (processed securely via Stripe — we do not store card numbers)</li>
                <li>Messages and notes you provide</li>
              </ul>
              <p className="mt-3">We also collect standard server logs (IP address, browser type, pages visited) for operational purposes.</p>
              <p className="mt-3">If you opt in by providing a phone number, we may send appointment confirmations, receipts, and other transactional messages by SMS.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Book and fulfil sharpening services</li>
                <li>Send appointment confirmations and receipts</li>
                <li>Contact you about your booking</li>
                <li>Process payments</li>
                <li>Improve our website and services</li>
              </ul>
              <p className="mt-3">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Third-Party Services</h2>
              <p>We use the following third-party services to operate our business:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong className="text-white">Stripe</strong> — payment processing</li>
                <li><strong className="text-white">Cal.com</strong> — appointment scheduling</li>
                <li><strong className="text-white">Supabase</strong> — secure database and authentication for booking, customer, and contact records</li>
                <li><strong className="text-white">Postmark</strong> — transactional email delivery</li>
                <li><strong className="text-white">Magpipe</strong> — SMS delivery for appointment confirmations and receipts</li>
                <li><strong className="text-white">Google Maps</strong> — address lookup and service area verification</li>
                <li><strong className="text-white">Cloudflare Turnstile</strong> — anti-bot protection on our forms</li>
                <li><strong className="text-white">Vercel</strong> — website hosting and edge delivery</li>
              </ul>
              <p className="mt-3">Each of these services has its own privacy policy and data practices.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Data Retention</h2>
              <p>We retain booking and customer records for a reasonable period to provide service, handle disputes, and meet legal obligations. You may request deletion of your data at any time by contacting us.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Cookies</h2>
              <p>Our website uses minimal cookies required for session management. We do not use advertising or tracking cookies.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal information. To exercise these rights, contact us at{" "}
                <a href="mailto:info@coveblades.com" className="text-[#D4A017] hover:underline">info@coveblades.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Contact</h2>
              <p>For privacy-related questions, reach us at:</p>
              <p className="mt-2">
                <strong className="text-white">Cove Blades</strong><br />
                North Vancouver, BC<br />
                <a href="mailto:info@coveblades.com" className="text-[#D4A017] hover:underline">info@coveblades.com</a><br />
                <a href="tel:6042108180" className="text-[#D4A017] hover:underline">604 210 8180</a>
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
