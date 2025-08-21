import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
    serverActions: {
      bodySizeLimit: "50mb", // Aumenta el límite según tus necesidades
    },
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "minio-api.zasdistributor.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "minio-api.zasdistributor.com",
        pathname: "/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
