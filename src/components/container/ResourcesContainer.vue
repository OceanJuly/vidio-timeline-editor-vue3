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
			<ElIcon
				:size="16"
				class="cursor-pointer p-2 box-content"
				@click="switchCollapse"
			>
				<Expand />
			</ElIcon>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { Expand } from '@element-plus/icons-vue'
	import { nextTick, reactive, ref } from 'vue'

	import { ItemList, MenuList } from '@/components'
	import { menuData } from '@/data/baseMenu'
	import { usePageState } from '@/store/pageState'

	const store = usePageState()

	const defaultActiveIndex = ref(0)
	const state = reactive({
		activeItem: menuData[defaultActiveIndex.value]
	})

	/* MenuList */
	function activeHandler(activeItem: any) {
		state.activeItem = reactive(activeItem)
	}

	/* ItemList */
	const changeCollapse = (newCollapse: boolean) => {
		nextTick(() => (store.hideSubMenu = newCollapse))
	}

	/* 搜索展开按钮 */
	function switchCollapse() {
		nextTick(() => {
			store.hideSubMenu = !store.hideSubMenu
		})
	}
</script>
