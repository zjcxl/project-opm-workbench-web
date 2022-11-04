<script setup lang="ts">
import { nextTick } from 'vue'
import loginRequest from '~/api/login'
import { getToken } from '~/util/once/token-util'
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
      loginRequest.check().then((data) => {
        resolve(data.data)
      })
    }
  }).then((flag) => {
    nextTick(async () => {
      if (flag)
        await router.push('/')
      else
        await router.push('/login')
      // 显示主内容
      visible.value = true
    })
  })
})
</script>

<template>
  <main font-sans p="x-4 y-20px" h-100vh text="gray-700 dark:gray-200" overflow-hidden>
    <router-view v-if="visible" />
  </main>
</template>
