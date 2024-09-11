import { ElLoading } from 'element-plus'
import 'element-plus/es/components/loading/style/css'
import 'normalize.css'
import { createPinia } from 'pinia'
import { ref } from 'vue'
import { createApp } from 'vue'

import installFFmpeg from '@/plugins/installFFmpeg.ts'
import installIcon from '@/plugins/installIcon.ts'
// icon 注册
import installPiniaPlugin from '@/plugins/installPiniaPlugin.ts'

import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.config.globalProperties.$showLoading = ref(false)
app.config.globalProperties.$ElLoading = ElLoading.service({
	text: '核心加载中...'
})

const pinia = createPinia()
pinia.use(installPiniaPlugin)

app.use(pinia)
app.use(router)
app.use(installIcon)
app.use(installFFmpeg)

app.mount('#app')
