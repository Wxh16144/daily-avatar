import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: "src/lib/configManager/Browser.ts",
    dts: false,
    outputOptions: {
      format: "umd",
      name: "DailyAvatarBrowserConfigManager",
      globals: {
        // https://github.com/jakearchibald/idb?tab=readme-ov-file#using-external-script-reference
        idb: 'idb'
      },
      inlineDynamicImports: true,
      minify: true,
      sourcemap: false,
      entryFileNames: 'configManager.umd.js',
      dir: 'dist',
    },
    clean: false
  },
  {
    entry: {
      'configManager': "src/lib/configManager/Browser.ts"
    },
    dts: { build: true },
    outputOptions: {
      format: "esm",
      minify: true,
      inlineDynamicImports: true,
      sourcemap: false,
      dir: 'dist',
    },
    clean: false
  },
])