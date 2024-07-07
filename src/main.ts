import { createApp } from 'vue'
import './style.css'
import 'normalize.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'element-plus/es/components/loading/style/css'
import installIcon from '@/plugins/installIcon' // icon 注册

const pinia = createPinia()

createApp(App).use(router).use(pinia).use(installIcon).mount('#app')
