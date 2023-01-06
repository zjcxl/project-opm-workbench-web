<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { columns } from './columns'
import projectGenerateHistoryRequest from '~/api/project-generate-history'
import type { ProjectGenerateHistoryVo } from '~/entity/project/project-generate-history-vo'

interface PropsState {
  projectId?: string
  templateId?: string
  title?: string
}

const props = withDefaults(defineProps<PropsState>(), {
  title: '生成历史',
})
// 数据列表
const dataList = ref<Array<ProjectGenerateHistoryVo>>([])

onMounted(() => {
  projectGenerateHistoryRequest.page({
    projectId: props.projectId,
    templateId: props.templateId,
    rows: 30,
  }).then((data) => {
    dataList.value = data.data.list
  })
})
</script>

<template>
  <NDrawerContent v-once :title="props.title">
    <n-data-table
      :columns="columns"
      :data="dataList"
      :pagination="false"
      :bordered="false"
    />
  </NDrawerContent>
</template>

<style scoped lang="scss">

</style>
