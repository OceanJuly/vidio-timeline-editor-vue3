<script setup lang="ts">

import HeaderContainer from "@/pages/video-timeline-editor/components/container/HeaderContainer.vue";
import ResourcesContainer from "@/pages/video-timeline-editor/components/container/ResourcesContainer.vue";
</script>

<template>
  <header-container></header-container>
  <div class="flex flex-1 overflow-hidden">
    <ResourcesContainer />
  </div>
</template>

<style scoped>
</style>
