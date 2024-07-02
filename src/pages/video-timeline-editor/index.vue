<script setup lang="ts">

import HeaderContainer from "@/components/container/HeaderContainer.vue";
import ResourcesContainer from "@/components/container/ResourcesContainer.vue";
</script>

<template>
  <header-container></header-container>
  <div class="flex flex-1 overflow-hidden">
    <ResourcesContainer />
    <div class="flex flex-1 bg-amber-300 h-full w-full"></div>
  </div>
</template>

<style scoped>
</style>
