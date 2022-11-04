import { confirmMethod } from '@dc-basic-component/request'
import type { RequestConfig } from '@dc-basic-component/config'
import { useMessage } from '@dc-basic-component/util'
import { clearToken, getToken } from '~/util/once/token-util'
import { getRouter } from '~/util/once/router-util'

export const requestConfig: RequestConfig = {
  header: () => ({
    'opm-token': () => getToken(),
  }),
  // 异常处理的设置
  exceptionHandleMap: () => ({
    // 00002 为需要二次确认的异常
    '00002': confirmMethod,
    // 未登录处理
    'U0009': () => {
      return new Promise(() => {
        useMessage().error('登录已过期，请重新登录')
        // 清除原有的token信息
        clearToken()
        // 跳转到登录页面
        const router = getRouter()
        return router.push('/login')
      })
    },
  }),
}
