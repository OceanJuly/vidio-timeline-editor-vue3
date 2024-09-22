<template>
  <template
    v-for="(attrItem, attrIndex) in attrData"
    :key="`${trackId}-${attrIndex}`"
  >
    <component
      :is="(attrItem as any).component"
      :index="attrIndex"
      :componentData="attrItem"
      v-bind="$attrs"
    />
  </template>
</template>

<script setup lang="ts">
  /**
   * 遍历递归FormItem
   * */
  defineProps({
    attrData: {
      type: Array,
      default() {
        return []
      }
    },
    trackId: {
      type: String,
      default: ''
    }
  })
</script>

<script lang="ts">
  export default {
    inheritAttrs: false
  }
</script>
