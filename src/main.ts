import 'element-plus/es/components/loading/style/css'
import 'normalize.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import installIcon from '@/plugins/installIcon'
// icon 注册
import installPiniaPlugin from '@/plugins/installPiniaPlugin.ts'

import App from './App.vue'
import router from './router'
import './style.css'

const pinia = createPinia()
pinia.use(installPiniaPlugin)

createApp(App).use(router).use(pinia).use(installIcon).mount('#app')
