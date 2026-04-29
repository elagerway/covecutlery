import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  turbopack: {},
  async redirects() {
    return [
      // Legacy WordPress blog landing on coveblades.com — preserve inbound links
      { source: "/staysharp", destination: "/blog", permanent: true },
      { source: "/staysharp/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default withPWA(nextConfig);
