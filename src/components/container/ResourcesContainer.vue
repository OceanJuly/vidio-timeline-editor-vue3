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
  import { usePageState } from '@/stores/pageState'
  import { MenuList, ItemList } from '@/components'
  import { Expand } from '@element-plus/icons-vue'
  import { ref, reactive, nextTick } from 'vue'
  import { menuData } from '@/data/baseMenu'

  const store = usePageState()
  const defaultActiveIndex = ref(0)
  let state = reactive({
    activeItem: menuData[defaultActiveIndex.value]
  })
  const activeHandler = (activeItem: any) => {
    state.activeItem = reactive(activeItem)
  }
  const switchCollapse = () => {
    nextTick(() => {
      store.hideSubMenu = !store.hideSubMenu
    })
  }
  const changeCollapse = (newCollapse: boolean) => {
    nextTick(() => {
      store.hideSubMenu = newCollapse
    })
  }
</script>
