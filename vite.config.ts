import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

const fs = require('fs')

const openSSl = process.env?.npm_lifecycle_event === 'dev-ssl'

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		host: openSSl,
		https: openSSl && {
			key: fs.readdirSync('ViteUtil/cert/key.pem'),
			cert: fs.readdirSync('ViteUtil/cert/cert.pem')
		},
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp'
		}
	},
	plugins: [
		vue(),
		AutoImport({
			resolvers: [
				ElementPlusResolver(),
				// 自动导入图标组件
				IconsResolver({
					prefix: 'Icon'
				})
			]
		}),
		Components({
			// 自动导入 Element Plus 组件
			resolvers: [
				// 自动导入图标组件
				IconsResolver({
					prefix: 'Icon'
				}),
				ElementPlusResolver()
			]
		}),
		Icons({
			autoInstall: true
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		},
		extensions: ['.ts', '.js', '.vue', '.json']
	}
})
