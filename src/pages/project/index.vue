<script setup lang="ts">
import { NButton, NCard } from 'naive-ui'
import projectRequest from '~/api/project'
import type { ProjectVo } from '~/entity/project/project-vo'

const projectArray = ref<Array<ProjectVo>>([])

onMounted(() => {
  projectRequest.page({ rows: 10 }).then((data) => {
    projectArray.value = data.data.list
  })
})

const router = useRouter()
const go = (projectId: string) => {
  router.push(`/project/develop/${projectId}`)
}
</script>

<template>
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
        <NButton quaternary @click="go(item.id)">
          查看
        </NButton>
        <NButton quaternary @click="go(item.id)">
          编辑
        </NButton>
      </template>
    </NCard>
  </div>
</template>

<style scoped>
.project-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 16px;
}
</style>
