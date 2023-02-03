<script setup lang="ts">
import type { TreeOption } from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import { useMessage } from '@dc-basic-component/util'
import { computed, ref } from 'vue'
import FileManage from '../../../components/file-manage/FileManage.vue'
import projectRequest from '~/api/project'
import projectDevelopRequest from '~/api/project-develop'
import templateRequest from '~/api/template'
import templateDetailRequest from '~/api/template-detail'
import {
  getTemplateDetailById,
  handleTemplateDetailList,
  setTemplateDetailById,
  useLanguageType,
} from '~/util/once/template-detail-util'
import type { VariableModel } from '~/entity/project/variable-model'
import type { ProjectMapVo } from '~/entity/project/project-map-vo'
import type { ProjectDevelopMapVo } from '~/entity/project/project-develop-map-vo'
import type { TemplateMapVo } from '~/entity/project/template-map-vo'
import TableSchemaExport from '~/components/project/TableSchemaExport.vue'
import GenerateHistoryTable from '~/components/project/generate-history-table/GenerateHistoryTable.vue'
import TableSqlExport from '~/components/project/TableSqlExport.vue'
import UpdateDatabaseForm from '~/components/project/database/UpdateDatabaseForm.vue'

const props = defineProps<{ projectId: string }>()

// 项目列表
const projectMapOptions = ref<SelectMixedOption[]>([])
const projectMap = ref<Record<string, ProjectMapVo>>({})
// 开发信息
const developOptions = ref<SelectMixedOption[]>([])
const developMap = ref<Record<string, ProjectDevelopMapVo>>({})
// 模板信息
const templateOptions = ref<SelectMixedOption[]>([])
const templateMap = ref<Record<string, TemplateMapVo>>({})
// 选中的开发id
const selectDevelopId = ref<string>()
// 选中的模板id
const selectTemplateId = ref<string>()
// 建表sql输入抽屉开关
const drawerVisible = ref<boolean>(false)
// 生成历史抽屉开关
const historyVisible = ref<boolean>(false)
// 数据库配置抽屉开关
const databaseVisible = ref<boolean>(false)
// 文件树列表
const fileManageTreeList = ref<Array<TreeOption>>([])
// 是否显示文件管理内容
const fileManageVisible = ref<boolean>(false)
// schema导出的方法面板展示
const visibleSchemaExportPanel = ref<boolean>(false)

// 是否可以使用建表sql按钮
const canExportButton = computed<boolean>(() => fileManageTreeList.value.length > 0)
// 当前项目的名称
const projectInfo = computed<ProjectMapVo>(() => projectMap.value[props.projectId])
const showProjectOptions = computed<SelectMixedOption[]>(() => projectMapOptions.value.filter(item => item.key !== props.projectId))
// 当前开发信息
const projectDevelopInfo = computed<ProjectDevelopMapVo>(() => developMap.value[selectDevelopId.value || ''])
const showProjectDevelopOptions = computed<SelectMixedOption[]>(() => developOptions.value.filter(item => item.key !== selectDevelopId.value))
// 模板信息
const templateInfo = computed<TemplateMapVo>(() => templateMap.value[selectTemplateId.value || ''])
const showTemplateOptions = computed<SelectMixedOption[]>(() => templateOptions.value.filter(item => item.key !== selectTemplateId.value))

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
    data.forEach((item) => {
      templateMap.value[item.id] = item
    })
    templateOptions.value = data.map(item => ({
      key: item.id,
      value: item.id,
      label: item.name,
    }))
    // 选中第一个
    data.length > 0 && handleChangeTemplate(data[0].id)
  })
}

const router = useRouter()

/**
 * 处理项目列表
 * @param projectId 项目id
 */
const handleSelectProject = (projectId: string) => {
  router.push(`/project/develop/${projectId}`)
}

/**
 * 处理文件保存
 * @param id 文件id
 * @param content 文件内容
 */
const handleFileSave = (id: string, content: string): Promise<string> => {
  const detail = getTemplateDetailById(id)
  if (!detail) {
    useMessage().error('没有找到已有的文件')
    throw new Error('没有找到已有的文件')
  }
  if (content === detail.content) {
    useMessage().success('保存成功')
    return Promise.resolve(id)
  }
  return new Promise<string>((resolve) => {
    // 修改接口
    templateDetailRequest.update(id, { ...detail, content }).then(({ data }) => {
      // 保存信息
      setTemplateDetailById(id, data.id, data)
      // 保存成功
      useMessage().success('保存成功')
      resolve(data.id)
    })
  })
}

/**
 * 获取变量列表的方法
 */
const listVariable = () => {
  return new Promise<Array<VariableModel>>((resolve) => {
    projectRequest.listVariable(props.projectId, { templateId: selectTemplateId.value }).then(({ data }) => {
      resolve(data)
    })
  })
}

