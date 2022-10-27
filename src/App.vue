<script setup lang="ts">
import { getRequestConfig } from '@dc-basic-component/config'

console.log(getRequestConfig())
</script>

<template>
  <main font-sans p="x-4 y-20px" h-100vh text="gray-700 dark:gray-200" overflow-hidden>
    <router-view />
  </main>
</template>
