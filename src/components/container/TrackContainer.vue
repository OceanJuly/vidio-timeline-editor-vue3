<template>
  <div
    class="overflow-hidden select-none relative pt-2 flex flex-col"
    :style="trackHeight"
  >
    <SplitLine
      class="top-0 left-0 right-0"
      direction="horizontal"
      :limitSize="limitSize"
      v-model:newHeight="page.trackHeight"
    />
    <TrackControl v-model="store.trackScale" />
    <TrackList />
  </div>
</template>

<script setup lang="ts">
  import { TrackControl, SplitLine, TrackList } from '@/components'
  import { useTrackState } from '@/stores/trackState'
  import { usePageState } from '@/stores/pageState'
  import { computed, reactive } from 'vue'

  const page = usePageState()
  const store = useTrackState()
  const trackHeight = computed(() => ({
    height: `${page.trackHeight}px`
  }))
  const limitSize = reactive({
    minHeight: 200,
    maxHeight: document.body.getBoundingClientRect().height - 200
  })
</script>
