import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
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