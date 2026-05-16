import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy: redireciona /api/* para o backend Express na porta 4000
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/:path*",
      },
    ];
  },
};

export default nextConfig;
