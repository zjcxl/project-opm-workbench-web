import type { BaseVo } from '~/base/base-vo'

export interface SystemUserInfoVo extends BaseVo {
  // 用户id
  userId: string
  // 名称
  name: string
  // 手机号
  phone: string
  // 邮箱
  email: string
  // 性别 1=男 2=女 0=保密
  gender: 0 | 1 | 2
  // 头像
  avatar: string
  // 介绍
  introduction: string
}
