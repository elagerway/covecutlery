import { Wrench, Leaf, ShieldCheck } from "lucide-react";

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);

const values = [
  {
    icon: Wrench,
    label: "Professional Equipment",
    description: "Tormek and Wicked Edge sharpening systems",
  },
  {
    icon: Leaf,
    label: "Eco-Friendly Process",
    description: "Sustainable methods, minimal waste",
  },
  {
    icon: ShieldCheck,
    label: "30-Day Guarantee",
    description: "We stand behind every blade we sharpen",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-20 px-6"
      style={{ backgroundColor: "#0D1117" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "#FFFFFF" }}
          >
            About{" "}
            <span style={{ color: "#D4A017" }}>Cove Cutlery</span>
          </h2>
        </div>

        {/* Two-column: text + YouTube */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-14">
          {/* Text */}
          <div>
            <p
              className="text-base leading-relaxed"
              style={{ color: "#6B7280" }}
            >
              Based on the North Shore of Vancouver, Cove Cutlery has been
              delivering professional knife sharpening since 2020. We use
              professional Tormek and Wicked Edge systems to restore factory
              edges on all blade types — kitchen knives, axes, garden tools,
              and more.
            </p>
            <p
              className="text-base leading-relaxed mt-5"
              style={{ color: "#6B7280" }}
            >
              Every blade gets sharpened, honed, sanitized, and sharpness
              tested before return. We stand behind our work with a{" "}
              <span style={{ color: "#D4A017" }} className="font-semibold">
                30-day guarantee
              </span>
              .
            </p>
          </div>

          {/* YouTube placeholder */}
          <a
            href="https://www.youtube.com/@covecutlery"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center justify-center rounded-xl border overflow-hidden transition-opacity duration-200 hover:opacity-90 active:scale-[0.99]"
            style={{
              backgroundColor: "#161B22",
              borderColor: "#30363D",
              minHeight: "260px",
              background:
                "linear-gradient(135deg, #161B22 0%, #1a1f2b 50%, #161B22 100%)",
            }}
            aria-label="Watch Cove Cutlery on YouTube"
          >
            {/* Subtle grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)",
              }}
            />

            {/* Play button circle */}
            <div
              className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
              style={{ backgroundColor: "#FF0000" }}
            >
              <YouTubeIcon className="w-8 h-8 text-white" />
            </div>

            <p
              className="relative z-10 text-base font-semibold mb-1"
              style={{ color: "#FFFFFF" }}
            >
              Watch us on YouTube
            </p>
            <p
              className="relative z-10 text-sm"
              style={{ color: "#6B7280" }}
            >
              @covecutlery
            </p>
          </a>
        </div>

        {/* Values row */}
        <div
          className="pt-10 border-t"
          style={{ borderColor: "#30363D" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center p-6 rounded-xl border"
                  style={{
                    backgroundColor: "#161B22",
                    borderColor: "#30363D",
                  }}
                >
                  <Icon
                    className="w-7 h-7 mb-4"
                    style={{ color: "#D4A017" }}
                  />
                  <p
                    className="font-semibold text-sm mb-2"
                    style={{ color: "#FFFFFF" }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#6B7280" }}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
