<template>
	<div
		class="relative w-full flex flex-row pr-1 border border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-600"
		draggable="true"
		@dragstart="dragStart"
	>
		<img :src="data.cover" alt="audioImg" />
		<div class="flex-1 flex flex-col">
			<p class="max-h-10 overflow-clip text-sm flex-1 pl-3 mt-2">{{
				data.name
			}}</p>
			<span class="text-sm h-5 pl-3 mt-1">
				{{ formatTime(data.time).str }}
			</span>
		</div>
		<div
			class="absolute w-full h-full opacity-0 hover:opacity-100 transition-opacity duration-200"
		>
			<div
				class="cursor-pointer rounded w-20 h-20 bg-gray-900 opacity-70 flex justify-center items-center"
			>
				<ElIcon size="36" color="#fff">
					<VideoPlay />
				</ElIcon>
			</div>
			<div
				class="absolute bottom-2 right-2 bg-blue-500 rounded-full w-6 h-6"
				@click="addTrack"
			>
				<ElIcon :size="16" color="#fff" class="cursor-pointer p-1 box-content">
					<Plus />
				</ElIcon>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { Plus, VideoPlay } from '@element-plus/icons-vue'

	import { usePlayerState } from '@/store/playerState.ts'
	import { useTrackState } from '@/store/trackState.ts'
	import type { AudioTractItem } from '@/types'
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
