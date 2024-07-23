/** @type {import('next').NextConfig} */
const config = require('./config');

const nextConfig = {
  reactStrictMode: false,
  basePath: '',
  images: {
    remotePatterns: config.remotePatterns,
  },
  async redirects() {
    return config.redirects;
  },
};

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: process.env.NODE_ENV === 'development' ? false : true,
  },
});

module.exports =
  process.env.NODE_ENV === 'development' ? nextConfig : withPWA(nextConfig);
