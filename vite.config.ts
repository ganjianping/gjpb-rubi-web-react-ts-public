import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/rubi/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    devSourcemap: true,
  },
  build: {
    cssMinify: false,
  },
  server: {
    port: 3003,
    cors: true,
    host: true,
    proxy: {
      '/blog': {
        // target: 'http://localhost:8082',
        target: 'https://www.ganjianping.com',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying request to:', proxyReq.path);
            console.log('Original method:', req.method);
            console.log('Proxy method:', proxyReq.method);
            
            // Remove problematic headers that might cause 403
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
            
            // Set headers to match direct backend access
            proxyReq.setHeader('Host', 'localhost:8082');
            proxyReq.setHeader('Connection', 'keep-alive');
            
            // Fix for PUT/POST/PATCH requests - ensure Content-Length is set correctly
            if (req.method === 'PUT' || req.method === 'POST' || req.method === 'PATCH') {
              if (!proxyReq.getHeader('Content-Length') && !proxyReq.getHeader('Transfer-Encoding')) {
                proxyReq.setHeader('Content-Length', '0');
              }
              // Ensure Content-Type is set
              if (!proxyReq.getHeader('Content-Type')) {
                proxyReq.setHeader('Content-Type', 'application/json');
              }
            }
            
            console.log('Request headers:', proxyReq.getHeaders());
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Proxy response status:', proxyRes.statusCode);
            console.log('Request method:', req.method);
          });
        },
      },
    },
  },
})


