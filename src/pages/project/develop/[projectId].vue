<script setup lang="ts">
import { NButton, NCollapse, NCollapseItem, NSelect } from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import MonacoEditor from '../../../components/MonacoEditor.vue'
import FileManage from '../../../components/file-manage/FileManage.vue'
import projectDevelopRequest from '~/api/project-develop'
import templateRequest from '~/api/template'
import templateDetailRequest from '~/api/template-detail'
import type { TemplateDetailVo } from '~/entity/project/template-detail-vo'

const props = defineProps<{ projectId: string }>()

const developOptions = ref<SelectMixedOption[]>([])
const templateOptions = ref<SelectMixedOption[]>([])
const selectDevelopId = ref<string>()
const selectTemplateId = ref<string>()

const detailArray = ref<TemplateDetailVo[]>([])

/**
 * 修改模板id的方法
 * @param value
 */
const handleChangeTemplate = (value: string) => {
  templateDetailRequest.all({ templateId: value }).then((data) => {
    detailArray.value = data.data
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

const router = useRouter()
const go = (developId: string) => {
  router.push(`/project/develop/template/${developId}`)
}
const map = ref<Record<string, any>>({})
const array = ref<any[]>([])

const getValue = (content: string) => {
  // eslint-disable-next-line no-console
  console.log(content)
  // eslint-disable-next-line no-console
  console.log(array.value[0])
  // eslint-disable-next-line no-console
  console.log(array.value[0].value)
  // eslint-disable-next-line no-console
  console.log(array.value[0].getValue())
}

const setRefItem = (el: any) => {
  array.value.push(el)
  // map.value[id] = el
}
</script>

<template>
  <!--  <NSelect v-model:value="selectDevelopId" :options="developOptions" @update:value="handleChangeDevelop" /> -->
  <!--  <NSelect v-model:value="selectTemplateId" :options="templateOptions" /> -->
  <!--  <br> -->
  <FileManage :get-content-method="templateDetailRequest.content" style="height: 600px" />
<!--  <br> -->
<!--  <div> -->
<!--    <NCollapse> -->
<!--      <NCollapseItem v-for="item in detailArray" :key="item.key" :title="item.fileName" :name="item.key"> -->
<!--        <NButton @click="getValue(item.id)"> -->
<!--          获取 -->
<!--        </NButton> -->
<!--        <MonacoEditor :ref="setRefItem" :content="item.content" /> -->
<!--        &lt;!&ndash;        <pre>{{ item.content }}</pre> &ndash;&gt; -->
<!--      </NCollapseItem> -->
<!--    </NCollapse> -->
<!--  </div> -->
</template>
