// audio / video 类型
export type TrackType =
	| 'video'
	| 'audio'
	| 'text'
	| 'image'
	| 'effect'
	| 'transition'
	| 'filter'

export interface BaseTractItem {
	id: string
	type: TrackType
	name: string
	start: number
	end: number
	frameCount: number
	offsetL: number // 音视频左侧裁切
	offsetR: number // 音视频右侧裁切
}

export interface VideoTractItem extends BaseTractItem {
	time: number
	format: string
	source: string
	cover: string
	width: number
	height: number
	fps: number
}

export interface AudioTractItem extends BaseTractItem {
	time: number
	format: string
	source: string
	cover: string
}

export interface TextTractItem extends BaseTractItem {
	cover: string
	templateId: number
}

export interface ImageTractItem extends BaseTractItem {
	source: string
	format: string
	width: number
	height: number
	sourceFrame: number
	cover: string
}

export interface EffectTractItem extends BaseTractItem {
	templateId: number
	cover: string
}

export interface TransitionTractItem extends BaseTractItem {
	templateId: number
	cover: string
}

export interface FilterTractItem extends BaseTractItem {
	templateId: number
	cover: string
}

export type TrackItem =
	| VideoTractItem
	| AudioTractItem
	| TextTractItem
	| ImageTractItem
	| EffectTractItem
	| TransitionTractItem
	| FilterTractItem

export interface TrackLineItem {
	type: TrackItem['type']
	main?: boolean
	list: TrackItem[]
}

export interface TrackControlItem {
	title: string
	disable: boolean
	icon: string
}
