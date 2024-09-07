<template>
	<div class="flex-1 overflow-hidden relative" ref="playerContent" @click="cancelSelect">
		<span class="pl-2 inline-block w-full h-10 mb-2 leading-10 border-b dark:border-gray-600 border-gray-300"
			>播放器</span
		>
		<Player :containerSize="containerSize" />
	</div>
</template>

<script setup lang="ts">
	import { onMounted, reactive, ref } from 'vue'

	import Player from '@/components/item/player/player.vue'

	const playerContent = ref()

	const containerSize = reactive({
		width: 0,
		height: 0
	})

	const cancelSelect = () => {}

	const updateContainerSize = () => {
		const { width, height } = playerContent.value.getBoundingClientRect()
		containerSize.width = width
		containerSize.height = height
	}

	onMounted(() => {
		updateContainerSize()
		window.addEventListener('resize', updateContainerSize, false)
	})
</script>
