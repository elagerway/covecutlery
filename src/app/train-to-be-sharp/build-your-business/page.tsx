import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Phone,
  Sparkles,
  DollarSign,
  Globe,
  Mail,
  Bot,
  MessageSquare,
  Rocket,
  Wrench,
  CheckCircle,
  Clock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseSignUp from "@/components/courses/CourseSignUp";
import { safeJsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Build Your Business with AI — Hands-On Workshop | Cove Blades",
  description:
    "A 3-4 hour one-on-one build session. We design, build, and deploy your website, email marketing, AI phone agent, and SMS automation using Claude Code, Next.js, Supabase, Vercel, and GitHub. $600.",
  alternates: { canonical: "/train-to-be-sharp/build-your-business" },
};

const deliverables = [
  {
    icon: Globe,
    title: "Website — designed, built & deployed",
    description:
      "A professional site built with Next.js and deployed on Vercel. Your services, pricing, booking, contact info, and service areas — live before you leave. Not a template. Built from scratch with you in the room making decisions.",
  },
  {
    icon: Bot,
    title: "AI phone agent",
    description:
      "A voice AI that answers your business line 24/7 — greets callers, answers common questions, quotes your pricing, and directs them to book online. Same system Cove Blades runs. Set up and tested before the session ends.",
  },
  {
    icon: MessageSquare,
    title: "SMS automation",
    description:
      "Automatic text replies for inbound inquiries, booking confirmations, and follow-ups. A dedicated business number so your personal phone stays separate.",
  },
  {
    icon: Mail,
    title: "Email marketing foundation",
    description:
      "Your transactional email pipeline — booking confirmations, invoices, and follow-ups that go out automatically. We'll discuss list-building and campaign strategy so you have a plan for ongoing outreach.",
  },
  {
    icon: Rocket,
    title: "Business profiles & cards",
    description:
      "Google Business Profile, social media profiles, and business card design — the basics that make you findable and credible from day one.",
  },
  {
    icon: Wrench,
    title: "The maintenance playbook",
    description:
      "How to update your site, manage your customer list, tweak your AI agent's responses, and keep everything running after the session. You own it all — no ongoing fees to me.",
  },
];

const toolStack = [
  { name: "Claude Code", role: "AI-powered development — we build in real time" },
  { name: "Next.js", role: "The framework your site runs on" },
  { name: "Vercel", role: "Hosting and deployment — push to deploy" },
  { name: "Supabase", role: "Database, auth, and backend" },
  { name: "GitHub", role: "Your code lives here — version-controlled and yours" },
];

