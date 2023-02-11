import { confirmMethod } from '@dc-basic-component/request'
import type { BaseRequestModel, RequestConfig, ResultModel } from '@dc-basic-component/config'
import { NANOID, useMessage } from '@dc-basic-component/util'
import { clearToken, getAutoToken, getToken, setToken } from '~/util/once/token-util'
import { getRouter } from '~/util/once/router-util'
import loginRequest from '~/api/login'
import { handleRsa } from '~/util/once/rsa-util'

export const requestConfig: RequestConfig = {
  header: () => ({
    'submit-key': ({ data }) => {
      // 如果请求参数中有需要submit-key的参数，设置缓存
      if (data['submit-key'])
        return NANOID(16)
      return ''
    },
    'opm-token': () => getToken(),
  }),
  // 异常处理的设置
  exceptionHandleMap: () => ({
    // 00002 需要二次确认的异常
    '00002': confirmMethod,
    // 未登录处理（执行自动登录）
    'U0009': async (res: ResultModel, model: BaseRequestModel<any, ResultModel>) => {
      // 判断自动登录是否有值
      const autoToken = getAutoToken()
      if (autoToken) {
        // 执行自动登录
        const key = NANOID(16)
        // 加密密码
        const { data: rsaKey } = await loginRequest.rsa(key)
        const newPassword = handleRsa(autoToken, rsaKey)
        return await loginRequest.autoLogin(newPassword, key).then((data) => {
          // 设置登录后的信息
          setToken(data.data)
          // 再次请求信息
          return model.request()
        })
      }
      else {
        return new Promise(() => {
          // 执行重新登录
          // 再次发送请求信息
          useMessage().error('登录已过期，请重新登录')
          // 清除原有的token信息
          clearToken()
          // 跳转到登录页面
          const router = getRouter()
          return router.push('/login')
        })
      }
    },
    // 自动登录异常处理
    'U0010': () => {
      return new Promise(() => {
        // 再次发送请求信息
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
