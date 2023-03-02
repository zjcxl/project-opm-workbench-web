<script setup lang="ts">
import { defineProps } from 'vue'
import { BaseTableHelper } from '@dc-basic-component/ui-naive'
import { columns } from './columns'
import projectGenerateHistoryRequest from '~/api/project-generate-history'

interface PropsState {
  projectId?: string
  templateId?: string
  title?: string
}

const props = withDefaults(defineProps<PropsState>(), {
  title: '生成历史',
})
</script>

<template>
  <NDrawerContent v-once :title="props.title">
    <BaseTableHelper
      :columns="columns"
      :fetch-method="projectGenerateHistoryRequest.page"
      :default-params="{ projectId: props.projectId, templateId: props.templateId }"
      :row-key="row => row.id"
      :pagination="false"
      :bordered="false"
      :default-rows="13"
    />
  </NDrawerContent>
</template>

<style scoped lang="scss">

</style>
