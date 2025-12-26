import { defineConfig } from 'tsdown'

// export default defineConfig({
//   entry: 'src/userScripts/index.ts',
//   outputOptions: {
//     format: 'iife',
//     name: 'v2ex-daily-avatar.user.js',
//     sourcemap: false,
//     dir: 'lib'
//   }
// })
export default defineConfig([
  {
    name: "Browser Config Manager - UMD",
    entry: {
      'configManager': "src/lib/configManager/Browser.ts"
    },
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
      dir: 'dist',
      file: 'dist/configManager.umd.js',
    },
    clean: false
  },
  {
    name: "Browser Config Manager - ESM",
    // entry: "src/lib/configManager/Browser.ts",
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
      // file: 'dist/configManager.esm.js',
    },
    clean: false
  }

  // {
  //   entry: "src/userScripts/index.ts",
  //   outputOptions: {
  //     format: "iife",
  //     name: "v2ex-daily-avatar.user.js",
  //     sourcemap: false,
  //     dir: 'dist'
  //   },
  // }
])