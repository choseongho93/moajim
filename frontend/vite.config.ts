import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  base: "/", // <- path 기반 라우팅(/tax/...): 딥링크에서도 에셋이 /assets/...로 절대 해석되도록 절대경로 사용
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            if ('headersSent' in res && !res.headersSent) {
              (res as any).writeHead(502, { 'Content-Type': 'application/json' })
              ;(res as any).end(JSON.stringify({ error: 'Worker dev server not running. Run: npx wrangler dev' }))
            }
          })
        },
      }
    }
  }
})
