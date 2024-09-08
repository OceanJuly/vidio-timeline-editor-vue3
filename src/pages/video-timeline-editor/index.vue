<script setup lang="ts">
	import {
		HeaderContainer,
		ResourcesContainer,
		TrackContainer
	} from '@/components'
	import { CanvasPlayer } from '@/components'
</script>

<template>
	<header-container />
	<div class="flex flex-1 overflow-hidden">
		<ResourcesContainer />
		<div class="flex flex-1 flex-col overflow-hidden h-full w-full">
			<div class="flex flex-1 flex-row flex-nowrap">
				<CanvasPlayer />
			</div>
			<TrackContainer />
		</div>
	</div>
</template>

<style scoped></style>
