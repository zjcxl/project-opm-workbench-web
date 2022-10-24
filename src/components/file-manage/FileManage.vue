<script setup lang="ts">
import { h, ref } from 'vue'
import type { TreeOption } from 'naive-ui'
import { NButton, NDivider, NIcon, NSpace, NSpin, NTag, NTree } from 'naive-ui'
import { ChevronForward } from '@vicons/ionicons5'
import type { ResultModel } from '@dc-basic-component/config'
import { copyText, useMessage } from '@dc-basic-component/util'
import MonacoEditor from '../editor/MonacoEditor.vue'
import { FileManage, getFirstOption, renderLabel, renderPrefix, sortTreeOption } from './method'
import type { VariableModel } from '~/entity/project/variable-model'

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
// 可用变量的列表
const variableList = ref<Array<VariableModel>>([])
// 变量加载提示
const variableLoading = ref<boolean>(false)
// 显示的面板
const showPanel = ref<'file' | 'item'>('file')

const colorRecord = {
  value: 'success',
  list: 'warning',
}

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
 * 点击处理复制事件
 * @param item 复制的内容
 */
const handleCopyItem = (item: VariableModel) => {
  // 如果是value，直接复制变量
  switch (item.type) {
    case 'value':
      copyText(item.value)
      break
    case 'list':
      copyText(`<#list ${item.name} as item>
      </#list>`)
      break
  }
  useMessage().success(`${item.name} 复制成功`)
}

/**
 * 解析变量信息
 */
const resolveVariable = () => {
  if (!props.listVariable)
    return
  variableLoading.value = true
  const variableNameSet = new Set()
  props.listVariable().then((array) => {
    array.forEach((item) => {
      variableNameSet.add(item.name)
    })
    variableList.value = array.map((item) => {
      return {
        ...item,
        showOrigin: variableNameSet.has(item.origin),
      }
    })
    variableLoading.value = false
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
    monacoEditorRef.value.getValue,
    monacoEditorRef.value.setValue,
    props.getContentMethod,
  )
  // 打开第一份文件
  const option = getFirstOption(dataList.value)
  const key = option.key as any as string
  defaultSelectedKeys.value.push(key)
  handleClickFile(key, option.label!)
  // 变量数据
  resolveVariable()
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
        <!-- 外部操作功能的插槽 -->
        <slot name="operation" />
        <NDivider vertical />
        <!-- 外部操作功能 -->
        <NButton strong secondary circle type="primary">
          <template #icon>
            <div i-carbon-save @click="handleClickSave" />
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
      </NSpace>
    </div>
    <div class="show-panel">
      <div class="pre-left">
        <NSpace vertical>
          <NButton strong :secondary="showPanel !== 'file'" circle type="primary" @click="showPanel = 'file'">
            <template #icon>
              <div i-carbon-document />
            </template>
          </NButton>
          <NButton strong :secondary="showPanel !== 'item'" circle type="primary" @click="showPanel = 'item'" @dblclick="resolveVariable">
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
          <template v-if="variableLoading">
            <NSpin size="large" />
          </template>
          <template v-else>
            <div
              v-for="(item, index) in variableList"
              :key="index"
              cursor-pointer
              flex
              justify-start
              items-center
              gap-2
              hover:c-green
              @click="handleCopyItem(item)"
            >
              <NTag v-if="item.type" :type="colorRecord[item.type] || 'success'" size="small" :bordered="false" strong round w-50px flex justify-center items-center>
                {{ item.type }}
              </NTag>
              <div grid>
                <template v-if="item.showOrigin">
                  （{{ item.origin }}）
                </template>
                {{ item.name }}
                <span c-gray-300>
                  eg: {{ item.value || item.name }}
                </span>
              </div>
            </div>
          </template>
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

