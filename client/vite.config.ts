import type { UserConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default {
  esbuild: {
    supported: {
      'top-level-await': true,
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  resolve: {
    dedupe: ['lit', 'lit-html', 'lit-element', '@lit/reactive-element'],
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: '../dot-net-gateway/DotNetGateway/bin/Release/net8.0/browser-wasm/AppBundle/_framework/*',
          dest: 'assets',
        },
      ],
    }),
  ],
} satisfies UserConfig
