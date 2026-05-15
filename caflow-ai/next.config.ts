import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "images.unsplash.com"],
  },
};

export default nextConfig;
