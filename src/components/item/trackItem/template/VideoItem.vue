<template>
	<div class="flex flex-col rounded overflow-hidden h-full">
		<div
			class="flex items-center text-xs pl-2 overflow-hidden h-5 leading-5 bg-gray-500 bg-opacity-40 text-gray-200"
		>
			<VideoIcon class="inline-block mr-2 shrink-0" />
			<span class="mr-4 shrink-0">{{
				`${trackItem.name}.${trackItem.format}`
			}}</span>
			<span class="mr-4 shrink-0">{{ trackItem.time }}</span>
		</div>
		<div
			ref="container"
			class="overflow-hidden bg-gray-400 bg-opacity-70 flex-1 relative"
		>
			<VideoFrame type="video" :trackItem="trackItem" :drawState="!loading" />
		</div>
		<div class="leading-3 pl-2 overflow-hidden h-3 bg-gray-700 relative">
			<img
				:src="waveFileUrl"
				v-show="waveFileUrl"
				class="absolute left-0 right-0 top-0 bottom-0 h-full min-w-full"
				:style="waveStyle"
				alt=""
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { PropType } from 'vue'
	import { computed, inject, ref, watch } from 'vue'

	import { VideoFrame } from '@/components'
	import VideoIcon from '@/components/icons/VideoIcon.vue'
	import { usePlayerState } from '@/store/playerState.ts'
	import type { VideoTractItem } from '@/types'
	import FFManager from '@/utils/ffmpegManager.ts'

	const props = defineProps({
		trackItem: {
			type: Object as PropType<VideoTractItem>,
			default() {
				return {
					showWidth: '0px',
					showLeft: '0px'
				}
			}
		}
	})

	const ffmpeg = inject('ffmpeg') as FFManager
	console.log(ffmpeg)
	const playerStore = usePlayerState()

	/* wave */
	const waveFileUrl = ref('')
	const loading = ref(false)
	const waveStyle = computed(() => {
		const { start, end, offsetL, offsetR, frameCount } = props.trackItem
		const showFrameCount = end - start

		return {
			transform: `scaleX(${(frameCount / showFrameCount).toFixed(2)})`,
			transformOrigin: 'left top',
			left: `-${(offsetL / showFrameCount) * 100}%`,
			right: `-${(offsetR / showFrameCount) * 100}%`
		}
	})

	const initVideo = async () => {
		const { name, source, format, frameCount, width, height } = props.trackItem
		if (name && source && ffmpeg.isLoaded.value) {
			const videoName = `${name}.${format}`
			// 写文件
			await ffmpeg.writeFile(ffmpeg.pathConfig.resourcePath, videoName, source)
			// 分离音频
			await ffmpeg.splitAudio(name, format)
			// 视频抽帧
			await ffmpeg.genFrame(name, format, {
				w: width,
				h: height
			})
			await ffmpeg.genWave(name, frameCount)
			waveFileUrl.value = ffmpeg.getWavePng(name)
			loading.value = false
			playerStore.ingLoadingCount--
		}
	}

	watch(
		() => {
			return props.trackItem.source && ffmpeg.isLoaded.value
		},
		initVideo,
		{
			immediate: true,
			flush: 'post'
		}
	)
</script>

<style scoped></style>
