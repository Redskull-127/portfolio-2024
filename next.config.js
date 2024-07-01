/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  basePath: '',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    const SocialMediaLinks = require('./default-links').SocialMediaLinks;
    const SourceCodeLinks = require('./default-links').SourceCodeLinks;
    return [
      {
        source: '/github',
        destination: SocialMediaLinks.github,
        permanent: true,
        basePath: false,
      },
      {
        source: '/linkedin',
        destination: SocialMediaLinks.linkedin,
        permanent: true,
        basePath: false,
      },
      {
        source: '/twitter',
        destination: SocialMediaLinks.twitter,
        permanent: true,
        basePath: false,
      },
      {
        source: '/spotify',
        destination: SocialMediaLinks.spotify.user,
        permanent: true,
        basePath: false,
      },
      {
        source: '/discord',
        destination: SocialMediaLinks.discord,
        permanent: true,
        basePath: false,
      },
      {
        source: '/source-code',
        destination: SourceCodeLinks.frontend,
        permanent: true,
        basePath: false,
      },
    ];
  },
};

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
});

module.exports =
  process.env.NODE_ENV === 'development' ? nextConfig : withPWA(nextConfig);
