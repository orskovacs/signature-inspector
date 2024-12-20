import type { UserConfig } from 'vite'

export default {
  esbuild: {
    supported: {
      'top-level-await': true
    },
  },
} satisfies UserConfig
