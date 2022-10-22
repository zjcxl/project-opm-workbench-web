<script setup lang="ts">
import { h, ref } from 'vue'
import type { TreeOption } from 'naive-ui'
import { NButton, NEmpty, NIcon, NTree } from 'naive-ui'
import { ChevronForward } from '@vicons/ionicons5'
import type { ResultModel } from '@dc-basic-component/config'
import data from '../file-manage.json'
import MonacoEditor from '../MonacoEditor.vue'
import { FileManage, getFirstOption, renderLabel, renderPrefix, sortTreeOption } from './method'

interface PropsState {
  /**
   * 获取文件内容的方法
   * @param fileId 文件id
   */
  getContentMethod: (fileId: string) => Promise<ResultModel<string>>
}

const props = defineProps<PropsState>()

// 默认选中的值（文件列表的第一项）
const defaultSelectedKeys = ref<string[]>([])
// 箭头样式
const renderSwitcherIcon = () => h(NIcon, null, { default: () => h(ChevronForward) })

// 编辑器对象
const monacoEditorRef = ref<InstanceType<typeof MonacoEditor>>()

// 文件管理对象
const fileManage = ref<FileManage | undefined>(undefined)

const dataList = ref<TreeOption[]>([])

/**
 * 选中文件的方法
 * @param fileId 文件id
 */
const handleClickFile = (fileId: string) => {
  fileManage.value?.getContent(fileId)
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
  handleClickFile(keys[0])
}

onMounted(() => {
  // 数据排序
  dataList.value = sortTreeOption(data)
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
  handleClickFile((key))
})
</script>

<template>
  <div class="editor-container">
    <div class="left">
      <NTree
        block-line
        :data="dataList"
        :default-selected-keys="defaultSelectedKeys"
        :render-switcher-icon="renderSwitcherIcon"
        selectable
        expand-on-click
        default-expand-all
        :render-prefix="renderPrefix"
        :render-label="renderLabel"
        @update:selected-keys="handleClick"
      />
    </div>
    <div class="right">
      <MonacoEditor ref="monacoEditorRef" />
    </div>
  </div>
</template>

<style scoped lang="less">
@import "file-manage.less";
</style>
