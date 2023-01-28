<script setup lang="ts">
import { NAvatar } from 'naive-ui'
import { computed } from 'vue'
import { useUserStore } from '~/store/user-store'
import loginRequest from '~/api/login'
import { clearAutoToken, clearToken } from '~/util/once/token-util'

const userStore = useUserStore()
const userName = computed<string>(() => userStore.userName())

const options = [
  {
    label: '清除缓存',
    key: 'clear_store',
  },
  {
    label: '退出登录',
    key: 'login_out',
    action: () => {
      loginRequest.loginOut().then(() => {
        userStore.clearUser()
        // 删除token
        clearToken()
        clearAutoToken()
        // 跳转到登录页
        window.location.href = '/login'
      })
    },
  },
]

const handleSelect = (key: string | number) => {
  const temp = options.find(item => item.key === key)
  temp?.action?.()
}
</script>

<template>
  <n-dropdown trigger="hover" :options="options" @select="handleSelect">
    <div class="opm-avatar">
      <div class="user-name">
        {{ userName }}
      </div>
      <NAvatar
        round
        size="small"
        src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
      />
    </div>
  </n-dropdown>
</template>

<style scoped lang="less">
@import "./avatar.less";
</style>
