<script setup lang="ts">
import Header from './Header.vue'
import loginRequest from '~/api/login'
import { useUserStore } from '~/store/user-store'

const userStore = useUserStore()

onMounted(() => {
  // 获取登录用户的信息
  loginRequest.info().then((data) => {
    userStore.setUser(data.data)
  })
})
</script>

<template>
  <Header />
  <main p="x-4 y-20px" h-100vh>
    <router-view />
  </main>
</template>

<style scoped>

</style>
