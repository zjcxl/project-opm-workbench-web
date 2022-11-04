<script setup lang="ts">
import { nextTick } from 'vue'
import loginRequest from '~/api/login'
// 页面是否可见
const visible = ref<boolean>(false)

const router = useRouter()
onMounted(() => {
  loginRequest.check().then((data) => {
    nextTick(() => {
      if (data.data)
        router.push('/')
      else
        router.push('/login')
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
