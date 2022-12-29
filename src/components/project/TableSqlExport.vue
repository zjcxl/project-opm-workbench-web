<script setup lang="ts">
import { downloadFile, useMessage } from '@dc-basic-component/util'
import { ref } from 'vue'
import defaultSql from './default-sql-ddl'
import projectRequest from '~/api/project'
import MonacoEditor from '~/components/editor/MonacoEditor.vue'

interface PropsState {
  projectId: string
  templateId?: string
}

const props = defineProps<PropsState>()

// sql编辑面板
const monacoEditorSqlPanel = ref<InstanceType<typeof MonacoEditor>>()
// 是否忽略sql异常信息
const ignoreError = useLocalStorage<boolean>('create_sql_ignore_error', true)

/**
 * 点击建表sql生成代码事件
 */
const generate = () => {
  const sql = monacoEditorSqlPanel?.value?.getValue()
  if (!sql) {
    useMessage().error('请输入完成的建表sql')
    return
  }
  projectRequest.generate(props.projectId, {
    templateId: props.templateId,
    sql,
    ignoreError: ignoreError.value ? 1 : 0,
  }).then(({ data: file }) => {
    useMessage().success('文件包打包完成，即将下载！')
    downloadFile(file.position + file.path, file.name)
  })
}
</script>

<template>
  <NDrawerContent title="建表SQL">
    <NSpace align="center">
      <NButton strong secondary type="success" @click="generate">
        生成代码
      </NButton>
      <NSwitch v-model:value="ignoreError">
        <template #checked>
          忽略SQL异常
        </template>
        <template #unchecked>
          提示SQL异常
        </template>
      </NSwitch>
    </NSpace>
    <br>
    <MonacoEditor
      ref="monacoEditorSqlPanel"
      :content="defaultSql"
      language="sql"
      style="height: 90%"
    />
  </NDrawerContent>
</template>

<style scoped>

</style>
