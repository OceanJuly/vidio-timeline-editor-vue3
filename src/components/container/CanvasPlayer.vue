<template>
	<div
		class="flex-1 overflow-hidden relative"
		ref="playerContent"
		@click="cancelSelect"
	>
		<span
			class="pl-2 inline-block w-full h-10 mb-2 leading-10 border-b dark:border-gray-600 border-gray-300"
			>播放器</span
		>
		<Player :containerSize="containerSize" />
	</div>
</template>

<script setup lang="ts">
	import { onMounted, reactive, ref, watch } from 'vue'

	import { usePageState } from '@/store/pageState.ts'
	import { usePlayerState } from '@/store/playerState.ts'
	import { useTrackState } from '@/store/trackState.ts'

	import Player from '../item/player/Player.vue'

	const trackStore = useTrackState()
	const pageStore = usePageState()
	const playStore = usePlayerState()

	const playerContent = ref()

	const containerSize = reactive({
		width: 0,
		height: 0
	})

	const cancelSelect = (e: MouseEvent) => {
		e.stopPropagation()
		trackStore.selectTrackItem.line = -1
		trackStore.selectTrackItem.index = -1
	}

	const updateContainerSize = () => {
		const { width, height } = playerContent.value.getBoundingClientRect()
		containerSize.width = width
		containerSize.height = height
	}

	window.addEventListener('resize', updateContainerSize, false)

	watch(
		() => pageStore.trackHeight,
		() => {
			updateContainerSize()
		},
		{
			flush: 'post'
		}
	)
	watch(
		[() => playStore.playerHeight, () => playStore.playerWidth],
		() => {
			updateContainerSize()
		},
		{
			flush: 'post'
		}
	)

	onMounted(() => {
		updateContainerSize()
		window.addEventListener('resize', updateContainerSize, false)
	})
</script>
