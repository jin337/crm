import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

import legacy from '@vitejs/plugin-legacy'
import { resolve } from 'path'
import compression from 'vite-plugin-compression'

import federation from '@originjs/vite-plugin-federation'

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
    federation({
      name: 'hostApp',
      filename: 'remoteEntry.js',
      remotes: {
        // 工程管理
        projectApp: {
          external: 'http://192.168.0.42:3001/project/remoteEntry.js',
          from: 'vite',
          format: 'esm',
        },
        // 财务管理
        financeApp: {
          external: 'http://192.168.0.42:3002/finance/remoteEntry.js',
          from: 'vite',
          format: 'esm',
        },
        // 审批
        oaApp: {
          external: 'http://192.168.0.42:3003/oa/remoteEntry.js',
          from: 'vite',
          format: 'esm',
        },
        // 人力资源
        hrmApp: {
          external: 'http://192.168.0.42:3004/hrm/remoteEntry.js',
          from: 'vite',
          format: 'esm',
        },
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.3.1',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.3.1',
        },
        'react-router': {
          singleton: true,
          requiredVersion: '^7.4.1',
        },
        'react-redux': {
          singleton: true,
          requiredVersion: '^9.2.0',
        },
        '@reduxjs/toolkit': {
          singleton: true,
          requiredVersion: '^2.6.1',
        },
        axios: {
          singleton: true,
          requiredVersion: '^1.8.4',
        },
      },
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
