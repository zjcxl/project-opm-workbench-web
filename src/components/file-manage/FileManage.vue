<script setup lang="ts">
import { h, ref } from 'vue'
import type { TreeOption } from 'naive-ui'
import { NButton, NDivider, NIcon, NSpace, NTree } from 'naive-ui'
import { ChevronForward } from '@vicons/ionicons5'
import type { ResultModel } from '@dc-basic-component/config'
import MonacoEditor from '../editor/MonacoEditor.vue'
import { FileManage, getFirstOption, renderLabel, renderPrefix, sortTreeOption } from './method'

interface PropsState {
  /**
   * 获取文件内容的方法
   * @param fileId 文件id
   */
  getContentMethod: (fileId: string) => Promise<ResultModel<string>>
  /**
   * 保存文件的方法
   * @param fileId  文件id
   * @param content 文件内容
   */
  saveContentMethod: (fileId: string, content: string) => void
  /**
   * 文件资源列表
   */
  treeDataList: Array<TreeOption>
}

const props = defineProps<PropsState>()

// 文件栏的宽度
const fileContainerWidth = ref<number>(500)
// 文件栏宽度的计算值
const fileContainerWidthComputed = computed(() => `${fileContainerWidth.value}px`)
// 默认选中的值（文件列表的第一项）
const defaultSelectedKeys = ref<string[]>([])
// 箭头样式
const renderSwitcherIcon = () => h(NIcon, null, { default: () => h(ChevronForward) })
// 编辑器对象
const monacoEditorRef = ref<InstanceType<typeof MonacoEditor>>()
// 文件管理对象
const fileManage = ref<FileManage | undefined>(undefined)
// 数据列表
const dataList = ref<TreeOption[]>([])

/**
 * 选中文件的方法
 * @param fileId 文件id
 * @param name 文件名称
 */
const handleClickFile = (fileId: string, name: string) => {
  const index = name.lastIndexOf('.')
  const suffix = index !== -1 ? name.substring(index + 1) : ''
  fileManage.value?.getContent(fileId, suffix)
}

/**
 * 点击节点事件
 * @param keys 选中的keys
 * @param options 选中的节点s
 */
const handleClick = (keys: string[], options: TreeOption[]) => {
  // 获取第一层元素信息
  const option = options[0]
  // 如果存在子级（说明是文件夹，处理点击文件事件）
  if (!option || option.children)
    return
  handleClickFile(keys[0], option.label!)
}

/**
 * 保存文件的事件
 */
const handleClickSave = () => {
  // 获取文件的内容
  const content = fileManage.value!.getCurrentContent()
  const fileId = fileManage.value!.getCurrentFileId()
  props.saveContentMethod(fileId, content)
}

/**
 * 初始化方法
 * @param array 原数据列表
 */
const init = (array: TreeOption[]) => {
  // 数据排序
  dataList.value = sortTreeOption(array)
  // 初始化文件管理对象
  fileManage.value = new FileManage(
    monacoEditorRef.value.getValue,
    monacoEditorRef.value.setValue,
    props.getContentMethod,
  )
  // 打开第一份文件
  const option = getFirstOption(dataList.value)
  const key = option.key as any as string
  defaultSelectedKeys.value.push(key)
  handleClickFile(key, option.label!)
}

/**
 * 监听数据结构的变化
 */
watch(() => props.treeDataList, (treeDataList) => {
  init(treeDataList)
})

onMounted(() => {
  init(props.treeDataList)
})
</script>

<template>
  <div class="editor-container">
    <div class="operation-panel">
      <NSpace align="center">
        <slot name="operation" />
        <NDivider vertical />
        <NButton strong secondary circle type="primary">
          <template #icon>
            <div class="icon-btn" i-carbon-save @click="handleClickSave" />
          </template>
        </NButton>
        <NButton strong secondary circle type="primary" disabled>
          <template #icon>
            <div icon-btn i-carbon-document-add />
          </template>
        </NButton>
        <NButton strong secondary circle type="primary" disabled>
          <template #icon>
            <div class="icon-btn" i-carbon-folder-add />
          </template>
        </NButton>
      </NSpace>
    </div>
    <div class="show-panel">
      <div class="left">
        <NTree
          style="width: 110%;"
          block-line
          :data="dataList"
          :default-selected-keys="defaultSelectedKeys"
          :render-switcher-icon="renderSwitcherIcon"
          selectable
          :expand-on-click="false"
          default-expand-all
          :render-prefix="renderPrefix"
          :render-label="renderLabel"
          draggable
          @update:selected-keys="handleClick"
        />
      </div>
      <div id="resize" class="middle" />
      <div class="right">
        <MonacoEditor ref="monacoEditorRef" />
      </div>
    </div>
    <!--  防止unocss不加载 -->
    <div hidden absolute>
      <span i-carbon-document />
      <span c-red c-blue font-bold i-carbon-folder />
    </div>
  </div>
</template>

<style scoped lang="less">
@import "file-manage.less";

.editor-container > .show-panel {
  grid-template-columns: v-bind(fileContainerWidthComputed) 10px 1fr;
}
</style>

