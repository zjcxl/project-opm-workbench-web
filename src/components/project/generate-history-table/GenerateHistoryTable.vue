<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { columns } from './columns'
import projectGenerateHistoryRequest from '~/api/project-generate-history'
import type { ProjectGenerateHistoryVo } from '~/entity/project/project-generate-history-vo'

interface PropsState {
  projectId: string
  templateId?: string
}

const props = defineProps<PropsState>()
const dataList = ref<Array<ProjectGenerateHistoryVo>>([])

onMounted(() => {
  projectGenerateHistoryRequest.page({
    projectId: props.projectId,
    templateId: props.templateId,
    rows: 50,
  }).then((data) => {
    dataList.value = data.data.list
  })
})
</script>

<template>
  <NDrawerContent title="生成历史">
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
