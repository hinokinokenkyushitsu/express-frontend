import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { startClock } from './utils/clock'
import './assets/main.css'

// 启动全局倒计时心跳（订单卡片用它做实时倒计时）
startClock()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
