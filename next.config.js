const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin(
  './lib/internationalization/request.ts',
);

/** @type {import('next').NextConfig} */
const config = require('./config');

const nextConfig = withNextIntl({
  reactStrictMode: false,
  basePath: '',
  images: {
    remotePatterns: config.remotePatterns,
  },
  async redirects() {
    return config.redirects;
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
      }),
    );

    return config;
  },
});

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
