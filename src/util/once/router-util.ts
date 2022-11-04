import type { Router } from 'vue-router'
import { NANOID, getCache, setCache } from '@dc-basic-component/util'

const key = `router_${NANOID()}`

/**
 * 设置router信息
 * @param router 路由信息
 */
export const setRouter = (router: Router) => setCache<Router>(key, router)

/**
 * 获取router信息
 */
export const getRouter = () => getCache<Router>(key)
