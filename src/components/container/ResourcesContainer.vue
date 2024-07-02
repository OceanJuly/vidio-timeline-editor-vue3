<template>
  <div class="flex h-full overflow-hidden relative">
    <MenuList :activeIndex="defaultActiveIndex" @activeChange="activeHandler" />
<!--    <ItemList-->
<!--        :activeKey="state.activeItem.key"-->
<!--        :defaultCollapse="store.hideSubMenu"-->
<!--        :title="state.activeItem.title"-->
<!--        @collapseChange="changeCollapse"-->
<!--    />-->
<!--    <div class="absolute top-1/2 left-8" v-show="store.hideSubMenu">-->
<!--      <ElIcon :size="16" class="cursor-pointer p-2 box-content" @click="switchCollapse">-->
<!--        <Expand />-->
<!--      </ElIcon>-->
<!--    </div>-->
  </div>
</template>

<script setup lang="ts">
  import { menuData } from "@/data/baseMenu.ts"
  import { ref } from 'vue'
  import { usePageState } from '@/stores/pageState'

  const defaultActiveIndex = ref(0)
  const activeHandler = () => {

  }
</script>