<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useMessage } from '@dc-basic-component/util'
import type { ProjectDto } from '~/entity/project/project-dto'
import projectRequest from '~/api/project'

interface PropsState {
  projectId?: string
}

const props = defineProps<PropsState>()

const emit = defineEmits<{ (e: 'cancel'): void; (e: 'refresh'): void }>()

// 是否是添加
const isAdd = computed(() => !props.projectId)
// 是否显示表单
const visible = ref<boolean>(false)

/**
 * 表单信息
 */
const model = reactive<ProjectDto>({
  description: '',
  isDisabled: 0,
  name: '',
})

/**
 * 根据id获取信息
 * @param id 主键id
 */
const getById = (id = props.projectId) => {
  if (id) {
    projectRequest.getById(id).then(({ data }) => {
      Object.assign(model, data)
      visible.value = true
    })
  }
  else {
    visible.value = true
  }
}

const submit = () => {
  (props.projectId
    ? projectRequest.update(props.projectId, model)
    : projectRequest.add(model))
    .then(() => {
      useMessage().success('保存成功')
      emit('refresh')
    })
}

// 根据id获取项目信息
onMounted(() => {
  getById()
})

// eslint-disable-next-line no-console
console.log(props.projectId)
</script>

<template>
  <NForm
    ref="formRef"
    :model="model"
    label-placement="left"
    label-width="auto"
  >
    <NFormItem label="名称" path="name">
      <NInput v-model:value="model.name" placeholder="请输入项目名称" />
    </NFormItem>
    <NFormItem label="是否禁用" path="isDisabled">
      <NSwitch v-model:value="model.isDisabled" />
    </NFormItem>
    <NFormItem label="描述" path="description">
      <NInput v-model:value="model.description" type="textarea" placeholder="请输入项目描述信息" />
    </NFormItem>
    <NSpace>
      <NButton type="primary" @click="submit">
        提交
      </NButton>
      <NButton @click="emit('cancel')">
        取消
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped>

</style>
