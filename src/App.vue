<script setup lang="ts">
import { nextTick } from 'vue'
import { NANOID } from '@dc-basic-component/util'
import loginRequest from '~/api/login'
import { clearToken, getAutoToken, getToken, setToken } from '~/util/once/token-util'
import { handleRsa } from '~/util/once/rsa-util'
// 页面是否可见
const visible = ref<boolean>(false)

const router = useRouter()
onMounted(() => {
  // 获取token信息
  const token = getToken()
  new Promise((resolve) => {
    if (!token) {
      resolve(false)
    }
    else {
      loginRequest.check().then(async (data) => {
        const flag = data.data
        if (flag) {
          resolve(true)
        }
        else {
          // 设置自动登录信息
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
              resolve(true)
            })
          }
          else {
            resolve(false)
          }
        }
      })
    }
  }).then((flag) => {
    nextTick(async () => {
      if (flag) {
        await router.push('/project')
      }
      else {
        clearToken()
        await router.push('/login')
      }
      // 显示主内容
      visible.value = true
    })
  })
})
</script>

<template>
  <div font-sans h-100vh text="gray-700 dark:gray-200" overflow-hidden>
    <router-view v-if="visible" />
  </div>
</template>
