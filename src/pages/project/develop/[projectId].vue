<script setup lang="ts">
import type { TreeOption } from 'naive-ui'
import { NButton, NDrawer, NDrawerContent, NSelect, NSpace } from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import { downloadFile, useMessage } from '@dc-basic-component/util'
import FileManage from '../../../components/file-manage/FileManage.vue'
import MonacoEditor from '../../../components/editor/MonacoEditor.vue'
import projectRequest from '~/api/project'
import projectDevelopRequest from '~/api/project-develop'
import templateRequest from '~/api/template'
import templateDetailRequest from '~/api/template-detail'
import type { TemplateDetailVo } from '~/entity/project/template-detail-vo'

const props = defineProps<{ projectId: string }>()

const developOptions = ref<SelectMixedOption[]>([])
const templateOptions = ref<SelectMixedOption[]>([])
const selectDevelopId = ref<string>()
const selectTemplateId = ref<string>()
const drawerVisible = ref<boolean>(false)

const monacoEditorSqlPanel = ref<InstanceType<typeof MonacoEditor>>()

const detailArray = ref<TemplateDetailVo[]>([])

// 解析数据
const resultArray = ref<TreeOption[]>([])
const templateDetailMap: Record<string, TemplateDetailVo> = {}

const handle = (array: TemplateDetailVo[]) => {
  // 结果数组
  const result: TreeOption[] = []
  // 结果对象
  const resultMap: Record<string, TreeOption> = {}
  array.forEach((item) => {
    // 保存西悉尼
    templateDetailMap[item.id] = item
    const packageNameArray = item.packageName.split('.')
    packageNameArray.reduce((prev, current) => {
      const key = prev ? `${prev}.${current}` : current
      // 上一个节点
      const prevNode = resultMap[prev]
      if (!resultMap[key]) {
        const option: TreeOption = {
          key,
          label: current,
          children: [],
        }
        resultMap[key] = option
        if (!prevNode)
          result.push(option)
        else
          prevNode.children?.push(option)
      }
      return key
    }, '')
    // 获取最后一个，放入文件信息
    resultMap[item.packageName].children?.push({
      key: item.id,
      label: item.fileName,
    })
  })
  resultArray.value = result
}

const visible = ref<boolean>(false)

/**
 * 修改模板id的方法
 * @param value
 */
const handleChangeTemplate = (value: string) => {
  templateDetailRequest.all({ templateId: value, isNew: 1 }).then((data) => {
    visible.value = false
    detailArray.value = data.data
    handle(data.data)
    visible.value = true
  })
}

/**
 * 修改变开发数据
 * @param value 选中的值
 */
const handleChangeDevelop = (value: string) => {
  templateRequest.map({ developId: value }).then((data) => {
    templateOptions.value = data.data.map(item => ({
      value: item.id,
      label: item.name,
    }))
    // 选择第一个模板信息
    // 设置为第一个信息
    selectTemplateId.value = data.data[0].id
    handleChangeTemplate(data.data[0].id)
  })
}

const fileSave = (id: string, content: string) => {
  const detail = templateDetailMap[id]
  if (!detail) {
    useMessage().error('没有找到已有的文件')
    return
  }
  detail.content = content
  templateDetailRequest.update(id, { ...detail }).then((data) => {
    // 保存成功
    useMessage().success('保存成功')
    // eslint-disable-next-line no-console
    console.log(1)
  })
}

const exportData = () => {
  projectRequest.generate(props.projectId, {
    templateId: selectTemplateId.value,
  }).then((data) => {
    const file = data.data
    downloadFile(file.position + file.path, file.name)
    useMessage().success('导出成功')
  })
}

/**
 * 根据sql导出
 */
const exportDataBySql = () => {
  if (!monacoEditorSqlPanel || !monacoEditorSqlPanel.value) {
    useMessage().error('没有找到sql编辑器')
    return
  }
  const content = monacoEditorSqlPanel.value.getValue()
  projectRequest.generate(props.projectId, {
    templateId: selectTemplateId.value,
    sql: content,
  }).then((data) => {
    const file = data.data
    downloadFile(file.position + file.path, file.name)
    useMessage().success('导出成功')
  })
}

onMounted(() => {
  projectDevelopRequest.map({ rows: 10, projectId: props.projectId }).then((data) => {
    developOptions.value = data.data.map(item => ({
      value: item.id,
      label: item.name,
    }))
    // 设置为第一个信息
    selectDevelopId.value = data.data[0].id
    // 执行数据加载
    handleChangeDevelop(data.data[0].id)
  })
})
</script>

<template>
  <NSpace>
    <NSelect v-model:value="selectDevelopId" w-120px :options="developOptions" @update:value="handleChangeDevelop" />
    <NSelect v-model:value="selectTemplateId" w-120px :options="templateOptions" @update:value="handleChangeTemplate" />
    <NButton @click="exportData">
      导出
    </NButton>
    <NButton @click="drawerVisible = true">
      使用建表sql导出
    </NButton>
  </NSpace>
  <br>
  <FileManage
    v-if="visible"
    :data="resultArray"
    :get-content-method="templateDetailRequest.content"
    :save-content-method="fileSave"
    style="height: 800px"
  />
  <NDrawer v-model:show="drawerVisible" width="90%" placement="right">
    <NDrawerContent title="建表sql">
      <NSpace>
        <NButton @click="exportDataBySql">
          导出
        </NButton>
      </NSpace>
      <br>
      <MonacoEditor ref="monacoEditorSqlPanel" container-id="test" content="create table table_name () comment '表格备注'" language="sql" />
    </NDrawerContent>
  </NDrawer>
</template>
