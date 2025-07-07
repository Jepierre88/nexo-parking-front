/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint:{
    ignoreDuringBuilds: true,
  },
  outputFileTracingRoot: process.cwd(),
  output: 'standalone',
  productionBrowserSourceMaps: false, // Desactiva los source maps en producción

}

module.exports = nextConfig
