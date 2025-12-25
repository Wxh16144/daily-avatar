import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/userScripts/index.ts',
  outputOptions: {
    format: 'iife',
    name: 'v2ex-daily-avatar.user.js',
    sourcemap: false,
    dir: 'lib'
  }
})