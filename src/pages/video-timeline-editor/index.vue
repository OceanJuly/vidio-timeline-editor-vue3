<script setup lang="ts">
	import CanvasPlayer from '@/components/container/CanvasPlayer.vue'
	import HeaderContainer from '@/components/container/HeaderContainer.vue'
	import ResourcesContainer from '@/components/container/ResourcesContainer.vue'
</script>

<template>
	<header-container></header-container>
	<div class="flex flex-1 overflow-hidden">
		<ResourcesContainer />
		<div class="flex flex-1 flex-col overflow-hidden h-full w-full">
			<div class="flex flex-1 flex-row flex-nowrap">
				<CanvasPlayer />
			</div>
		</div>
	</div>
</template>

<style scoped></style>
