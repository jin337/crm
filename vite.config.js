import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

import legacy from '@vitejs/plugin-legacy'
import { resolve } from 'path'
import compression from 'vite-plugin-compression'

export default defineConfig({
  server: {
    open: true,
    port: 3000,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      src: resolve('src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    compression({ threshold: 10240 }),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/chunks/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: {
          'chunk-vendor': ['react', 'react-dom', 'react-router', 'react-redux', '@reduxjs/toolkit', 'axios'],
          'chunk-other': ['@arco-design/web-react'],
        },
      },
    },
  },
})
