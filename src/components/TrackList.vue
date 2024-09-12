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
				@select-frame="handlerSelectFrame"
			/>
			<div
				class="absolute top-5 flex shrink-0 grow min-w-full"
				:style="{ 'min-height': 'calc(100% - 20px)' }"
				ref="trackListContainer"
				@dragover="trackListOverHandler($event)"
				@drop="addTrack"
			>
				<template v-if="showTrackList.length === 0">
					<div
						class="flex justify-center items-center h-24 m-auto w-2/3 dark:bg-gray-500 bg-gray-200 rounded-md text-sm border-dashed border-2 dark:border-gray-500 border-gray-200 hover:dark:border-blue-300 hover:border-blue-400"
					>
						<VideoIcon class="text-xl mr-4" />
						将素材拖拽到这里，开始编辑你的大作吧~
					</div>
				</template>
				<div
					v-else
					class="z-10 pt-5 pb-5 min-w-full flex shrink-0 grow flex-col justify-center min-h-full"
					:style="{ width: `${trackStyle.width}px` }"
				>
					<template
						v-for="(lineData, lineIndex) of showTrackList"
						:key="lineIndex"
					>
						<TrackLine
							:style="{
								'margin-left': `${offsetLine.left}px`
							}"
							:class="[
								dropLineIndex === lineIndex
									? insertBefore
										? 'showLine-t'
										: 'showLine-b'
									: ''
							]"
							:lineType="lineData.type"
							:isActive="trackStateStore.selectTrackItem.line === lineIndex"
							:lineIndex="lineIndex"
							:isMain="lineData.main"
							:lineData="lineData.list"
							@dragover="dragLineHandler($event, 'over', lineIndex)"
						/>
					</template>
				</div>
				<TrackPlayPoint v-show="showTrackList.length !== 0" />
				<div
					v-show="showTrackList.length !== 0 && dropItemLeft !== 0"
					class="z-30 w-px absolute -top-5 bottom-0 bg-yellow-300 dark:bg-yellow-300"
					:style="{ left: `${dropItemLeft}px` }"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { debounce } from 'lodash-es'
	import { computed, ref } from 'vue'

	import { TrackLine } from '@/components'
	import VideoIcon from '@/components/icons/VideoIcon.vue'
	import { TrackPlayPoint } from '@/components/item'
	import { TimeLine, TrackListIcon } from '@/components/item/trackItem'
	import { usePlayerState } from '@/store/playerState.ts'
	import { useTrackState } from '@/store/trackState.ts'
	import type { VideoTractItem } from '@/types'
	import { getGridPixel, getSelectFrame } from '@/utils/canvas.ts'
	import { formatTime, getJsonParse, isVideo } from '@/utils/common.ts'
	import { formatTrackItemData } from '@/utils/track.ts'

	const trackStateStore = useTrackState()
	const playerStore = usePlayerState()

	const trackScale = computed(() => trackStateStore.trackScale)
	const dragPoint = computed(() => trackStateStore.dragData.dragPoint)
	const isVaDragElement = computed(() => {
		return ['video', 'audio'].includes(trackStateStore.dragData.dragType)
	}) // 是否是音视频节点
	const trackStyle = computed(() => {
		return {
			width:
				getGridPixel(trackScale.value, playerStore.frameCount) +
				offsetLine.right
		}
	})

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

	/* trackList module */
	const trackList = ref()
	let maxDelta = 0
	const handleScroll = () => {
		const { scrollLeft, scrollTop } = trackList.value
		startX.value = scrollLeft - offsetLine.left
		startY.value = scrollTop
	}
	const setScale = debounce(() => {
		trackStateStore.trackScale -= maxDelta > 0 ? 10 : -10
		maxDelta = 0
	}, 100)
	const handleWheel = (event: WheelEvent) => {
		if (event.ctrlKey || event.metaKey) {
			event.preventDefault()
			maxDelta || (maxDelta = event.deltaY)
			setScale()
		}
	}
	const setSelectTract = (event: Event, line: number, index: number) => {
		event.preventDefault()
		event.stopPropagation()
		trackStateStore.selectTrackItem.line = line
		trackStateStore.selectTrackItem.index = index
	}

	/* timeLine module */
	const startX = ref(0 - offsetLine.left) // 与容器 padding 对齐
	const defaultFps = ref(30) // 帧率
	const handlerSelectFrame = (frame: number) => {
		const playFrame = frame - 1
		const startFrane =
			playFrame < 0
				? 0
				: playFrame > playerStore.frameCount
					? playerStore.frameCount
					: playFrame
		playerStore.playStartFrame = startFrane
		playerStore.playAudioFrame = startFrane
	}

	/* track item detail */
	const trackListContainer = ref()
	const dropItemLeft = ref(0) // 目标 left 值
	const dropLineIndex = ref(-1) // 目标行
	const insertBefore = ref(true) // 之前插入还是之后插入
	const setDropLineLeft = (event: DragEvent) => {
		const trackListEle = trackListContainer.value as HTMLElement
		const { left } = trackListEle.getBoundingClientRect()
		const { clientX } = event
		const { x: offsetX } = dragPoint.value
		const itemLeft = clientX - left - offsetX
		dropItemLeft.value = itemLeft < 0 ? 0 : itemLeft
	}
	const trackListOverHandler = (event: DragEvent) => {
		event.preventDefault()
		event.stopPropagation()
		setDropLineLeft(event)
	}
	const addTrack = () => {
		let dragInfo = getJsonParse(trackStateStore.dragData.dataInfo)
		if (dragInfo) {
			const startFrame = getSelectFrame(
				dropItemLeft.value,
				trackScale.value,
				defaultFps.value
			)
			trackStateStore.addTrack(
				formatTrackItemData(dragInfo, startFrame > 0 ? startFrame - 1 : 0),
				dropLineIndex.value,
				insertBefore.value
			)
		}
		dropLineIndex.value = -1
		dropItemLeft.value = 0
	}
	const dragLineHandler = (
		event: DragEvent,
		type: string,
		lineIndex: number
	) => {
		let dropLineI = -1
		if (type === 'over') {
			if (isVaDragElement.value) {
				dropLineI = lineIndex > mainIndex.value ? lineIndex : mainIndex.value
			} else {
				dropLineI = lineIndex < mainIndex.value ? lineIndex : mainIndex.value
			}
			if (dropLineI === mainIndex.value) {
				insertBefore.value = !isVaDragElement.value
			} else {
				const dropLine = event.currentTarget as HTMLDivElement
				const { clientHeight } = dropLine
				const { top } = dropLine.getBoundingClientRect()
				const { clientY } = event
				insertBefore.value = clientY - top < clientHeight / 2
			}
			dropLineIndex.value = dropLineI
			setDropLineLeft(event)
		}
	}
</script>
