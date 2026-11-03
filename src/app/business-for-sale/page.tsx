import type { Metadata } from "next";
import {
  Cog, Truck, Users, Globe, Phone, GraduationCap, Star, Tag, CheckCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryForm from "@/components/InquiryForm";
import { safeJsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Business for Sale: Cove Blades Knife Sharpening | North Vancouver",
  description:
    "Cove Blades is for sale. An established mobile knife-sharpening business on the North Shore: five sharpening machines, a 2016 Ram ProMaster high-roof van, 500+ customers, and the brand, website, and phone number.",
  alternates: { canonical: "/business-for-sale" },
};

const stats = [
  { value: "500+", label: "Customers on file" },
  { value: "15,000+", label: "Knives sharpened" },
  { value: "5", label: "Sharpening machines" },
  { value: "Since 2020", label: "Serving the North Shore" },
];

const included = [
  {
    icon: Cog,
    title: "Five sharpening machines",
    description:
      "Custom-built and Bucktool machines with Airplaten accessories. The same setup that sharpens every job today.",
  },
  {
    icon: Truck,
    title: "2016 Ram ProMaster high-roof van",
    description:
      "216,000 km and in great condition. The mobile workshop that takes the service to customers' doors.",
  },
  {
    icon: Users,
    title: "500+ happy customers",
    description:
      "Homeowners, home cooks, and restaurants across the North Shore and Metro Vancouver, with contact details and service history.",
  },
  {
    icon: Globe,
    title: "Brand, website & domain",
    description:
      "The Cove Blades name and coveblades.com, including online booking, invoicing with card and e-Transfer payments, and the admin system that runs the business.",
  },
  {
    icon: Phone,
    title: "Business phone number",
    description:
      "604-210-8180, the number customers already call and text to book and ask questions.",
  },
  {
    icon: GraduationCap,
    title: "Train to be Sharp course",
    description:
      "The online sharpening course and its content, an additional product line beyond service work.",
  },
  {
    icon: Star,
    title: "Reviews & social accounts",
    description:
      "The Google Business profile with its five-star reviews, plus Instagram and the other Cove Blades social accounts.",
  },
];

const operations = [
  "Mobile service: the van goes to customers, with online booking and automated reminders",
  "24/7 secure drop box for customers who'd rather drop off and pick up",
  "Restaurant and commercial accounts, plus event and market pop-ups",
  "Simple, published pricing with a 30-day guarantee",
  "Service area covering the North Shore, Vancouver, Burnaby, and the Lower Mainland",
];

export default function BusinessForSalePage() {
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: "https://coveblades.com" },
    { name: "Business for Sale", url: "https://coveblades.com/business-for-sale" },
  ]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0D1117", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: "#0D1117" }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,160,23,0.07) 0%, transparent 55%, rgba(30,144,255,0.04) 100%)",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
              style={{ backgroundColor: "rgba(212,160,23,0.1)", color: "#D4A017", border: "1px solid rgba(212,160,23,0.3)" }}
            >
              <Tag size={14} />
              Business for sale
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "#FFFFFF" }}
            >
              Cove Blades is <span style={{ color: "#D4A017" }}>for sale</span>
            </h1>
            <p className="text-lg max-w-xl mx-auto leading-relaxed mb-8" style={{ color: "#6B7280" }}>
              An established mobile knife-sharpening business on the North Shore, with the
              equipment, van, customers, and brand to keep going from day one.
            </p>
            <a
              href="#inquire"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
            >
              Request details
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border p-5 text-center"
                style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
              >
                <p className="text-2xl sm:text-3xl font-bold" style={{ color: "#D4A017" }}>{s.value}</p>
                <p className="text-xs sm:text-sm mt-1" style={{ color: "#6B7280" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What's included */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: "#FFFFFF" }}>
              What&rsquo;s <span style={{ color: "#D4A017" }}>Included</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {included.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border p-6"
                  style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                    >
                      <f.icon size={20} style={{ color: "#D4A017" }} />
                    </div>
                    <h3 className="font-bold" style={{ color: "#FFFFFF" }}>{f.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it runs */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center" style={{ color: "#FFFFFF" }}>
              How the Business <span style={{ color: "#D4A017" }}>Runs</span>
            </h2>
            <ul className="space-y-3">
              {operations.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle size={18} className="mt-0.5 shrink-0" style={{ color: "#D4A017" }} />
                  <span style={{ color: "#D1D5DB" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Inquiry */}
        <section id="inquire" className="py-16 px-6 scroll-mt-24" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-center" style={{ color: "#FFFFFF" }}>
              Interested? <span style={{ color: "#D4A017" }}>Let&rsquo;s talk.</span>
            </h2>
            <p className="text-center mb-8" style={{ color: "#6B7280" }}>
              The asking price and financials are available to serious buyers. Send a note and
              we&rsquo;ll get back to you.
            </p>
            <div
              className="rounded-xl border p-6 sm:p-8"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              <InquiryForm
                serviceType="business-sale"
                buttonLabel="Request details"
                successMessage="Thanks, we'll be in touch soon."
                messagePlaceholder="Tell us a bit about yourself and what you have in mind for the business..."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
