import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  base: "./", // <- 커스텀 도메인, Pages에서 상대경로 사용
  plugins: [react()],
})
