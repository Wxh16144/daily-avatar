import fs from 'fs'
import { defineConfig, type UserConfig } from 'tsdown'

const pkg = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
)

const sharedBanner = {
  author: 'Wuxh <wuxh16144@qq.com>',
  homepage: 'https://github.com/wxh16144/daily-avatar',
  supportURL: 'https://github.com/wxh16144/daily-avatar/issues',
  license: 'MIT',
}

interface ScriptConfig {
  id: string
  banner: Record<string, string | string[]>
}

const isProd = process.env.NODE_ENV !== 'dev';

const scripts: ScriptConfig[] = [
  {
    id: 'v2ex-daily-avatar',
    banner: {
      // 每天自动更新 V2EX 头像
      name: 'V2EX Daily Avatar',
      namespace: 'https://github.com/wxh16144/daily-avatar',
      version: pkg.version,
      description: 'Automatically update V2EX avatar daily.',
      icon: 'https://www.v2ex.com/static/img/icon_rayps_64.png',
      match: [
        '*://v2ex.com/*',
        '*://www.v2ex.com/*',
      ],
      grant: [
        'unsafeWindow',
        'GM_xmlhttpRequest',
        'GM_setValue',
        'GM_getValue',
        'GM_deleteValue',
        'GM_registerMenuCommand',
        'GM_unregisterMenuCommand',
      ],
      connect: [
        'unpkg.com',
        'source.unsplash.com',
        'api.dicebear.com',
        '*',
      ],
      require: [
        'https://unpkg.com/jquery@3.3.1/dist/jquery.slim.min.js',
        'https://unpkg.com/idb@8.0.3/build/umd.js',
        `https://unpkg.com/@wuxh/daily-avatar@${pkg.version}`,
      ],
      ...sharedBanner,
      'run-at': 'document-idle',
      noframes: '',
    },
  },
]

export default defineConfig(
  scripts.map((script): UserConfig => {
    return {
      entry: `./src/userScripts/${script.id}/index.ts`,
      platform: 'browser',
      format: 'iife',
      minify: 'dce-only',
      outputOptions: {
        entryFileNames: `${script.id}.user.js`,
      },
      clean: false,
      outDir: 'userscripts',
      banner: generateBanner({
        ...script.banner,
        ...sharedBanner,
      }),
    }
  }),
)

function generateBanner(properties: Record<string, string | string[]>) {
  const maxLength = Math.max(
    ...Object.keys(properties).map((key) => key.length),
  )
  const lines = Object.entries(properties).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map((v) => `// @${key.padEnd(maxLength + 1)} ${v}`)
    }
    return `// @${key.padEnd(maxLength + 1)} ${value}`
  })
  return `// ==UserScript==
${lines.join('\n')}
// ==/UserScript==`
}
