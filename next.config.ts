import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${process.env.ROSARY_BACKEND_URL}/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${process.env.ROSARY_BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;