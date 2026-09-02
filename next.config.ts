import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    remotePatterns: [
      { protocol: "https", hostname: "cdn.alquran.cloud" },
      { protocol: "https", hostname: "cdn.islamic.network" },
    ],
  },
};

export default nextConfig;
