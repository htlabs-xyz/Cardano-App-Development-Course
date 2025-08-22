import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@meshsdk/core", "@meshsdk/core-cst"],
  reactStrictMode: true,
  webpack: function (config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};

export default nextConfig;