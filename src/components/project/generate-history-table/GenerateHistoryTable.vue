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

const page = ref<number>(1)
const rows = ref<number>(16)
const total = ref<number>(10)

/**
 * 获取数据
 */
const listData = (pageNum = 1, rowsSize = 16) => {
  projectGenerateHistoryRequest.page({
    projectId: props.projectId,
    templateId: props.templateId,
    rows: rowsSize,
    page: pageNum,
  }).then((data) => {
    dataList.value = data.data.list
    page.value = data.data.page
    rows.value = data.data.rows
    total.value = data.data.total
  })
}

/**
 * 修改页数的方法
 * @param page
 */
const handleChangePage = (page: number) => {
  listData(page, rows.value)
}

/**
 * 修改分页大小的方法
 * @param rows
 */
const handleChangePageSize = (rows: number) => {
  listData(1, rows)
}

onMounted(() => {
  listData()
})
</script>

<template>
  <NDrawerContent v-once :title="props.title">
    <n-data-table
      :columns="columns"
      :data="dataList"
      :row-key="row => row.id"
      :pagination="false"
      :bordered="false"
    />
    <br>
    <n-space justify="end">
      <n-pagination
        v-model:page="page"
        v-model:page-size="rows"
        :page-sizes="[5, 10, 20, 30, 50]"
        :item-count="total"
        size="medium"
        show-quick-jumper
        show-size-picker
        @update:page="handleChangePage"
        @update:page-size="handleChangePageSize"
      />
    </n-space>
  </NDrawerContent>
</template>

<style scoped lang="scss">

</style>
