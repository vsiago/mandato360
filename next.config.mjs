/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mandato360/editor"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
