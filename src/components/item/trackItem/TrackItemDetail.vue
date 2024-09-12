<template>
	<div
		class="text-left text-sm top-0 absolute"
		:class="[
			TrackHeightMap.get(props.trackItem.type),
			isDragState ? 'opacity-30' : ''
		]"
		:style="itemClass"
		@click="setSelectTract"
	>
		<!-- 操作手柄 -->
		<TrackHandler
			:is-active="isActive"
			:line-index="lineIndex"
			:item-index="itemIndex"
		/>
		<!-- 容器 -->
		<component :is="componentMap.get(trackItem.type)" :trackItem="trackItem" />
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'

	import { TrackHandler } from '@/components'
	import {
		AudioItem,
		EffectItem,
		FilterItem,
		ImageItem,
		TextItem,
		TransitionItem,
		VideoItem
	} from '@/components/item/trackItem/template'
	import { TrackHeightMap } from '@/data/trackConfig'
	import { useTrackState } from '@/store/trackState.ts'

	const props = defineProps({
		trackType: {
			type: String,
			default: ''
		},
		lineIndex: {
			type: Number,
			default: 0
		},
		itemIndex: {
			type: Number,
			default: 0
		},
		trackItem: {
			type: Object,
			default() {
				return {
					width: '0px',
					left: '0px'
				}
			}
		}
	})

	const trackStateStore = useTrackState()

	const isDragState = computed(() => {
		return (
			trackStateStore.moveTrackData.lineIndex === props.lineIndex &&
			trackStateStore.moveTrackData.itemIndex === props.itemIndex
		)
	})
	const itemClass = computed(() => {
		return {
			width: props.trackItem.showWidth,
			left: props.trackItem.showLeft
		}
	})

	/* track item wrap */
	const setSelectTract = (event: Event) => {
		event.preventDefault()
		event.stopPropagation()
		trackStateStore.selectTrackItem.line = props.lineIndex
		trackStateStore.selectTrackItem.index = props.itemIndex
	}

	/* track handler */
	const isActive = computed(() => {
		return (
			trackStateStore.selectTrackItem.line === props.lineIndex &&
			trackStateStore.selectTrackItem.index === props.itemIndex
		)
	})

	/* track capacity */
	const componentMap = new Map([
		['video', VideoItem],
		['audio', AudioItem],
		['text', TextItem],
		['image', ImageItem],
		['effect', EffectItem],
		['transition', TransitionItem],
		['filter', FilterItem]
	])
</script>

<style scoped></style>
