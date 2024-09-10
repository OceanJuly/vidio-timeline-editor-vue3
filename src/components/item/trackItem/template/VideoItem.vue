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
			video frame
		</div>
		<div class="leading-3 pl-2 overflow-hidden h-3 bg-gray-700 relative">
			video sound wave
		</div>
	</div>
</template>

<script setup lang="ts">
	import { PropType } from 'vue'

	import VideoIcon from '@/components/icons/VideoIcon.vue'
	import type { VideoTractItem } from '@/types'

	defineProps({
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
</script>

<style scoped></style>
