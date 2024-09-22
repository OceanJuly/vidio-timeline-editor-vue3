// @ts-ignore
import ViteProxyServer from './viteUtil/VitePluginMock/vite-plugin-mock'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VueHooksPlusResolver } from '@vue-hooks-plus/resolvers'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import { fileURLToPath, URL } from 'node:url'
import Icons from 'unplugin-icons/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'node:path'
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const fs = require('fs')
import fs from 'fs'
const OpenSSl = process.env?.npm_lifecycle_event === 'dev-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: OpenSSl,
    https: OpenSSl && {
      key: fs.readFileSync('viteUtil/cert/key.pem'),
      cert: fs.readFileSync('viteUtil/cert/cert.pem')
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        {
          lodash: ['isEqual']
        }
      ],
      dts: './auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      },
      resolvers: [
        ElementPlusResolver(),
        VueHooksPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon'
        })
      ]
    }),
    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep']
        }),
        // 自动导入 Element Plus 组件
        ElementPlusResolver()
      ]
    }),
    Icons({
      autoInstall: true
    }),
    // 本地代理服务
    ViteProxyServer()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      pages: path.resolve(__dirname, './src/pages')
    }
  }
})
