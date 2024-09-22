<template>
  <div class="p-2 absolute top-12 bottom-10 left-2 right-2 overflow-visible">
    <canvas
      ref="playerCanvas"
      class="absolute left-0 right-0 top-0 bottom-0 m-auto bg-gray-900"
    />
    <div
      v-show="store.frameCount === 0 || !store.existVideo"
      class="absolute left-0 right-0 top-0 bottom-0 z-20 flex justify-center items-center"
    >
      <ElIcon
        :size="144"
        class="box-content opacity-50"
        :style="{ color: '#FDE68A' }"
      >
        <VideoCameraFilled />
      </ElIcon>
    </div>
    <Loading
      v-show="showLoading.value"
      class="justify-center pl-0 bg-opacity-0"
    />
    <PlayerMoveable :canvasSize="player.canvasSize" />
  </div>
  <PlayerControl :disable="showLoading.value" />
  <audio ref="audio" src="" />
</template>

<script setup lang="ts">
  import { PlayerMoveable, PlayerControl, Loading } from '@/components'
  import { VideoCameraFilled } from '@element-plus/icons-vue'
  import { usePlayerState } from '@/stores/playerState'
  import type FFManager from '@/utils/ffmpegManager'
  import { CanvasPlayer } from '@/utils/canvasDraw'
  import { audioSetup } from '@/utils/initAudio'
  import { ref, inject, computed } from 'vue'

  const props = defineProps({
    containerSize: {
      // 容器大小
      type: Object,
      default() {
        return {
          width: 0,
          height: 0
        }
      }
    }
  })
  const ffmpeg = inject('ffmpeg') as FFManager
  const store = usePlayerState()
  const playerCanvas = ref()
  const player = new CanvasPlayer({
    player: playerCanvas,
    ffmpeg,
    containerSize: props.containerSize
  })
  // audio在视频抽帧结束后才能获取到视频音轨
  const { audio, audioLoading } = audioSetup(player.loading)
  const showLoading = computed(() => {
    return player.loading && audioLoading
  })
</script>
