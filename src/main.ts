import { createApp } from 'vue'
import { defineProjectConfig } from '@dc-basic-component/config'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'

// import '@unocss/reset/tailwind.css'
import './styles/reset.css'
import './styles/main.css'
import 'uno.css'

// 设置请求信息
defineProjectConfig({
  baseUrl: '/api',
})

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)
app.mount('#app')
