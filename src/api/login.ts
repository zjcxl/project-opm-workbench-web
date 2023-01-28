import { DeleteRequestModel, GetRequestModel, PostRequestModel } from '@dc-basic-component/request'
import type { UserInfoVo } from '~/entity/system/user-info-vo'

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
   * 退出登录
   */
  loginOut: () => new DeleteRequestModel('/login/').request(),

  /**
   * 获取当前登录用户的信息
   */
  info: () => new GetRequestModel<UserInfoVo>('/login/').request(),

  /**
   * 验证是否登录
   */
  check: () => {
    const r = new GetRequestModel<boolean>('/login/check')
    return r.request()
  },

  /**
   * 获取rsa公钥
   * @param sign 签名
   */
  rsa: (sign: string) => new GetRequestModel<string>(`/login/key/${sign}`).request(),

  /**
   * 获取自动登录的key
   */
  getAutoLoginKey: () => {
    return new PostRequestModel<string>('/login/auto/key').request()
  },

  /**
   * 自动登录接口
   * @param password 加密后的密码
   * @param key 加密秘钥
   */
  autoLogin: (password: string, key: string) => {
    return new PostRequestModel<string>('/login/auto', { password, key, clientId: 'web' }).request()
  },

}
