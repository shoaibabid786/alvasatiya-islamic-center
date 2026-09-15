import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  async redirects() {
    return [
      { source: "/institutions/alvasatiya-it-lab", destination: "/institutions/ths-it-lab", permanent: true },
      { source: "/login/admin", destination: "/login", permanent: false },
      { source: "/login/teacher", destination: "/login", permanent: false },
      { source: "/login/student", destination: "/login", permanent: false },
    ];
  },
  compress: true,
  poweredByHeader: false,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.alquran.cloud" },
      { protocol: "https", hostname: "cdn.islamic.network" },
    ],
  },
};

export default nextConfig;
