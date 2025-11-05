import type { NextConfig } from "next";

const nextConfig: NextConfig = {
experimental: {
    allowedDevOrigins: ['http://localhost:3001'],
  },
  
};

export default nextConfig;
