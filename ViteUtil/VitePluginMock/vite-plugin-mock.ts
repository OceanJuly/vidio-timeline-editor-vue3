import fs from 'fs'
import vm from 'node:vm'
import url from 'url'

const context = {
	// 代码运行上下文
	url,
	handler: () => {
		console.warn('servers 模块导入异常')
	}
}
vm.createContext(context)

function VitePluginMock() {
	return {
		name: 'VitePluginMock',
		configureServer(server: any) {
			// 添加响应头 COOP、COEP 支持wasm数据隔离
			server.middlewares.use((req: any, res: any, next: any) => {
				res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
				res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
				next()
			})
			console.log('****开始注册接口****')
			const filePath = 'ViteUtil/VitePluginMock/getData.js'
			const urlPath = '/mock/getData'
			vm.runInContext(fs.readFileSync(filePath, 'utf-8'), context)
			console.log('****注册接口: ' + urlPath)
			server.middlewares.use(urlPath, context.handler)
		}
	}
}

export default VitePluginMock
