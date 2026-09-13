import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

function trailingSlashRedirect(): Plugin {
  return {
    name: 'trailing-slash-redirect',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/Ghost-call' || req.url?.startsWith('/Ghost-call?')) {
          const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
          res.writeHead(301, { Location: `/Ghost-call/${query}` });
          res.end();
          return;
        }
        next();
      });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/Ghost-call' || req.url?.startsWith('/Ghost-call?')) {
          const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
          res.writeHead(301, { Location: `/Ghost-call/${query}` });
          res.end();
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: '/Ghost-call/',
  plugins: [
    react(),
    tailwindcss(),
    trailingSlashRedirect(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
