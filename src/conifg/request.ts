import { confirmMethod } from '@dc-basic-component/request'
import type { RequestConfig } from '@dc-basic-component/config'

export const requestConfig: RequestConfig = {
  // 设置为合并
  mergeType: 'merge',
  // 异常处理的设置
  exceptionHandleMap: () => ({
    // 00002 为需要二次确认的异常
    '00002': confirmMethod,
  }),
}
