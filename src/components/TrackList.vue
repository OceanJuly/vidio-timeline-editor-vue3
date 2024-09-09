<template>
	<div
		class="trackList flex flex-1 flex-row w-full overflow-x-hidden overflow-y-auto relative"
	>
		<TrackListIcon :listData="showTrackList" :offsetTop="startY" />
		<div
			class="flex-1 overflow-x-scroll overflow-y-auto flex-col shrink-0 grow relative"
			ref="trackList"
			@scroll="handleScroll"
			@wheel="handleWheel"
			@click="setSelectTract($event, -1, -1)"
		>
			<TimeLine
				:start="startX"
				:scale="trackScale"
				:step="defaultFps"
				:focus-position="{
					start: trackStateStore.selectResource?.start,
					end: trackStateStore.selectResource?.end
				}"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref } from 'vue'

	import { TimeLine, TrackListIcon } from '@/components/item/trackItem'
	import { useTrackState } from '@/store/trackState.ts'
	import type { VideoTractItem } from '@/types'
	import { getGridPixel } from '@/utils/canvas.ts'
	import { formatTime, isVideo } from '@/utils/common.ts'

	const trackStateStore = useTrackState()
	const trackScale = computed(() => trackStateStore.trackScale)
	const offsetLine = {
		left: 10, // 容器 margin, 为了显示拖拽手柄
		right: 200
	}

	/* trackListIcon */
	let mainIndex = ref(0) // main 行下标
	const startY = ref(0) // 左侧icons对齐
	const showTrackList = computed(() => {
		return trackStateStore.trackList.map((line, lineIndex) => {
			line.main && (mainIndex.value = lineIndex)
			const newList = line.list.map((item) => {
				const { time } = item as VideoTractItem
				return {
					...item,
					showWidth: `${getGridPixel(trackScale.value, item.end - item.start)}px`,
					showLeft: `${getGridPixel(trackScale.value, item.start)}px`,
					time: isVideo(line.type) ? `${formatTime(time || 0).str}` : ''
				}
			})
			return {
				...line,
				list: newList
			}
		})
	})
	console.log(showTrackList.value)

	/* trackList module */
	const handleScroll = () => {}
	const handleWheel = () => {}
	const setSelectTract = (event: Event, line: number, index: number) => {
		console.log(event)
		console.log(line)
		console.log(index)
	}

	/* timeLine module */
	const startX = ref(0 - offsetLine.left) // 与容器padding对齐
	const defaultFps = ref(30) // 帧率
</script>
