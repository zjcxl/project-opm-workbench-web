import { GetRequestModel, PostRequestModel } from '@dc-basic-component/request'

export default {

  /**
   * 登录接口
   * @param account 账号
   * @param password 加密后的密码
   * @param key 加密秘钥
   */
  login: (account: string, password: string, key?: string) => {
    return new PostRequestModel<string>('/login/', { account, password, key, clientId: 'web' }).request()
  },

  /**
   * 验证是否登录
   */
  check: () => {
    return new GetRequestModel<boolean>('/login/check').request()
  },

  /**
   * 获取rsa公钥
   * @param sign 签名
   */
  rsa: (sign: string) => new GetRequestModel<string>(`/login/key/${sign}`).request(),

}
