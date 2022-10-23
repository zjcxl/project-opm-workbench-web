<script setup lang="ts">
import type { TreeOption } from 'naive-ui'
import { NButton, NDrawer, NDrawerContent, NEmpty, NSelect, NSpace } from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import { downloadFile, useMessage } from '@dc-basic-component/util'
import { ref } from 'vue'
import FileManage from '../../../components/file-manage/FileManage.vue'
import MonacoEditor from '../../../components/editor/MonacoEditor.vue'
import projectRequest from '~/api/project'
import projectDevelopRequest from '~/api/project-develop'
import templateRequest from '~/api/template'
import templateDetailRequest from '~/api/template-detail'
import { getTemplateDetailById, handleTemplateDetailList } from '~/util/once/template-detail-util'

const props = defineProps<{ projectId: string }>()

const developOptions = ref<SelectMixedOption[]>([])
const templateOptions = ref<SelectMixedOption[]>([])
// 选中的开发id
const selectDevelopId = ref<string>()
// 选中的模板id
const selectTemplateId = ref<string>()
// 建表sql输入抽屉开关
const drawerVisible = ref<boolean>(false)
// sql编辑面板
const monacoEditorSqlPanel = ref<InstanceType<typeof MonacoEditor>>()
// 文件树列表
const fileManageTreeList = ref<Array<TreeOption>>([])
// 是否文件管理内容
const fileManageVisible = ref<boolean>(false)

// 是否可以使用建表sql按钮
const canUseSqlButton = computed<boolean>(() => fileManageTreeList.value.length > 0)

/**
 * 默认的sql文件内容
 */
const defaultSql = `create table table_name (
id varchar(32) null comment '主键id'
) comment '表格备注'
 `

/**
 * 修改模板id的方法
 * @param templateId 模板id
 */
const handleChangeTemplate = (templateId: string) => {
  selectTemplateId.value = templateId
  // 设置为不可见
  fileManageVisible.value = false
  // 获取模板下所有的详情信息（最新的数据）
  templateDetailRequest.all({ templateId, isNew: 1 }).then(({ data }) => {
    fileManageTreeList.value = handleTemplateDetailList(data)
    fileManageVisible.value = true
  })
}

/**
 * 修改变开发数据
 * @param developId 开发id
 */
const handleChangeDevelop = (developId: string) => {
  selectDevelopId.value = developId
  // 查询模板map列表
  templateRequest.map({ developId }).then(({ data }) => {
    templateOptions.value = data.map(item => ({
      value: item.id,
      label: item.name,
    }))
    // 选中第一个
    data.length > 0 && handleChangeTemplate(data[0].id)
  })
}

/**
 * 处理文件保存
 * @param id 文件id
 * @param content 文件内容
 */
const handleFileSave = (id: string, content: string) => {
  const detail = getTemplateDetailById(id)
  if (!detail) {
    useMessage().error('没有找到已有的文件')
    return
  }
  // 修改接口
  templateDetailRequest.update(id, { ...detail, content }).then(() => {
    // 保存成功
    useMessage().success('保存成功')
  })
}

/**
 * 生成代码（调用后端的方法）
 */
const generate = (projectId: string, params?: Partial<{
  sql: string
  templateId: string
  tableNameList: Array<string>
}>) => {
  projectRequest.generate(projectId, params).then(({ data: file }) => {
    useMessage().success('文件包打包完成，即将下载！')
    downloadFile(file.position + file.path, file.name)
  })
}

/**
 * 点击生成代码事件
 */
const handelClickGenerate = () => {
  generate(props.projectId, { templateId: selectTemplateId.value })
}

/**
 * 点击建表sql生成代码事件
 */
const handelClickGenerateBySql = () => {
  const sql = monacoEditorSqlPanel?.value?.getValue()
  if (!sql) {
    useMessage().error('请输入完成的建表sql')
    return
  }
  generate(props.projectId, { templateId: selectTemplateId.value, sql })
}

onMounted(() => {
  // 查询所有的开发版本map列表
  projectDevelopRequest.map({ projectId: props.projectId }).then(({ data }) => {
    developOptions.value = data.map(item => ({
      value: item.id,
      label: item.name,
    }))
    // 自动加载第一个数据
    data.length > 0 && handleChangeDevelop(data[0].id)
  })
})
</script>

<template>
  <NSpace>
    <NSelect v-model:value="selectDevelopId" w-120px :disabled="developOptions.length === 0" :options="developOptions" @update:value="handleChangeDevelop" />
    <NSelect v-model:value="selectTemplateId" w-120px :disabled="templateOptions.length === 0" :options="templateOptions" @update:value="handleChangeTemplate" />
    <NButton disabled strong secondary type="success" @click="handelClickGenerate">
      生成代码
    </NButton>
    <NButton strong secondary type="success" :disabled="!canUseSqlButton" @click="drawerVisible = true">
      建表SQL生成代码
    </NButton>
  </NSpace>
  <br>
  <NEmpty v-if="!fileManageVisible" description="这是一个空的项目" h-300px flex justify-center />
  <FileManage
    v-else
    :tree-data-list="fileManageTreeList"
    :get-content-method="templateDetailRequest.content"
    :save-content-method="handleFileSave"
    style="height: 800px"
  />
  <NDrawer v-model:show="drawerVisible" width="90%" placement="right">
    <NDrawerContent title="建表SQL">
      <NSpace>
        <NButton strong secondary type="success" @click="handelClickGenerateBySql">
          生成代码
        </NButton>
      </NSpace>
      <br>
      <MonacoEditor
        ref="monacoEditorSqlPanel"
        :content="defaultSql"
        language="sql"
      />
    </NDrawerContent>
  </NDrawer>
</template>
