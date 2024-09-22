import type { App } from 'vue'

import FFManager from '@/utils/ffmpegManager'

const installFFmpeg = {
  install(app: App) {
    const ffmpegIns = new FFManager({
      Hooks: {
        beforeInit: () => {
          app.config.globalProperties.$ElLoading.visible.value = true
        },
        afterInit: () => {
          app.config.globalProperties.$ElLoading.visible.value = false
        }
      }
    })
    ffmpegIns.init()
    app.provide('ffmpeg', ffmpegIns)
  }
}

export default installFFmpeg
