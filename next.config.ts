import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: { position: 'bottom-right' }
  // disable source maps in production for better security and performance
  // productionBrowserSourceMaps: false,
  // experimental: {
  //   serverSourceMaps: false
  //   webpackMemoryOptimizations: false
  // }
}

export default nextConfig
