<template>
  <el-tabs tab-position="left">
    <el-tab-pane :label="menu.title" v-for="menu in menuData" :key="menu.key">
      <template #label>
        <span>
          <el-icon><calendar /></el-icon>
          <span>Route</span>
        </span>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { menuData } from "@/pages/video-timeline-editor/data/menuData"

console.log(menuData);
</script>