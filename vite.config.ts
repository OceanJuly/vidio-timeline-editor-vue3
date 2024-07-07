import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
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
