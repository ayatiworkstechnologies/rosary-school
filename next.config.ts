import type { NextConfig } from "next";

const backendUrl =
  (process.env.ROSARY_BACKEND_URL || "https://www.cmsapi.rosarychennai.com/").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
