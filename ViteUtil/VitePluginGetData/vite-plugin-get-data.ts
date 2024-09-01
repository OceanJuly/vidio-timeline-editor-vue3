// import fs from 'fs'
import url from 'url'
import { Plugin } from 'vite'
import vm from 'vm'

const fs = require('fs')

const context = {
	url,
	handler: () => {
		console.warn('servers 模块导入异常')
	}
}

const createViteProxyServer = (): Plugin => {
	return {
		name: 'vite:proxy-server',
		configResolved(resolvedConfig) {},
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
				res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
				next()
			})

			const files = ['viteUtil/viteProxyServer/servers/example.js'] // 指定文件路径
			console.log('****注册接口****')
			files.forEach((filePath: string) => {
				let urlPath = (filePath.match(/(?<=servers).*(?=\.js)/) || [])[0]
				urlPath = urlPath!.replace(/[\\/]+/g, '/')
				vm.createContext(context)
				vm.runInContext(fs.readFileSync(filePath, 'utf-8'), context)
				console.log('****注册接口: ' + urlPath)
				server.middlewares.use(urlPath, context.handler)
			})
		}
	}
}

export default createViteProxyServer
