import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { defineConfig } from 'vite'

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
  plugins: [react(), tailwindcss()],
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
