// 生成 16 进制指定长度字符创
export const getRandom = (len: number) =>
	(Math.floor(1 + Math.random()) * 16 ** len).toString(16).substring(1)

/* 时间格式化 */
export const formatTime = (time: number) => {
	let second = Math.floor(time / 1000)
	const s = second % 60
	second = Math.floor(second / 60)
	const m = second % 60
	second = Math.floor(second / 60)
	const h = second % 60
	return {
		s,
		m,
		h,
		str: `${h === 0 ? '' : `${h < 10 ? '0' : ''}${h}`}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
	}
}

export const formatPlayerTime = (frameCount: number) => {
	let f = frameCount % 30
	frameCount = Math.floor(frameCount / 30)
	let s = frameCount % 60
	frameCount = Math.floor(frameCount / 60)
	let m = frameCount % 60
	frameCount = Math.floor(frameCount / 60)
	let h = frameCount
	return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}:${f < 10 ? '0' : ''}${f}`
}

// 获取随机 ID，组件拖拽到预览试图会设置 ID
export const getId = (prefix = 't') => {
	return `${prefix ? 'prefix' : ''}${getRandom(5)}${getRandom(3)}-${getRandom(4)}`
}

// 下载文件
export const downFile = (href: string, fileName: string) => {
	const a = document.createElement('a')
	a.setAttribute('href', href)
	a.setAttribute('download', fileName) // 下载文件名
	document.body.appendChild(a)
	document.body.click()
	document.body.removeChild(a)
	// 释放 blob 对象
	window.URL.revokeObjectURL(href)
	a.setAttribute('href', '')
}

// 计算 item 组件位置
export const computedItemShowArea = (
	trackItem: Record<string, any>,
	canvasSize: { width: number; height: number },
	trackAttr: Record<string, any>
) => {
	let { left = 0, top = 0, scale = 100, text, fontSize } = trackAttr
	const { width, height, type } = trackItem
	const { width: playerW, height: playerH } = canvasSize
	let defaultW = playerW
	let defaultH = playerH
	switch (type) {
		case 'video': {
			const proportionalW = Math.floor((playerH / height) * width) // 等高宽度
			const proportionalH = Math.floor((playerW / height) * width) // 等宽高度
			// 默认渲染位置
			if (proportionalH > playerW) {
				// 等高场景下宽度溢出，则采用等宽，高度上下留白
				defaultH = proportionalH
			} else if (proportionalH > playerH) {
				// 等宽场景下高度溢出，则采用等高，宽度左右留白
				defaultW = proportionalW
			}
			break
		}
		case 'image': {
			defaultW = width
			defaultH = height
			break
		}
		case 'text': {
			defaultW = text.length * fontSize
			defaultH = fontSize * 1.2
		}
	}
	// 从默认位置计算皮衣缩放位置
	const scaleW = Math.floor((defaultW * scale) / 100)
	const scaleH = Math.floor((defaultH * scale) / 100)
	const scaleL = Math.floor(left + (defaultW - scaleW) / 2)
	const scaleT = Math.floor(top + (defaultH - scaleH) / 2)
	const diffW = Math.floor(playerW - scaleW)
	const diffH = Math.floor(playerH - scaleH)
	return {
		drawL: scaleL,
		drawT: scaleT,
		drawW: scaleW,
		drawH: scaleH,
		sourceWidth: width,
		sourceHeight: height,
		defaultH,
		defaultW,
		diffH,
		diffW
	}
}

// 是否是 video 类型文件
export const isVideo = (type: string) => type === 'video'

// 封装 JSON 格式化，避免 error
export const getJsonParse = (str: string): any => {
	let res = ''
	try {
		res = JSON.parse(str)
	} catch (e) {
		console.error(e)
		res = ''
	}
	return res
}
