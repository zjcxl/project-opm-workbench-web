import { confirmMethod } from '@dc-basic-component/request'
import type { RequestConfig } from '@dc-basic-component/config'
import { getRouter } from '@dc-basic-component/config'
import { useMessage } from '@dc-basic-component/util'
import { getToken } from '~/util/once/token-util'

const router = getRouter()

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
        router.push('/login').then()
      })
    },
  }),
}
