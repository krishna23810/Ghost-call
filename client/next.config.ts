import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/Ghost-call";

const nextConfig: NextConfig = {
  // Set basePath for serving under kktechsolution.app/Ghost-call
  basePath: BASE_PATH,

  // Allow external reverse proxies and local dev origins
  allowedDevOrigins: [
    '*.loca.lt',
    'localhost:3000',
    '127.0.0.1',
    'kktechsolution.app',
  ],

  // Redirect root / to /Ghost-call automatically
  async redirects() {
    return [
      {
        source: '/',
        destination: BASE_PATH,
        basePath: false,
        permanent: false,
      },
    ];
  },

  // Proxy API requests to Express backend
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
