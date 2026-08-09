import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
  // 🚀 THIS FIXES MOBILE STYLING 100%: Tells Next.js to load CSS/JS directly from ghost-call deployment
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://ghost-call-theta.vercel.app' : undefined,

  // Allow external local tunnels (localtunnel, mobile IP) in development
  allowedDevOrigins: [
    '*.loca.lt',
    'localhost:3000',
    '127.0.0.1',
  ],

  // Next.js API Proxy Rewrites for Mobile Tunneling
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },

  // Allow WebRTC and media APIs
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Permissions-Policy', value: 'camera=*, microphone=*, display-capture=*' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

export default nextConfig;
