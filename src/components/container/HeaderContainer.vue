<template>
  <header class="grid grid-cols-3 items-center px-[24px] h-[48px] border-b border-gray-200">
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
    </div>
  </header>
</template>

<script setup lang="ts">
import { Download } from '@element-plus/icons-vue';
</script>