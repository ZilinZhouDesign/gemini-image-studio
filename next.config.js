/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;
