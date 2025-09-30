// next.config.ts
const withTM = require('next-transpile-modules')([
  '@ant-design/icons-svg'
]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  
  // Remove the custom webpack config for CSS - Next.js handles CSS modules by default
  // Keep only the rewrites config
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
    ];
  },
});

module.exports = nextConfig;