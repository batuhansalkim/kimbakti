/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'], // Google profil resimleri için
  },
  env: {
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-5PX3HCHB98",
  }
};

module.exports = nextConfig; 