export default function BuildYourBusinessPage() {
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: "https://coveblades.com" },
    { name: "Training", url: "https://coveblades.com/train-to-be-sharp" },
    {
      name: "Build Your Business with AI",
      url: "https://coveblades.com/train-to-be-sharp/build-your-business",
    },
  ]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#0D1117",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section
          className="relative py-24 px-6 overflow-hidden"
          style={{ backgroundColor: "#0D1117" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,160,23,0.07) 0%, transparent 55%, rgba(30,144,255,0.04) 100%)",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <Link
              href="/train-to-be-sharp"
              className="flex items-center justify-center gap-1 text-xs mb-6 transition-colors hover:text-white"
              style={{ color: "#6B7280" }}
            >
              <ChevronRight size={12} className="rotate-180" />
              All courses
            </Link>
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
              style={{
                backgroundColor: "rgba(212,160,23,0.1)",
                color: "#D4A017",
                border: "1px solid rgba(212,160,23,0.3)",
              }}
            >
              <Sparkles size={14} />
              Half-day workshop
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "#FFFFFF" }}
            >
              Build Your Business with{" "}
              <span style={{ color: "#D4A017" }}>AI</span>
            </h1>
            <p
              className="text-lg max-w-xl mx-auto leading-relaxed mb-8"
              style={{ color: "#6B7280" }}
            >
              A 3&ndash;4 hour one-on-one session where we design, build, deploy,
              and hand you a working business toolkit — website, AI phone agent,
              SMS automation, email, and everything in between.
            </p>
            <p className="text-3xl font-bold" style={{ color: "#D4A017" }}>
              $600
            </p>
          </div>
        </section>

        {/* What This Is */}
        <section
          className="py-16 px-6"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6 text-center"
              style={{ color: "#FFFFFF" }}
            >
              What This <span style={{ color: "#D4A017" }}>Is</span>
            </h2>
            <div
              className="space-y-5 text-base leading-relaxed"
              style={{ color: "#9CA3AF" }}
            >
              <p>
                This is not a course about how to build a website. This is a
                session where we sit down together and actually build yours — in
                real time, using the same tools and stack that powers Cove
                Blades.
              </p>
              <p>
                You make the decisions — name, branding, pricing, service areas,
                tone. I handle the technical execution. By the time you leave,
                your site is live, your phone number is answering calls with AI,
                your texts are automated, and you have a clear picture of how to
                maintain all of it.
              </p>
              <p>
                If you want to understand the business model first before
                building anything, the{" "}
                <Link
                  href="/train-to-be-sharp/business-process"
                  className="underline transition-colors hover:text-white"
                  style={{ color: "#D4A017" }}
                >
                  Business Process &amp; Automation
                </Link>{" "}
                discussion is the better starting point. This workshop assumes
                you&rsquo;re ready to go.
              </p>
            </div>
          </div>
        </section>

        {/* What You Walk Out With */}
        <section
          className="py-16 px-6"
          style={{
            backgroundColor: "#161B22",
            borderTop: "1px solid #30363D",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3 text-center"
              style={{ color: "#FFFFFF" }}
            >
              What You{" "}
              <span style={{ color: "#D4A017" }}>Walk Out With</span>
            </h2>
            <p
              className="text-center text-sm mb-10 max-w-xl mx-auto"
              style={{ color: "#6B7280" }}
            >
              Everything below is built, deployed, and working before the session
              ends. You own all of it.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deliverables.map((d) => (
                <div
                  key={d.title}
                  className="rounded-xl border p-6"
                  style={{
                    backgroundColor: "#0D1117",
                    borderColor: "#30363D",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                  >
                    <d.icon size={20} style={{ color: "#D4A017" }} />
                  </div>
                  <h3
                    className="font-bold mb-2"
                    style={{ color: "#FFFFFF" }}
                  >
                    {d.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#9CA3AF" }}
                  >
                    {d.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Stack */}
        <section
          className="py-16 px-6"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6 text-center"
              style={{ color: "#FFFFFF" }}
            >
              The <span style={{ color: "#D4A017" }}>Stack</span>
            </h2>
            <p
              className="text-center text-sm mb-10"
              style={{ color: "#6B7280" }}
            >
              The same tools we use to build and run coveblades.com.
            </p>
            <div className="space-y-3">
              {toolStack.map((t) => (
                <div
                  key={t.name}
                  className="flex items-center gap-4 rounded-xl border p-4 sm:p-5"
                  style={{
                    backgroundColor: "#161B22",
                    borderColor: "#30363D",
                  }}
                >
                  <CheckCircle
                    size={18}
                    className="shrink-0"
                    style={{ color: "#D4A017" }}
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      className="font-bold text-sm"
                      style={{ color: "#FFFFFF" }}
                    >
                      {t.name}
                    </span>
                    <span
                      className="text-sm ml-2"
                      style={{ color: "#6B7280" }}
                    >
                      — {t.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p
              className="text-sm text-center mt-8 leading-relaxed max-w-xl mx-auto"
              style={{ color: "#9CA3AF" }}
            >
              Your site is deployed on Vercel, your code is on GitHub, your
              data is in Supabase. No proprietary lock-in. If you want to
              change something later — or hire someone else to — everything is
              standard, open, and yours.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section
          className="py-16 px-6"
          style={{
            backgroundColor: "#161B22",
            borderTop: "1px solid #30363D",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div
                className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(212,160,23,0.1)",
                  color: "#D4A017",
                  border: "1px solid rgba(212,160,23,0.3)",
                }}
              >
                <Clock size={14} />
                3&ndash;4 hours
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: "#FFFFFF" }}
              >
                How the Session{" "}
                <span style={{ color: "#D4A017" }}>Works</span>
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Decisions first",
                  detail:
                    "We start with the choices that shape everything else — your business name, the services you'll offer, your pricing, your service area, and the tone you want to set. This takes 20–30 minutes and drives the rest of the session.",
                },
                {
                  step: "2",
                  title: "Build in real time",
                  detail:
                    "I build while you watch and direct. Using Claude Code, the site comes together fast — pages, content, booking flow, contact forms. You'll see it take shape on screen and make calls on copy, layout, and features as we go.",
                },
                {
                  step: "3",
                  title: "Deploy and connect",
                  detail:
                    "We push the site live on Vercel, set up your domain, connect your business phone number to the AI agent, wire up SMS automation, and configure your email pipeline. Everything is tested end-to-end before we move on.",
                },
                {
                  step: "4",
                  title: "Handoff and walkthrough",
                  detail:
                    "I walk you through how to update your site, adjust your AI agent's script, manage customer records, and handle the ongoing basics. You leave with a working business toolkit and the knowledge to maintain it.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="flex items-start gap-4 rounded-xl border p-5 sm:p-6"
                  style={{
                    backgroundColor: "#0D1117",
                    borderColor: "#30363D",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{
                      backgroundColor: "rgba(212,160,23,0.15)",
                      color: "#D4A017",
                    }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <h3
                      className="font-bold mb-1"
                      style={{ color: "#FFFFFF" }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#9CA3AF" }}
                    >
                      {s.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* After the Session */}
        <section
          className="py-16 px-6"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6 text-center"
              style={{ color: "#FFFFFF" }}
            >
              After the{" "}
              <span style={{ color: "#D4A017" }}>Session</span>
            </h2>
            <div
              className="space-y-5 text-base leading-relaxed"
              style={{ color: "#9CA3AF" }}
            >
              <p>
                Everything we build is yours — the code, the accounts, the
                domain. There are no ongoing fees to me. Your hosting and
                services (Vercel, Supabase, phone number) have their own costs,
                which are generally minimal at startup scale and we&rsquo;ll
                discuss during the session.
              </p>
              <p>
                If something breaks or you need changes down the road, you have
                two options: make the changes yourself (the maintenance
                walkthrough covers the basics), or reach out and we can do a
                follow-up session.
              </p>
              <p>
                The goal is independence. You shouldn&rsquo;t need me to keep
                your business running.
              </p>
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section
          className="py-16 px-6"
          style={{
            backgroundColor: "#161B22",
            borderTop: "1px solid #30363D",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-8 text-center"
              style={{ color: "#FFFFFF" }}
            >
              Who This Is{" "}
              <span style={{ color: "#D4A017" }}>For</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "You've completed the sharpening course and want to start taking customers",
                "You already sharpen but have no website, no online booking, and no automation",
                "You want a professional presence without hiring a web developer or agency",
                "You're ready to go — you just need the tools built and handed to you",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 p-4 rounded-lg border"
                  style={{
                    backgroundColor: "#0D1117",
                    borderColor: "#30363D",
                  }}
                >
                  <CheckCircle
                    size={16}
                    className="shrink-0 mt-0.5"
                    style={{ color: "#D4A017" }}
                  />
                  <span
                    className="text-sm leading-relaxed"
                    style={{ color: "#9CA3AF" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sign Up & Pay */}
        <section
          className="py-20 px-6"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <div
                className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(212,160,23,0.1)",
                  color: "#D4A017",
                  border: "1px solid rgba(212,160,23,0.3)",
                }}
              >
                <DollarSign size={14} />
                $600
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-3"
                style={{ color: "#FFFFFF" }}
              >
                Sign Up &{" "}
                <span style={{ color: "#D4A017" }}>Get Started</span>
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Reserve your one-on-one build session.
              </p>
            </div>
            <div
              className="rounded-xl border p-5 sm:p-8"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              <CourseSignUp
                courseSlug="build-your-business"
                courseName="Build Your Business with AI — Hands-On"
                price="$600"
                priceNote="Tuition is non-refundable."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="py-16 px-6 text-center"
          style={{
            backgroundColor: "#161B22",
            borderTop: "1px solid #30363D",
          }}
        >
          <div className="max-w-xl mx-auto">
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: "#FFFFFF" }}
            >
              Want to <span style={{ color: "#D4A017" }}>Talk First</span>?
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              Happy to walk you through what the session looks like, what you
              need to bring, and whether it fits where you are.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:6042108180"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
                style={{ borderColor: "#D4A017", color: "#D4A017" }}
              >
                <Phone size={16} />
                604 210 8180
              </a>
              <Link
                href="/train-to-be-sharp"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-colors hover:text-white"
                style={{ color: "#6B7280" }}
              >
                <ChevronRight size={14} className="rotate-180" />
                All courses
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
