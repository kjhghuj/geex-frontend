import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const medusaBackendUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  (isDev ? "http://localhost:9030" : "https://api.geexfans.com");
const configuredImageDomains = (process.env.NEXT_PUBLIC_IMAGE_DOMAINS || "")
  .split(",")
  .map((domain) => domain.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  images: {
    // In development, disable image optimization to avoid private IP blocking
    // Next.js 16+ blocks images that resolve to private IPs for security (SSRF prevention)
    unoptimized: isDev,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "videos.pexels.com",
      },
      ...configuredImageDomains.map((hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
      {
        protocol: "http",
        hostname: "localhost",
        port: "9030",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "9030",
      },
    ],
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [
      {
        source: '/api/medusa/:path*',
        destination: `${medusaBackendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
