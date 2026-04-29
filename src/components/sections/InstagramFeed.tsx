import { ExternalLink } from "lucide-react";
import { getInstagramFeed } from "@/lib/instagram";
import InstagramFeedClient from "@/components/sections/InstagramFeedClient";

const InstagramIcon = () => (
  <svg
    width="16"
    height="16"
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

export default async function InstagramFeed() {
  const posts = await getInstagramFeed(6);

  // Graceful fallback: render the section header + a follow CTA, no grid
  if (posts.length === 0) {
    return (
      <section className="py-16 px-6" style={{ backgroundColor: "#0D1117", borderTop: "1px solid #30363D" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
            Recent <span style={{ color: "#D4A017" }}>Work</span>
          </h2>
          <p className="text-base mb-6" style={{ color: "#6B7280" }}>
            See the day-to-day on Instagram.
          </p>
          <a
            href="https://www.instagram.com/coveblades/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
            style={{ borderColor: "#D4A017", color: "#D4A017" }}
          >
            <InstagramIcon />
            Follow @coveblades
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6" style={{ backgroundColor: "#0D1117", borderTop: "1px solid #30363D" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "#FFFFFF" }}>
            Recent <span style={{ color: "#D4A017" }}>Work</span>
          </h2>
          <p className="text-base" style={{ color: "#6B7280" }}>
            Real edges from the bench. Tap any post to view it here, or follow{" "}
            <a
              href="https://www.instagram.com/coveblades/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "#D4A017" }}
            >
              @coveblades
            </a>{" "}
            on Instagram.
          </p>
        </div>

        <InstagramFeedClient posts={posts} />

        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/coveblades/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
            style={{ borderColor: "#D4A017", color: "#D4A017" }}
          >
            <InstagramIcon />
            Follow @coveblades for more
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
