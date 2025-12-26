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
  banner: Record<string, string>
}

const scripts: ScriptConfig[] = [
  {
    id: 'v2ex-daily-avatar',
    banner: {
      // 每天自动更新 V2EX 头像
      name: 'V2EX Daily Avatar',
      version: pkg.version,
      description: 'Automatically update V2EX avatar daily.',
      grant: 'unsafeWindow',
      ...sharedBanner,
      'run-at': 'document-start',
      noframes: '',
      include: '*',
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
      outDir:'userscripts',
      banner: generateBanner({
        ...script.banner,
        ...sharedBanner,
      }),
    }
  }),
)

function generateBanner(properties: Record<string, string>) {
  const maxLength = Math.max(
    ...Object.keys(properties).map((key) => key.length),
  )
  const lines = Object.entries(properties).map(([key, value]) => {
    return `// @${key.padEnd(maxLength + 1)} ${value}`
  })
  return `// ==UserScript==
${lines.join('\n')}
// ==/UserScript==`
}
