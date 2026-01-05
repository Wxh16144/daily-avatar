import fs from 'fs'
import { defineConfig, type UserConfig } from 'tsdown'

const pkg = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
)

const sharedDefine = {
  '__PKG_VERSION__': JSON.stringify(pkg.version),
  '__PKG_NAME__': JSON.stringify(pkg.name),
  'import.meta.env': JSON.stringify({}),
}

interface LibConfig {
  name: string
  entry: string
  globalName: string
  globals?: Record<string, string>
}

const libs: LibConfig[] = [
  {
    name: 'configManager',
    entry: 'src/lib/configManager/index.ts',
    globalName: 'DailyAvatarBrowserConfigManager',
    globals: {
      idb: 'idb',
    },
  },
  {
    name: 'configResolver',
    entry: 'src/lib/configResolver/index.ts',
    globalName: 'DailyAvatarConfigResolver',
  },
]

export default defineConfig(
  libs.flatMap((lib): UserConfig[] => [
    {
      entry: lib.entry,
      dts: false,
      outputOptions: {
        format: 'umd',
        name: lib.globalName,
        globals: lib.globals,
        inlineDynamicImports: true,
        minify: true,
        sourcemap: false,
        entryFileNames: `${lib.name}.umd.js`,
        dir: 'dist',
      },
      clean: false,
      define: sharedDefine,
    },
    {
      entry: {
        [lib.name]: lib.entry,
      },
      dts: { build: true },
      outputOptions: {
        format: 'esm',
        minify: true,
        inlineDynamicImports: true,
        sourcemap: false,
        dir: 'dist',
      },
      clean: false,
      define: sharedDefine,
    },
  ]),
)