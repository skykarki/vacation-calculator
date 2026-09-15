import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.monkeycode-ai.live"],
  experimental: {
    optimizePackageImports: ["date-fns"],
  },
};

export default nextConfig;
