<template>
  <el-tabs tab-position="left">
    <el-tab-pane v-for="menu in menuData" :key="menu.key">
      <template #label>
        <div>
          <span>{{ menu.title }}</span>
        </div>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { menuData } from "@/pages/video-timeline-editor/data/menuData"

console.log(menuData);
</script>