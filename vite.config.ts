import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import pkg from './package.json';

export default defineConfig({
  define: {
    '__PKG_VERSION__': JSON.stringify(pkg.version),
    '__PKG_NAME__': JSON.stringify(pkg.name),
  },
  plugins: [
    preact({
      reactAliasesEnabled: false
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    lib: {
      entry: './src/main.tsx',
      name: 'daily_avatar_UI',
      fileName: () => 'index.js',
      formats: ['umd'],
    },
    rollupOptions: {
      output: {
        extend: true,
        inlineDynamicImports: true,
        manualChunks: undefined,
      }
    },
    // minify: 'terser',
    cssCodeSplit: false,
    sourcemap: false,
  }
});