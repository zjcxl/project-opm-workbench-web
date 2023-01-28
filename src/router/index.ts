import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import pages from 'virtual:generated-pages'
import { setRouter } from '~/util/once/router-util'

// 设置主路由信息
const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('~/components/layout/Home.vue'),
    children: pages,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('~/components/login/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 设置路由
setRouter(router)

export { router }
