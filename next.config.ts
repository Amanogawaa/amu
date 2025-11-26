import type { NextConfig } from 'next';

const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  async rewrites() {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    return [
      {
        source: '/api/:path*',
        destination: isDevelopment
          ? 'http://localhost:8080/api/:path*'
          : `${apiUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: isDevelopment
          ? 'http://localhost:8080/uploads/:path*'
          : `${apiUrl}/uploads/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
              'https://*.firebaseapp.com https://*.google.com',
            ].join(' '),
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },

      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      // Allow localhost for development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (!isServer && !isDevelopment) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: './bundle-analysis.html',
          openAnalyzer: false,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
