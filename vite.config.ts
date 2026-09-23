import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/node'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ]
})
