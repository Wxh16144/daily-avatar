import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [
    preact()
  ],
  build: {
    lib: {
      entry: './src/index.js',
      name: 'V2EX_daily_avatar',
      fileName: 'main',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        extend: true,
        inlineDynamicImports: true,
        manualChunks: undefined
      }
    },
    minify: 'terser',
    cssCodeSplit: false,
    sourcemap: false
  }
});