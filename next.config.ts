import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['muhammara'],
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('muhammara');
    }
    return config;
  },
};

export default nextConfig;
