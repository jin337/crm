import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { defineConfig } from 'vite'

import viteFederation from '@originjs/vite-plugin-federation'
import viteTailwindcss from '@tailwindcss/vite'
import viteAutoImport from 'unplugin-auto-import/vite'
import viteCompression from 'vite-plugin-compression'
import vitePluginImageTools from 'vite-plugin-image-tools'

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
    viteTailwindcss(),
    viteAutoImport({
      imports: [{ 'src/service/api': [['default', 'Http']] }, { 'src/config/hooks': [['default', 'Hooks']] }],
      dts: true,
    }),
    vitePluginImageTools({
      quality: 50,
      enableWebp: true,
    }),
    viteFederation({
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
    viteCompression({ threshold: 10240 }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false,
      },
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/chunks/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
})
