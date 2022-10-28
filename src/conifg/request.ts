import { confirmMethod } from '@dc-basic-component/request'
import type { RequestConfig } from '@dc-basic-component/config'
import { getToken } from '~/util/once/token-util'

export const requestConfig: RequestConfig = {
  header: () => ({
    'opm-token': () => getToken(),
  }),
  // 异常处理的设置
  exceptionHandleMap: () => ({
    // 00002 为需要二次确认的异常
    '00002': confirmMethod,
  }),
}
