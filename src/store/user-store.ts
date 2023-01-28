import { defineStore } from 'pinia'
import type { SystemUserInfoVo } from '~/entity/system/system-user-info-vo'
import type { UserInfoVo } from '~/entity/system/user-info-vo'

export const useUserStore = defineStore('user-store', () => {
  // 用户的基础信息
  const info = ref<SystemUserInfoVo>()

  // 设置用户信息
  function setUser(data: UserInfoVo) {
    info.value = data.info
  }

  // 清除用户信息
  function clearUser() {
    info.value = undefined
  }

  // 头像
  const avatar = (): string => info.value?.avatar || ''
  // 名称
  const userName = (): string => info.value?.name || ''

  return { setUser, clearUser, avatar, userName }
})
