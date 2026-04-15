/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mandato360/editor"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

export default nextConfig