const init = (projectId = props.projectId) => {
  // 初始化部分数据
  developOptions.value = []
  templateOptions.value = []
  selectDevelopId.value = undefined
  selectTemplateId.value = undefined
  fileManageTreeList.value = []
  // 查询所有的开发版本map列表
  projectDevelopRequest.map({ projectId }).then(({ data }) => {
    data.forEach((item) => {
      developMap.value[item.id] = item
    })
    developOptions.value = data.map(item => ({
      key: item.id,
      value: item.id,
      label: item.name,
    }))
    // 自动加载第一个数据
    data.length > 0 && handleChangeDevelop(data[0].id)
  })
}

// 项目id改变监听
watch(
  () => props.projectId,
  (projectId) => {
    init(projectId)
  },
)

onMounted(() => {
  // 查询所有的项目map
  projectRequest.map({}).then(({ data }) => {
    data.forEach((item) => {
      projectMap.value[item.id] = item
    })
    projectMapOptions.value = data.map(item => ({
      key: item.id,
      value: item.id,
      label: item.name,
    }))
  })
  init(props.projectId)
})
</script>

<template>
  <NBreadcrumb h-40px select-none>
    <NBreadcrumbItem href="/">
      首页
    </NBreadcrumbItem>
    <NBreadcrumbItem>
      <template v-if="showProjectOptions.length > 0">
        <NDropdown :options="showProjectOptions" @select="handleSelectProject">
          <div class="trigger">
            {{ projectInfo?.name || '项目管理' }}
          </div>
        </NDropdown>
      </template>
      <template v-else>
        {{ projectInfo?.name || '项目管理' }}
      </template>
    </NBreadcrumbItem>
    <NBreadcrumbItem>
      <template v-if="showProjectDevelopOptions.length > 0">
        <NDropdown :options="showProjectDevelopOptions" @select="handleChangeDevelop">
          <div class="trigger">
            {{ projectDevelopInfo?.name || '开发管理' }}
          </div>
        </NDropdown>
      </template>
      <template v-else>
        {{ projectDevelopInfo?.name || '开发管理' }}
      </template>
    </NBreadcrumbItem>
    <NBreadcrumbItem>
      <template v-if="showTemplateOptions.length > 0">
        <NDropdown :options="showTemplateOptions" @select="handleChangeTemplate">
          <div class="trigger">
            {{ templateInfo?.name || '模板管理' }}
          </div>
        </NDropdown>
      </template>
      <template v-else>
        {{ templateInfo?.name || '模板管理' }}
      </template>
    </NBreadcrumbItem>
    <NBreadcrumbItem>
      信息配置
    </NBreadcrumbItem>
  </NBreadcrumb>
  <NEmpty
    v-if="!fileManageVisible" description="这是一个空的项目" style="height: calc(100% - 40px)" flex
    justify-center
  />
  <FileManage
    v-else
    :tree-data-list="fileManageTreeList"
    :get-content-method="templateDetailRequest.content"
    :save-content-method="handleFileSave"
    :list-variable="listVariable"
    style="height: calc(100% - 40px)"
  >
    <template #operation>
      <NSwitch v-model:value="useLanguageType">
        <template #checked>
          使用文件语言
        </template>
        <template #unchecked>
          使用模板语言
        </template>
      </NSwitch>
    </template>
    <template #operation-end>
      <NButton strong secondary type="success" :disabled="!canExportButton" @click="visibleSchemaExportPanel = true">
        数据表生成代码
      </NButton>
      <NButton strong secondary type="success" :disabled="!canExportButton" @click="drawerVisible = true">
        建表SQL生成代码
      </NButton>
      <NButton strong secondary type="success" @click="historyVisible = true">
        生成历史记录
        <template #icon>
          <i i-carbon-time />
        </template>
      </NButton>
      <NButton strong secondary type="success" @click="databaseVisible = true">
        数据库配置
        <template #icon>
          <i i-ri-database-2-line />
        </template>
      </NButton>
    </template>
  </FileManage>
  <!-- 选择数据表生成的面板 -->
  <NDrawer v-model:show="visibleSchemaExportPanel" width="90%" placement="right">
    <TableSchemaExport v-if="visibleSchemaExportPanel" :project-id="props.projectId" :template-id="selectTemplateId" />
  </NDrawer>
  <!-- 使用建表sql生成的面板 -->
  <NDrawer v-model:show="drawerVisible" width="90%" placement="right">
    <TableSqlExport v-if="drawerVisible" :project-id="props.projectId" :template-id="selectTemplateId" />
  </NDrawer>
  <!-- 生成历史记录 -->
  <NDrawer v-model:show="historyVisible" width="90%" placement="right">
    <GenerateHistoryTable v-if="historyVisible" :project-id="props.projectId" :template-id="selectTemplateId" :title="projectInfo ? `项目【${projectInfo.name}】的生成记录` : ''" />
  </NDrawer>
  <!-- 数据库配置面板 -->
  <NDrawer v-model:show="databaseVisible" width="90%" placement="right">
    <UpdateDatabaseForm v-if="databaseVisible" :project-id="props.projectId" :template-id="selectTemplateId" :develop-id="selectDevelopId" :title="projectInfo ? `项目【${projectInfo.name}】的生成记录` : ''" />
  </NDrawer>
</template>
