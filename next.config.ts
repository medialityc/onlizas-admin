import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
    serverActions: {
      bodySizeLimit: "50mb",
    },
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**.onlizas.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.onlizas.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**.zasdistributor.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.zasdistributor.com",
        pathname: "/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
