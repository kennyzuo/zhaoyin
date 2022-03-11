import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/services': {
        target: 'http://101.132.103.81:8080',
        changeOrigin: true
      }
    }
  }
})
