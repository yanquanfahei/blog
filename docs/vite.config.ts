import { defineConfig } from 'vite'
import { SearchPlugin } from 'vitepress-plugin-search'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    SearchPlugin({
      // encode: false,
      tokenize: 'full'
    }),
    UnoCSS()
  ]
})
