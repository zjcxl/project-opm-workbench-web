<script setup lang="ts">
const router = useRouter()
onMounted(() => {
  nextTick(() => {
    router.push('/project')
  })
})
</script>

<template>
  <div />
</template>
