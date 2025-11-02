import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      // development proxy to backend API
      // {
      //   source: '/api/:path*',
      //   destination: 'http://localhost:8080/api/:path*/',
      // },
      // production proxy to backend API
      {
        source: '/api/:path*',
        destination: 'https://amu-api.onrender.com/api/:path*/',
      },
    ];
  },
};

export default nextConfig;
