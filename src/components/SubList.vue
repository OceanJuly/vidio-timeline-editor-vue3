<template>
	<div class="w-full flex flex-col pt-2 pl-2 pr-1 mt-2">
		<span class="mr-2 pl-2 mb-2 h-6 text-sm border-b dark:border-gray-600 border-gray-300 select-none">
			{{ listData.title }}
		</span>
		<ul class="flex flex-row flex-wrap">
			<li
				class="flex flex-col mb-2 p-1.5"
				:class="{ 'w-full': isAudio }"
				v-for="(item, idnex) of listData.items"
				:key="`${item.name}${item.cover}${idnex}`"
			>
				<template v-if="isAudio">
					<!--					<AudioResourceItem :data="item" :type="type" />-->
					AudioResourceItem
				</template>
				<template v-else>
					OtherResource
					<!--					<OtherResource :data="item" :type="type" />-->
				</template>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	// import AudioResourceItem from '@/views/Edit/components/AudioResourceItem'
	// import OtherResource from ''@/views/Edit/components/OtherResource''
	const props = defineProps({
		listData: {
			type: Object,
			default() {
				return {
					title: '',
					items: []
				}
			}
		},
		type: {
			type: String,
			default: ''
		}
	})
	const listData = ref(props.listData)
	const isAudio = computed(() => props.type === 'audio')
</script>
