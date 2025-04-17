import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

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
    federation({
      name: 'hostApp',
      filename: 'remoteEntry.js',
      remotes: {
        // 工程管理
        projectApp: 'http://192.168.0.42:3001/assets/remoteEntry.js',
        // 财务管理
        financeApp: 'http://192.168.0.42:3002/assets/remoteEntry.js',
        // 审批
        oaApp: 'https://oa.jin337.top/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router', 'react-redux', '@reduxjs/toolkit', 'axios'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
