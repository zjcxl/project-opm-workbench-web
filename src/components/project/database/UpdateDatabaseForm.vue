<script setup lang="ts">
import { defineEmits, defineProps, reactive, ref } from 'vue'
import { useMessage } from '@dc-basic-component/util'
import projectDevelopRequest from '~/api/project-develop'
import type { ProjectDevelopDto } from '~/entity/project/project-develop-dto'

interface PropsState {
  projectId?: string
  templateId?: string
  developId?: string
}

const props = defineProps<PropsState>()

const emit = defineEmits<{ (e: 'cancel'): void; (e: 'refresh'): void }>()

// 是否显示表单
const visible = ref<boolean>(false)

/**
 * 表单信息
 */
const model = reactive<ProjectDevelopDto>({
  projectId: '',
  name: '',
  isSuggestUse: 0,
  isDiscard: 0,
  isDisabled: 0,
  description: '',
  databaseUsername: '',
  databasePassword: '',
  databaseName: '',
  databaseType: 1,
  databaseHost: '',
  databasePort: '',
  moduleNames: '',
})

/**
 * 根据id获取信息
 * @param id 主键id
 */
const getById = (id = props.developId) => {
  if (id) {
    projectDevelopRequest.getById(id).then(({ data }) => {
      Object.assign(model, data)
      visible.value = true
    })
  }
  else {
    visible.value = true
  }
}

const submit = () => {
  (props.developId
    ? projectDevelopRequest.update(props.developId, model)
    : projectDevelopRequest.add(model))
    .then(() => {
      useMessage().success('保存成功')
      emit('refresh')
    })
}

// 根据id获取项目信息
onMounted(() => {
  getById()
})
</script>

<template>
  <NForm
    ref="formRef"
    :model="model"
    label-placement="left"
    label-width="auto"
  >
    <NDivider title-placement="left">
      基础设置
    </NDivider>
    <n-grid :cols="24" :x-gap="24">
      <NFormItemGi :span="24" label="名称" path="name">
        <NInput v-model:value="model.name" placeholder="请输入开发版名称" />
      </NFormItemGi>
      <NFormItemGi :span="24" label="描述" path="description">
        <NInput v-model:value="model.description" type="textarea" placeholder="请输入开发版描述信息" />
      </NFormItemGi>
      <NFormItemGi :span="6" label="建议使用" path="isSuggestUse">
        <NSwitch v-model:value="model.isSuggestUse" />
      </NFormItemGi>
      <NFormItemGi :span="6" label="是否废弃" path="isDiscard">
        <NSwitch v-model:value="model.isDiscard" />
      </NFormItemGi>
      <NFormItemGi :span="6" label="是否禁用" path="isDisabled">
        <NSwitch v-model:value="model.isDisabled" />
      </NFormItemGi>
      <NFormItemGi :span="24" label="依赖模块" path="moduleNames">
        <NInput v-model:value="model.moduleNames" type="textarea" placeholder="请输入依赖的模块名称列表（用,分隔每个模块）" />
      </NFormItemGi>
    </n-grid>
    <NDivider title-placement="left">
      高级设置
    </NDivider>
    <n-grid :cols="24" :x-gap="24">
      <NFormItemGi :span="12" label="HOST" path="databaseHost">
        <NInput v-model:value="model.databaseHost" placeholder="请输入数据库主机地址" />
      </NFormItemGi>
      <NFormItemGi :span="12" label="端口" path="databasePort">
        <NInput v-model:value="model.databasePort" placeholder="请输入数据库端口" />
      </NFormItemGi>
      <NFormItemGi :span="24" label="用户名" path="databaseUsername">
        <NInput v-model:value="model.databaseUsername" placeholder="请输入数据库用户名" />
      </NFormItemGi>
      <NFormItemGi :span="24" label="密码" path="databasePassword">
        <NInput v-model:value="model.databasePassword" type="password" placeholder="请输入数据库密码" />
      </NFormItemGi>
      <NFormItemGi :span="24" label="数据库名" path="databaseName">
        <NInput v-model:value="model.databaseName" placeholder="请输入数据库名称" />
      </NFormItemGi>
      <NFormItemGi :span="24" label="依赖模块" path="moduleNames">
        <NInput v-model:value="model.moduleNames" type="textarea" placeholder="请输入依赖的模块名称列表（用,分隔每个模块）" />
      </NFormItemGi>
    </n-grid>
    @ApiModelProperty("数据库用户名")
    private String databaseUsername;

    @ApiModelProperty("数据库密码")
    private String databasePassword;

    @ApiModelProperty("数据库名称")
    private String databaseName;

    @ApiModelProperty("数据库类型")
    private Integer databaseType;

    @ApiModelProperty("数据库host")
    private String databaseHost;

    @ApiModelProperty("数据库端口")
    private String databasePort;

    <NSpace>
      <NButton type="primary" @click="submit">
        提交
      </NButton>
      <NButton @click="emit('cancel')">
        取消
      </NButton>
    </NSpace>
  </NForm>
  <pre>
    @ApiModelProperty("项目id")
    private Long fkProjectId;

    @ApiModelProperty("开发版名称")
    private String name;

    @ApiModelProperty("是否是建议使用的版本 1=是 0=不是")
    private Integer isSuggestUse;

    @ApiModelProperty("是否废弃 1=是 0=不是")
    private Integer isDiscard;

    @ApiModelProperty("是否不可用 0=可用 1=不可用")
    private Integer isDisabled;

    @ApiModelProperty("开发版描述")
    private String description;

    @ApiModelProperty("数据库用户名")
    private String databaseUsername;

    @ApiModelProperty("数据库密码")
    private String databasePassword;

    @ApiModelProperty("数据库名称")
    private String databaseName;

    @ApiModelProperty("数据库类型")
    private Integer databaseType;

    @ApiModelProperty("数据库host")
    private String databaseHost;

    @ApiModelProperty("数据库端口")
    private String databasePort;

    @ApiModelProperty("依赖的模块名称列表")
    private String moduleNames;
  </pre>
</template>

<style scoped>

</style>
