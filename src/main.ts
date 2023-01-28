import { createSSRApp } from 'vue'
import { defineProjectConfig } from '@dc-basic-component/config'
import { axiosRequestMethod } from '@dc-basic-component/request-axios'
import { createPinia } from 'pinia'
import App from './App.vue'

import './styles/reset.css'
import './styles/main.css'
import 'uno.css'
import { loadingBarConfig, messageConfig } from '~/conifg/message'
import { requestConfig } from '~/conifg/request'
import { router } from '~/router'

const app = createSSRApp(App)

const pinia = createPinia()

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

app.use(router)
app.use(pinia)
app.mount('#app')
