<template>
  <header class="flex justify-between mx-[16px] my-[24px]">
    <div>Jerry's Video Timeline Editor</div>
    <div>
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