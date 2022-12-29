import { createSSRApp } from 'vue'
import { defineProjectConfig } from '@dc-basic-component/config'
import { axiosRequestMethod } from '@dc-basic-component/request-axios'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'

import './styles/reset.css'
import './styles/main.css'
import 'uno.css'
import { loadingBarConfig, messageConfig } from '~/conifg/message'
import { requestConfig } from '~/conifg/request'
import { setRouter } from '~/util/once/router-util'

const app = createSSRApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 设置请求信息
defineProjectConfig({
  baseUrl: '/api',
  // 请求工具
  requestMethod: axiosRequestMethod,
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
