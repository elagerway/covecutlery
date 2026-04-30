import { Wrench, Leaf, ShieldCheck } from "lucide-react";

const values = [
  {
    icon: Wrench,
    label: "Professional Equipment",
    description: "Custom-built and Bucktool machines with Airplaten accessories",
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
            <span style={{ color: "#D4A017" }}>Cove Blades</span>
          </h2>
        </div>

        {/* Two-column: text + YouTube */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-14">
          {/* Text */}
          <div>
            <p
              className="text-base leading-relaxed"
              style={{ color: "#6B7280" }}
            >
              Based on the North Shore of Vancouver, Cove Blades has been
              delivering professional cutlery sharpening since 2020. We use
              custom-built and Bucktool sharpening machines with{" "}
              <a href="https://airplaten.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors" style={{ color: "#D4A017" }}>Airplaten</a>{" "}
              accessories to restore factory edges on all blade types — kitchen knives, axes, garden tools,
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

          {/* YouTube — custom thumbnail linking to the video */}
          <a
            href="https://www.youtube.com/watch?v=s6PMhZmC2Qk"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block rounded-xl border overflow-hidden transition-opacity duration-200 hover:opacity-95 active:scale-[0.99]"
            style={{
              backgroundColor: "#000",
              borderColor: "#30363D",
              aspectRatio: "16 / 9",
            }}
            aria-label="Watch Cove Blades on YouTube"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/video-poster.png"
              alt="Cove Blades — Japanese knife sharpening"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Subtle gradient for play-button contrast */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 60%)",
              }}
            />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-2xl"
                style={{ backgroundColor: "#FF0000" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <polygon points="8,5 19,12 8,19" />
                </svg>
              </div>
            </div>

            {/* Caption */}
            <div className="absolute left-0 right-0 bottom-0 px-5 pb-4">
              <p className="text-sm font-semibold" style={{ color: "#FFFFFF", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                Watch us on YouTube
              </p>
            </div>
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
