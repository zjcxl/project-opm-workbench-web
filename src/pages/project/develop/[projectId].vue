<script setup lang="ts">
import { NSelect } from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import type { TemplateVo } from '~/entity/project/template-vo'
import projectDevelopRequest from '~/api/project-develop'
import templateRequest from '~/api/template'

const props = defineProps<{ projectId: string }>()

const options = ref<SelectMixedOption[]>([])
const selectDevelopId = ref<string>()

const templateArray = ref<Array<TemplateVo>>([])

/**
 * 修改变开发数据
 * @param value 选中的值
 */
const handleChangeDevelop = (value: string) => {
  templateRequest.page({ rows: 10, developId: value }).then((data) => {
    templateArray.value = data.data.list
  })
}

onMounted(() => {
  projectDevelopRequest.map({ rows: 10, projectId: props.projectId }).then((data) => {
    options.value = data.data.map(item => ({
      value: item.id,
      label: item.name,
    }))
    // 设置为第一个信息
    selectDevelopId.value = data.data[0].id
    // 执行数据加载
    handleChangeDevelop(data.data[0].id)
  })
})

const router = useRouter()
const go = (developId: string) => {
  router.push(`/project/develop/template/${developId}`)
}
</script>

<template>
  <NSelect v-model:value="selectDevelopId" :options="options" @update:value="handleChangeDevelop" />
  <div>
    <div v-for="item in templateArray" :key="item.id">
      {{ item }}
    </div>
  </div>
</template>
