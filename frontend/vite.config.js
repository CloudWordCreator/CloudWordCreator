import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Djangoのstaticディレクトリに出力する
    outDir: resolve(__dirname, '../static/result_frontend'),
    // アセットのハッシュ化を無効化（Djangoテンプレートで指定しやすくするため）
    // ※本番運用ではmanifest.jsonを使うのが一般的だが、今回は簡易化のために固定名にする
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      }
    },
    // 空にする
    emptyOutDir: true,
  },
  // 開発サーバーの設定（今回はビルドモードメインで進めるが念のため）
  server: {
    origin: 'http://localhost:5173',
  }
})
