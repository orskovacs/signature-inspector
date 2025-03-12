import type { UserConfig } from 'vite'

export default {
  esbuild: {
    supported: {
      'top-level-await': true
    },
  },
  server :{
    fs: {
      allow: [".."]
    }
  }
} satisfies UserConfig
