/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint:{
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false, // Desactiva los source maps en producción
}

module.exports = nextConfig
