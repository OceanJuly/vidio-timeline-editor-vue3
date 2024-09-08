<template>
	<div
		class="inline-block relative w-[5.5rem]"
		draggable="true"
		@dragstart="dragStart"
	>
		<img
			referrerpolicy="no-referrer"
			class="cursor-pointer w-full h-24 block select-none border-solid dark:hover:border-cyan-800 hover:border-cyan-200 box-border"
			:class="
				type === 'video'
					? 'w-34 border-2 dark:border-gray-800 border-gray-50'
					: 'w-22 border dark:border-gray-700 border-gray-200'
			"
			:src="formatData.cover"
			@mousemove="showGif($event, formatData.source)"
			@mouseout="showGif($event, formatData.cover)"
			alt="otherResourceImg"
		/>
		<label
			class="mt-1 mb-3 text-xs w-full text-center select-none dark:text-gray-400 text-gray-600"
			v-show="showData.showName"
			>{{ formatData.name }}</label
		>
		<span
			class="h-5 absolute bottom-1 right-2 text-xs text-gray-400"
			v-show="showData.showTime"
			>{{ formatTime(formatData.time).str }}</span
		>
		<div
			class="absolute top-16 right-1 bg-blue-500 rounded-full w-6 h-6 opacity-0 hover:opacity-100 transition-opacity duration-150"
			@click="addTrack"
		>
			<ElIcon :size="16" color="#fff" class="cursor-pointer p-1 box-content">
				<Plus />
			</ElIcon>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { Plus } from '@element-plus/icons-vue'
	import { computed } from 'vue'

	import { usePlayerState } from '@/store/playerState.ts'
	import { useTrackState } from '@/store/trackState.ts'
	import type { AudioTractItem, ImageTractItem } from '@/types'
	import { formatTime } from '@/utils/common.ts'
	import { formatTrackItemData } from '@/utils/track.ts'

	const props = defineProps({
		data: {
			type: Object,
			default() {
				return {} as AudioTractItem
			}
		},
		type: {
			type: String,
			default: ''
		}
	})

	const trackState = useTrackState()
	const playerStore = usePlayerState()

	const formatData = computed(() => {
		let { time, frameCount } = props.data
		if (props.type === 'video' && !time) {
			time = parseInt(`${(frameCount / 30) * 1000}`)
		}
		const obj: any = {
			...props.data,
			time
		}
		return obj
	})

	const showData = computed(() => {
		return {
			showName: ['effect', 'transition', 'filter'].includes(props.type),
			showTime: ['video'].includes(props.type)
		}
	})

	const dragStart = (e: DragEvent) => {
		e.stopPropagation()
		const dragInfo = {
			type: props.type,
			...props.data
		}
		playerStore.isPause = true
		trackState.dragData.dataInfo = JSON.stringify(dragInfo)
		trackState.dragData.dragType = props.type
		trackState.dragData.dragPoint.x = e.offsetX
		trackState.dragData.dragPoint.y = e.offsetY
		trackState.selectTrackItem.line = -1
		trackState.selectTrackItem.index = -1
	}

	/* img module */
	const showGif = (event: MouseEvent, imageSource: ImageTractItem['type']) => {
		if (['image'].includes(props.type) && event.target) {
			;(event.target as HTMLImageElement).src = imageSource
		}
	}

	const addTrack = (e: MouseEvent) => {
		playerStore.isPause = true
		e.stopPropagation()
		const dragInfo = {
			type: props.type,
			...props.data
		}
		trackState.addTrack(
			formatTrackItemData(dragInfo, playerStore.playStartFrame)
		)
	}
</script>

<style scoped></style>
