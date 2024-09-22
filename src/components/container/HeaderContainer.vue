<template>
  <header
    class="grid grid-cols-3 items-center px-[24px] h-[48px] border-b border-gray-200"
  >
    <div class="flex items-center">
      <div class="pr-[16px]">Jerry's Video Timeline Editor</div>
      <div class="text-[12px]">自动保存：2024-06-30 02:38</div>
    </div>
    <div class="flex justify-center">视频剪辑工具</div>
    <div class="flex flex-row-reverse">
      <el-button>
        <ElIcon class="mr-1">
          <Download />
        </ElIcon>
        export
      </el-button>
      <el-switch
        class="mr-10"
        size="large"
        :active-icon="Moon"
        :inactive-icon="Sunny"
        inline-prompt
        v-model="pageStore.isDark"
        :style="switchClass"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
  import { Download, Moon, Sunny } from '@element-plus/icons-vue'
  import { computed } from 'vue'

  import { usePageState } from '@/stores/pageState'

  const pageStore = usePageState()

  const switchClass = computed(() => ({
    '--el-switch-border-color': pageStore.isDark ? '#4B5563' : '#D1D5DB',
    '--el-color-white': pageStore.isDark ? '#F3F4F6' : '#374151'
  }))
</script>
