<template>
	<div class="p-2 absolute top-12 bottom-10 left-2 right-2 overflow-visible">
		<canvas
			ref="playerCanvas"
			class="absolute left-0 right-0 top-0 bottom-0 m-auto bg-gray-900"
		/>
		<div
			v-show="playStore.frameCount === 0 || !playStore.existVideo"
			class="absolute left-0 right-0 top-0 bottom-0 z-20 flex justify-center items-center"
		>
			<ElIcon
				:size="144"
				class="box-content opacity-50"
				:style="{ color: '#FDE68A' }"
			>
				<VideoCameraFilled />
			</ElIcon>
		</div>
		<Loading
			v-show="showLoading.value"
			class="justify-center pl-0 bg-opacity-0"
		/>
	</div>
	<PlayerControl :disable="showLoading.value" />
</template>

<script setup lang="ts">
	import { VideoCameraFilled } from '@element-plus/icons-vue'
	import { computed, inject, ref } from 'vue'

	import { Loading, PlayerControl } from '@/components'
	import { usePlayerState } from '@/store/playerState.ts'
	import { CanvasPlayer } from '@/utils/canvasDraw'
	import FFManager from '@/utils/ffmpegManager.ts'

	const props = defineProps({
		containerSize: {
			// 容器大小
			type: Object,
			default() {
				return {
					width: 0,
					height: 0
				}
			}
		}
	})

	const playStore = usePlayerState()

	// player canvas
	const playerCanvas = ref()
	const ffmpeg = inject('ffmpeg') as FFManager
	const player = new CanvasPlayer({
		player: playerCanvas,
		ffmpeg,
		containerSize: props.containerSize
	})

	// loading
	const showLoading = computed(() => {
		return player.loading
	})
</script>

<style scoped></style>
