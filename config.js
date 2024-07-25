const SocialMediaLinks = require('./site-config').SocialMediaLinks;
const SourceCodeLinks = require('./site-config').SourceCodeLinks;

const redirects = [
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
  {
    source: 'meet',
    destination: 'https://calendly.com/meertarbani/meet-with-meer',
    permanent: true,
    basePath: false,
  },
];

const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'i.scdn.co',
    pathname: '/image/**',
  },
  {
    protocol: 'https',
    hostname: 'i2o.scdn.co',
    pathname: '/image/**',
  },
  {
    protocol: 'https',
    hostname: 'lh3.googleusercontent.com',
    pathname: '/**',
  },
];

module.exports = {
  redirects,
  remotePatterns,
};
