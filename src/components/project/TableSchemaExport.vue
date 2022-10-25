<script setup lang="ts">
import { NButton, NCard, NCheckbox, NDivider, NGrid, NGridItem, NInput, NPopover, NSpace } from 'naive-ui'
import { ref } from 'vue'
import { downloadFile, useMessage } from '@dc-basic-component/util'
import projectRequest from '~/api/project'
import type { TableSchemaVo } from '~/entity/project/table-schema-vo'

interface PropsState {
  projectId: string
  templateId?: string
}

const props = defineProps<PropsState>()

interface TableSchemaCheckVo extends TableSchemaVo {
  // 是否选中
  checked: boolean
}

// 过滤的名称
const filterName = ref<string>('')
// 源数据列表
const schemaArray = ref<Array<TableSchemaCheckVo>>([])
// 是否在生成中
const generating = ref<boolean>(false)
// 最终显示的列表
const showSchemaArray = computed<Array<TableSchemaCheckVo>>(() => {
  if (!filterName.value)
    return schemaArray.value
  return schemaArray.value.filter(item => item.tableName.includes(filterName.value) || item.comment.includes(filterName.value))
})
// 选中的信息
const checkedSchemaArray = computed<Array<TableSchemaCheckVo>>(() => schemaArray.value.filter(item => item.checked))
// 全部数据表 标题的名称
const showTableNameText = computed<string>(() => !filterName.value ? '全部数据表' : '过滤后的数据表')

const checkedMethod = {
  /**
   * 追加
   */
  append() {
    showSchemaArray.value.forEach(item => item.checked = true)
  },
  /**
   * 选中当前筛选
   */
  now() {
    checkedMethod.cancelAll()
    checkedMethod.append()
  },
  /**
   * 取消选中当前筛选
   */
  cancelNow() {
    showSchemaArray.value.forEach(item => item.checked = false)
  },
  /**
   * 取消全部
   */
  cancelAll() {
    schemaArray.value.forEach(item => item.checked = false)
  },
}

/**
 * 生成代码（调用后端的方法）
 */
const generate = () => {
  if (checkedSchemaArray.value.length === 0) {
    useMessage().error('请先选择数据表')
    return
  }
  projectRequest.generate(props.projectId, {
    templateId: props.templateId,
    tableNameList: checkedSchemaArray.value.map(item => item.tableName),
    ignoreError: 0,
  }).then(({ data: file }) => {
    useMessage().success('文件包打包完成，即将下载！')
    downloadFile(file.position + file.path, file.name)
  })
}

onMounted(() => {
  projectRequest.schema(props.projectId, props.templateId).then(({ data }) => {
    schemaArray.value = data.map(item => ({ ...item, checked: false }))
  })
})
</script>

<template>
  <NCard
    title="选择数据表生成"
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
  >
    <NGrid :x-gap="12" :cols="24">
      <NGridItem span="4">
        <NInput v-model:value="filterName" type="text" placeholder="输入搜索的表名或者备注" />
      </NGridItem>
      <NGridItem span="18">
        <NSpace align="center">
          <NPopover trigger="hover">
            <template #trigger>
              <NButton strong secondary type="primary" @click="checkedMethod.append()">
                追加选中
              </NButton>
            </template>
            <span>把当前筛选的数据追加到选中列表</span>
          </NPopover>
          <NButton strong secondary type="primary" @click="checkedMethod.now()">
            选中当前
          </NButton>
          <NButton strong secondary type="primary" @click="checkedMethod.cancelNow()">
            取消当前选中
          </NButton>
          <NButton strong secondary type="primary" @click="checkedMethod.cancelAll()">
            取消全部
          </NButton>
          <NDivider vertical />
          <NButton strong secondary type="primary" :disabled="checkedSchemaArray.length === 0" @click="generate">
            生成代码
          </NButton>
        </NSpace>
      </NGridItem>
    </NGrid>
    <NDivider title-placement="left">
      {{ showTableNameText }}
    </NDivider>
    <NGrid :x-gap="12" :y-gap="8" :cols="4">
      <NGridItem v-for="item in showSchemaArray" :key="item.tableName">
        <NCheckbox v-model:checked="item.checked">
          {{ item.tableName }}
        </NCheckbox>
      </NGridItem>
    </NGrid>
    <NDivider v-if="checkedSchemaArray.length > 0" title-placement="left">
      已选中的
    </NDivider>
    <NGrid :x-gap="12" :y-gap="8" :cols="4">
      <NGridItem v-for="item in checkedSchemaArray" :key="item.tableName">
        {{ item.tableName }}
      </NGridItem>
    </NGrid>
  </NCard>
</template>

<style scoped>

</style>
