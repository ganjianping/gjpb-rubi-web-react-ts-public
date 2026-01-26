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
        // Forward all headers
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying request to:', proxyReq.path);
            console.log('Original method:', req.method);
            console.log('Proxy method:', proxyReq.method);
            // Ensure the method is preserved
            if (req.method) {
              proxyReq.method = req.method;
            }
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


