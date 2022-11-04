import { createApp } from 'vue'
import { defineProjectConfig, setRouter } from '@dc-basic-component/config'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'

import './styles/reset.css'
import './styles/main.css'
import 'uno.css'
import { loadingBarConfig, messageConfig } from '~/conifg/message'
import { requestConfig } from '~/conifg/request'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 设置请求信息
defineProjectConfig({
  baseUrl: '/api',
  // 请求工具配置
  request: requestConfig,
  // 消息工具配置
  message: messageConfig,
  // 加载条配置
  loading: loadingBarConfig,
})

setRouter(router)

app.use(router)
app.mount('#app')
