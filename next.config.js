// @ts-check
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
    return [
      {
        source: '/github',
        destination: 'https://www.github.com/redskull-127',
        permanent: true,
        basePath: false,
      },
      {
        source: '/linkedin',
        destination: 'https://www.linkedin.com/in/meertarbani/',
        permanent: true,
        basePath: false,
      },
      {
        source: '/twitter',
        destination: 'https://www.twitter.com/meertarbani',
        permanent: true,
        basePath: false,
      },
      {
        source: '/spotify',
        destination: 'https://open.spotify.com/user/to6rms2g0fzerpkwox1k4v33w',
        permanent: true,
        basePath: false,
      },
      {
        source: '/discord',
        destination: 'https://discord.com/users/redskull127',
        permanent: true,
        basePath: false,
      },
      {
        source: '/source-code',
        destination: 'https://github.com/redskull-127/Portfolio-2024',
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
