import type { CanvasConfig, UserConfig } from '@/types'

// 标尺中每小格代表的宽度(根据 scale 的不同实时变化)
const getGridSize = (scale: number) => {
	const scaleNum = new Map([
		// 切换比例：最小单位为帧
		[100, 100],
		[90, 50],
		[80, 20],
		[70, 10],
		// 切换比例：最小单位为秒
		[60, 80],
		[50, 40],
		[40, 20],
		[30, 10],
		// 切换比例：最小单位为6秒 一大格为 1分钟
		[20, 40],
		[10, 25],
		[0, 10]
	])
	return scaleNum.get(scale) || 10
}

// 获取当前 scale 下的单元格像素
export const getGridPixel = (scale: number, frameCount: number) => {
	let gridPixel = getGridSize(scale)
	let trackWidth = gridPixel * frameCount
	if (scale < 70) {
		// 1s 一格
		trackWidth = trackWidth / 30
	}
	if (scale > 30) {
		// 6s 一格
		trackWidth = trackWidth / 6
	}
	return trackWidth
}

/**
 * 时间轴画线
 * */
// 根据缩放比调整 step
const getStep = (scale: number, frameStep: number): number => {
	return scale > 60 ? frameStep : 10
}
export const drawTimeLine = (
	context: CanvasRenderingContext2D,
	userConfigs: UserConfig,
	canvasConfigs: CanvasConfig
) => {
	const { start, scale, step: frameStep, focusPosition } = userConfigs
	const {
		ratio,
		bgColor,
		width,
		height,
		textColor,
		subTextColor,
		textSize,
		textScale,
		focusColor,
		longColor,
		shortColor
	} = canvasConfigs
	const step = getStep(scale, frameStep)

	// 初始化画布
	context.scale(ratio, ratio)
	context.clearRect(0, 0, width, height)

	// 1. 时间轴底色
	context.fillStyle = bgColor
	context.fillRect(0, 0, width, height)

	// 2. 计算网络
	const gridSizeS = getGridSize(scale) // 匹配当前缩放下每小格的宽度
	const gridSizeB = gridSizeS * step // 根据步进计算没大格的宽度

	const startValueS = Math.floor(start / gridSizeS) * gridSizeB // 小格绘制起点的刻度(start 向下取 gridSizeS 的整数倍)
	const startValueB = Math.floor(start / gridSizeB) * gridSizeB // 大格绘制起点的刻度(start 向下取 gridSizeB 的整数倍)

	const offsetXS = startValueS - start // 小格起点刻度距离原点 start 的 pixel 距离
	const offsetXB = startValueB - start // 大格起点刻度距离原点 start 的 pixel 距离
	const endValue = start + Math.ceil(width) // 终点刻度（略超出标尺宽度即可）

	// todo：3. 时间轴聚焦元素
}
