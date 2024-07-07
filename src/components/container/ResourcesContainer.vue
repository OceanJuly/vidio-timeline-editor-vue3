<template>
	<div class="flex h-full overflow-hidden relative">
		<MenuList :activeIndex="defaultActiveIndex" @activeChange="activeHandler" />
		<ItemList
			:activeKey="state.activeItem.key"
			:defaultCollapse="store.hideSubMenu"
			:title="state.activeItem.title"
			@collapseChange="changeCollapse"
		/>
		<!--    <div class="absolute top-1/2 left-8" v-show="store.hideSubMenu">-->
		<!--      <ElIcon :size="16" class="cursor-pointer p-2 box-content" @click="switchCollapse">-->
		<!--        <Expand />-->
		<!--      </ElIcon>-->
		<!--    </div>-->
	</div>
</template>

<script setup lang="ts">
	import { ref, reactive, nextTick } from 'vue'
	import { menuData } from '@/data/baseMenu'
	import { usePageState } from '@/store/pageState'
	import MenuList from '@/components/MenuList'
	import ItemList from '@/components/ItemList'

	const store = usePageState()

	const defaultActiveIndex = ref(0)
	const activeHandler = () => {}
	const state = reactive({
		activeItem: menuData[defaultActiveIndex.value]
	})

	const changeCollapse = (newCollapse: boolean) => {
		nextTick(() => (store.hideSubMenu = newCollapse))
	}
</script>
