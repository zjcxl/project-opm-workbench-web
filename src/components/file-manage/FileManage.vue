<script setup lang="ts">
import { computed, h, nextTick, ref } from 'vue'
import type { TreeOption } from 'naive-ui'
import { ChevronForward } from '@vicons/ionicons5'
import type { ResultModel } from '@dc-basic-component/config'
import { NIcon } from 'naive-ui'
import MonacoEditor from '../editor/MonacoEditor.vue'
import { FileManage, getFirstOption, renderLabel, renderPrefix, sortTreeOption } from './method'
import CopyListManage from './CopyListManage.vue'
import type { VariableModel } from '~/entity/project/variable-model'
import { getLanguageByFileName } from '~/util/once/language-util'
import { useLanguageType } from '~/util/once/template-detail-util'

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
  saveContentMethod: (fileId: string, content: string) => Promise<string>
  /**
   * 获取所有的keys的方法
   */
  listVariable?: () => Promise<Array<VariableModel>>
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
// 变量加载提示
const visibleTree = ref<boolean>(false)
// 显示的面板
const showPanel = useLocalStorage<'file' | 'item'>('file_manage_show_panel', 'file')
// 正在编辑的文件名称
const editorFileName = ref<string>('')

// 是否可以操作
const canOperate = computed<boolean>(() => dataList.value && dataList.value.length > 0)

/**
 * 获取代码语言
 * @param fileName 文件名
 */
const getLanguage = (fileName: string) => {
  return useLanguageType.value ? getLanguageByFileName(fileName) : 'freemarker2.tag-angle.interpolation-dollar'
}

/**
 * 选中文件的方法
 * @param fileId 文件id
 * @param option 项目信息
 */
const handleClickFile = (fileId: string, option: TreeOption) => {
  editorFileName.value = option.label!
  fileManage.value?.getContent(fileId, getLanguage(option.label!))
}

/**
 * 点击节点事件
 * @param keys 选中的keys
 * @param options 选中的节点s
 */
const handleClick = (keys: string[], options: Array<TreeOption | null>) => {
  // 获取第一层元素信息
  const option = options[0]
  // 如果存在子级（说明是文件夹，处理点击文件事件）
  if (!option || option.children)
    return
  handleClickFile(keys[0], option)
}

/**
 * 保存文件的事件
 */
const handleClickSave = () => {
  // 获取文件的内容
  const content = fileManage.value!.getCurrentContent()
  const fileId = fileManage.value!.getCurrentFileId()
  // 保存文件事件
  props.saveContentMethod(fileId, content).then((newFileId) => {
    if (fileId === newFileId)
      return
    // 更新缓存
    fileManage.value!.updateCache(newFileId, fileId, content)
    // 更新选中的信息
    visibleTree.value = false
    nextTick(() => {
      visibleTree.value = true
    })
  })
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
    monacoEditorRef.value?.getValue || (() => ''),
    monacoEditorRef.value?.setValue || (() => {}),
    props.getContentMethod,
  )
  // 打开第一份文件
  const option = getFirstOption(dataList.value)
  if (!option) {
    showPanel.value = 'file'
    monacoEditorRef.value?.setValue('')
    return
  }
  const key = option.key as any as string
  defaultSelectedKeys.value.push(key)
  handleClickFile(key, option)
}

/**
 * 监听模板的信息变化
 */
watch(() => useLanguageType.value, () => {
  fileManage.value?.refreshLanguage(getLanguage(editorFileName.value))
})

/**
 * 监听数据结构的变化
 */
watch(() => props.treeDataList, (treeDataList) => {
  init(treeDataList)
})

onMounted(() => {
  visibleTree.value = true
  init(props.treeDataList)
})
</script>

<template>
  <div class="editor-container">
    <div class="operation-panel">
      <NSpace align="center">
        <span>
          {{ editorFileName }}
        </span>
        <!-- 外部操作功能的插槽 -->
        <slot name="operation-start" />
        <!-- 外部操作功能的插槽 -->
        <slot name="operation" />
        <NDivider vertical />
        <!-- 外部操作功能 -->
        <NButton strong secondary circle type="primary" :disabled="!canOperate" @click="handleClickSave">
          <template #icon>
            <div i-carbon-save />
          </template>
        </NButton>
        <NButton strong secondary circle type="primary" disabled>
          <template #icon>
            <div i-carbon-document-add />
          </template>
        </NButton>
        <NButton strong secondary circle type="primary" disabled>
          <template #icon>
            <div i-carbon-folder-add />
          </template>
        </NButton>
        <!-- 外部操作功能的插槽 -->
        <slot name="operation-end" />
      </NSpace>
    </div>
    <div class="show-panel">
      <div class="pre-left">
        <NSpace vertical>
          <NButton
            strong :secondary="showPanel !== 'file'" :disabled="!canOperate" circle type="primary"
            @click="showPanel = 'file'"
          >
            <template #icon>
              <div i-carbon-document />
            </template>
          </NButton>
          <NButton
            strong
            :secondary="showPanel !== 'item'"
            :disabled="!canOperate"
            circle
            type="primary"
            @click="showPanel = 'item'"
          >
            <template #icon>
              <div i-carbon-copy />
            </template>
          </NButton>
          <NButton strong secondary circle type="primary" disabled>
            <template #icon>
              <div i-carbon-folder-add />
            </template>
          </NButton>
        </NSpace>
      </div>
      <div class="left">
        <NTree
          v-if="visibleTree"
          v-show="showPanel === 'file'"
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
        <div v-show="showPanel === 'item'" grid="~ gap-1" px-2 py-3>
          <CopyListManage :list-variable="props.listVariable" />
        </div>
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
  grid-template-columns: 40px v-bind(fileContainerWidthComputed) 10px 1fr;
}
</style>
