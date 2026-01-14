import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'tailark.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],

  }
};

export default nextConfig;
