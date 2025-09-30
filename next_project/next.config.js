// next.config.js
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
    ];
  },
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;