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
