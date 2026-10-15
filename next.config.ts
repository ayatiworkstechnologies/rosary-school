import type { NextConfig } from "next";

const backendUrl =
  process.env.ROSARY_BACKEND_URL || "http://89.167.92.220:8017";

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