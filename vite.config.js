import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    crx({ manifest }),
    viteStaticCopy({
      targets: [
        { src: 'style.css', dest: '' },
        { src: 'popup.js', dest: '' }
      ]
    })
  ]
})