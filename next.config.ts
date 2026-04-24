import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ─── Turbopack Root ─── */
  turbopack: {
    root: process.cwd(),
  },

  /* ─── Image Optimization ─── */
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  /* ─── Compiler Optimizations ─── */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  /* ─── Headers for Security ─── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://formsubmit.co; img-src 'self' data: blob:; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
