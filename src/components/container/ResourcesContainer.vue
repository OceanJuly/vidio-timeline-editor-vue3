<template>
	<div class="flex h-full overflow-hidden relative">
		<MenuList :activeIndex="defaultActiveIndex" @activeChange="activeHandler" />
		<ItemList
			:activeKey="state.activeItem.key"
			:defaultCollapse="store.hideSubMenu"
			:title="state.activeItem.title"
			@collapseChange="changeCollapse"
		/>
		<div class="absolute top-1/2 left-8" v-show="store.hideSubMenu">
			<ElIcon :size="16" class="cursor-pointer p-2 box-content" @click="switchCollapse">
				<Expand />
			</ElIcon>
		</div>
		<div class="overflow-auto flex-1 pb-10">
			<template v-for="(subData, index) of listData" :key="`${index}-${subData.type}`">
				<SubList :type="subData.type" :listData="subData" />
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { nextTick, reactive, ref, watch } from 'vue'
	import { useRequest } from 'vue-hooks-plus'

	import { getData } from '@/api/mock.ts'
	import { ItemList, MenuList, SubList } from '@/components'
	import { menuData } from '@/data/baseMenu'
	import { usePageState } from '@/store/pageState'

	const props = defineProps({
		activeKey: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
		defaultCollapse: {
			type: Boolean,
			default: false
		}
	})
	watch(
		() => props.activeKey,
		() => {
			refresh()
		}
	)
	const emit = defineEmits({
		collapseChange(newCollapse: boolean) {
			return newCollapse !== null
		}
	})

	const store = usePageState()
	const { data: listData, refresh } = useRequest(() => getData(props.activeKey))
	console.log(listData)

	const collapse = ref(props.defaultCollapse)
	watch(collapse, (newValue) => {
		emit('collapseChange', newValue)
	})
	const defaultActiveIndex = ref(0)
	const activeHandler = () => {}
	const state = reactive({
		activeItem: menuData[defaultActiveIndex.value]
	})

	const changeCollapse = (newCollapse: boolean) => {
		nextTick(() => (store.hideSubMenu = newCollapse))
	}

	const switchCollapse = () => (collapse.value = !collapse.value)
</script>
