/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint:{
    ignoreDuringBuilds: true,
  },
  outputFileTracingRoot: process.cwd(),
  output: 'standalone',
  productionBrowserSourceMaps: false, // Desactiva los source maps en producción
    images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_IMAGE_HOST,
        port: '3009',
        pathname: '/images/**',
      },
    ],
  },
}

module.exports = nextConfig
