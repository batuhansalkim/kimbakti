/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    // RSC optimizasyonları
    serverActions: false,
    optimizeCss: true,
  },
  // Performans optimizasyonları
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Cache optimizasyonları
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Chunk optimizasyonu
  webpack: (config, { dev, isServer }) => {
    // Chunk boyutunu optimize et
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 70000,
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
        },
      },
    };

    return config;
  },
  images: {
    domains: ['lh3.googleusercontent.com'], // Google profil resimleri için
  },
  env: {
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-5PX3HCHB98",
  }
};

module.exports = nextConfig; 