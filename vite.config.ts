import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiRequestMode = env.VITE_API_REQUEST_MODE === 'proxy' || env.VITE_API_REQUEST_MODE === 'direct'
    ? env.VITE_API_REQUEST_MODE
    : mode === 'production'
      ? 'proxy'
      : 'direct'
  const directApiUrl = trimTrailingSlash(env.VITE_BACKEND_API_URL || 'http://localhost:8000/api')
  const proxyTarget = directApiUrl.replace(/\/api$/, '')
  const server = apiRequestMode === 'proxy'
    ? {
        proxy: {
          '/api': {
            target: proxyTarget,
            changeOrigin: true,
            secure: false,
          },
        },
      }
    : undefined

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server,
    css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@/style/default.scss" as *;
        @use "@/style/flex.scss" as *;
        @use "@/style/layout.scss" as *;
        @use "@/style/variable.scss" as *;
        `
      }
    }
  }
  }
})
