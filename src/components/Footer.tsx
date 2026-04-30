import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, ExternalLink, Clock } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "How We Sharpen", href: "/how-we-sharpen-your-knives" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Mobile Service", href: "/#mobile-service" },
  { label: "Drop Off", href: "/#drop-off" },
  { label: "Restaurants", href: "/restaurants" },
  { label: "Events", href: "/event-sharpening-service" },
  { label: "Training", href: "/train-to-be-sharp" },
  { label: "Service Areas", href: "/service-area" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const businessHours = [
  { days: "Monday – Saturday", hours: "10:00 am – 7:00 pm" },
  { days: "Drop Box", hours: "24 / 7" },
];

// Custom SVG social icons (lucide-react doesn't include Instagram/Facebook/YouTube)
const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/coveblades/",
    Icon: InstagramIcon,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/coveblades",
    Icon: FacebookIcon,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@coveblades",
    Icon: YouTubeIcon,
  },
];

export default function Footer() {
  return (
    <footer
      className="bg-[#0D1117] border-t border-[#30363D]"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 group mb-4"
              aria-label="Cove Blades Home"
            >
              <Image src="/logo-icon-512.png" alt="" width={28} height={28} />
              <span
                className="text-[#D4A017] group-hover:text-[#e8b82a] font-bold tracking-widest text-sm uppercase transition-colors duration-200"
                style={{ letterSpacing: "0.18em" }}
              >
                Cove Blades
              </span>
            </Link>
            <p className="text-[#6B7280] text-sm leading-relaxed mt-3 max-w-xs">
              Professional cutlery sharpening services in Vancouver. Mobile service,
              drop-off &amp; mail-in options available.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-md bg-[#161B22] border border-[#30363D] text-[#6B7280] hover:text-[#D4A017] hover:border-[#D4A017]/50 transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#6B7280] hover:text-[#D4A017] text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">
              Hours
            </h3>
            <ul className="flex flex-col gap-3">
              {businessHours.map(({ days, hours }) => (
                <li key={days} className="flex items-start gap-2">
                  <Clock size={14} className="text-[#D4A017] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-white text-sm">{days}</p>
                    <p className="text-[#6B7280] text-xs mt-0.5">{hours}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">
              Contact
            </h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="tel:6042108180"
                  className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#D4A017] text-sm transition-colors duration-200 group"
                >
                  <Phone
                    size={14}
                    className="text-[#D4A017] shrink-0 group-hover:scale-110 transition-transform duration-200"
                  />
                  604 210 8180
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@coveblades.com"
                  className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#D4A017] text-sm transition-colors duration-200 group"
                >
                  <Mail
                    size={14}
                    className="text-[#D4A017] shrink-0 group-hover:scale-110 transition-transform duration-200"
                  />
                  info@coveblades.com
                </a>
              </li>
              <li className="pt-1">
                <a
                  href="https://www.instagram.com/coveblades/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#6B7280] hover:text-[#D4A017] text-sm transition-colors duration-200"
                >
                  Follow us
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#30363D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col items-center gap-3">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[#6B7280] text-xs">
              &copy; {new Date().getFullYear()} Cove Blades. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="text-[#6B7280] text-xs hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-[#6B7280] text-xs hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
          <p className="text-[#6B7280] text-xs text-center">
            Built with love by{" "}
            <a
              href="https://snapsonic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4A017] transition-colors"
            >
              Snapsonic
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
