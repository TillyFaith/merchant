import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 配置代理

  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://121.40.26.165',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
  // 添加JPG格式到资源包含列表
  assetsInclude: ['**/*.JPG', '**/*.jpg'],
  server: {
    proxy: {
      // 匹配接口路径前缀
      '/knowledge': {
        target: 'http://8.136.47.218', // 后端真实地址
        changeOrigin: true,
        // 可选：如果后端也支持 HTTPS，可改为 https
        // secure: false, // 允许代理到 HTTP 地址
        rewrite: (path) => path, // 若有前缀需要重写可调整
      },
    },
  },
})
