<script setup lang="ts">
import { defineProps, ref } from 'vue'
import projectGenerateHistoryDetailRequest from '~/api/project-generate-history-detail'

const props = defineProps<{
  historyId: string
}>()

const list = ref<Array<string>>([])

onMounted(() => {
  projectGenerateHistoryDetailRequest.listByHistoryId(props.historyId).then((data) => {
    list.value = data.data
  })
})
</script>

<template>
  <div>
    <ul>
      <li v-for="item in list" :key="item">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
