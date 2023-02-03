<script setup lang="ts">
import { reactive, ref } from 'vue'
import projectRequest from '~/api/project'
import type { ProjectVo } from '~/entity/project/project-vo'

const projectArray = ref<Array<ProjectVo>>([])
const updatePanel = reactive<{
  id?: string
  visible: boolean
  title: string
}>({
  id: '',
  visible: false,
  title: '',
})

const historyPanel = reactive<{
  id: string
  visible: boolean
  title: string
}>({
  id: '',
  visible: false,
  title: '',
})

const handleClickUpdate = (id?: string) => {
  updatePanel.id = id
  updatePanel.visible = true
  updatePanel.title = id ? '编辑项目' : '添加项目'
}

const refresh = () => {
  updatePanel.visible = false
  projectRequest.page({ rows: 10 }).then((data) => {
    projectArray.value = data.data.list
  })
}

const handleClickDelete = (id: string) => {
  projectRequest.delete(id).then(() => {
    refresh()
  })
}

const handleClickGenerateHistory = (project: ProjectVo) => {
  historyPanel.id = project.id
  historyPanel.visible = true
  historyPanel.title = `项目【${project.name}】的生成记录`
}

onMounted(() => {
  refresh()
})

const router = useRouter()
const go = (projectId: string) => {
  router.push(`/project/develop/${projectId}`)
}
</script>

<template>
  <NSpace justify="start" align="center">
    <NButton strong secondary type="primary" @click="handleClickUpdate()">
      <template #icon>
        <span i-carbon-add />
      </template>
      创建工程
    </NButton>
  </NSpace>
  <NDivider title-placement="left">
    项目列表
  </NDivider>
  <div class="project-container">
    <NCard v-for="item in projectArray" :key="item.id" :title="item.name">
      <template #header-extra>
        #header-extra
      </template>
      {{ item.description }}
      <template #footer>
        修改时间：{{ item.gmtModified }}
        <br>
        修改人：{{ item.updateUserName }}
      </template>
      <template #action>
        <n-space>
          <NButton quaternary text tag="a" @click="go(item.id)">
            查看
          </NButton>
          <NButton quaternary text tag="a" @click="handleClickUpdate(item.id)">
            编辑
          </NButton>
          <NButton type="error" text quaternary tag="a" @click="handleClickDelete(item.id)">
            删除
          </NButton>
          <NButton quaternary text tag="a" @click="handleClickGenerateHistory(item)">
            生成记录
          </NButton>
        </n-space>
      </template>
    </NCard>
  </div>
  <!-- 新增修改页面 -->
  <NDrawer v-model:show="updatePanel.visible" width="40%" placement="right">
    <NDrawerContent v-if="updatePanel.visible" :title="updatePanel.title" closable>
      <UpdateProject :project-id="updatePanel.id" @cancel="updatePanel.visible = false" @refresh="refresh" />
    </NDrawerContent>
  </NDrawer>
  <!-- 生成历史记录 -->
  <NDrawer v-model:show="historyPanel.visible" width="90%" placement="right">
    <GenerateHistoryTable v-if="historyPanel.visible" :project-id="historyPanel.id" :title="historyPanel.title" />
  </NDrawer>
</template>

<style scoped lang="less">
.project-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 16px;
}
</style>
