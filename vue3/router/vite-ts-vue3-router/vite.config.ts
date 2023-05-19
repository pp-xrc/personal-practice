import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
    resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js' //vue 别名配置为 vue/dist/vue.esm-bundler.js，以便使用正确的构建版本
    }
  },
})
