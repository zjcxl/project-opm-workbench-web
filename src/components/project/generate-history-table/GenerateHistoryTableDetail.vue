<script setup lang="ts">
import { defineProps, h, ref } from 'vue'
import type { TreeOption } from 'naive-ui'
import { NIcon } from 'naive-ui'
import { ChevronForward } from '@vicons/ionicons5'
import projectGenerateHistoryDetailRequest from '~/api/project-generate-history-detail'
import { renderLabel, renderPrefix } from '~/components/file-manage/method'

const props = defineProps<{
  historyId: string
}>()

// 箭头样式
const renderSwitcherIcon = () => h(NIcon, null, { default: () => h(ChevronForward) })

// 原始数据列表
const list = ref<Array<string>>([])
// 树型数据
const tree = ref<Array<TreeOption>>([])
// 显示控制
const visibleTree = ref<boolean>(false)

/**
 * 解析数据为树型的结构
 * @param list
 */
const resolveList = (list: Array<string>): Array<TreeOption> => {
  const result: TreeOption[] = []
  const resultMap: Record<string, TreeOption> = {}
  list.forEach((path) => {
    if (path.startsWith('/'))
      path = path.substring(1)
    // 执行分解
    const pathList = path.split('/')
    // 获取包名，获取文件名
    const packageNameArray = pathList.slice(0, pathList.length - 1)
    const fileName = pathList[pathList.length - 1]
    // 遍历路径
    packageNameArray.reduce((prev, current) => {
      const key = prev ? `${prev}.${current}` : current
      // 上一个节点
      const prevNode = resultMap[prev]
      if (!resultMap[key]) {
        const option: TreeOption = {
          key,
          label: current,
          children: [],
        }
        resultMap[key] = option
        if (!prevNode)
          result.push(option)
        else
          prevNode.children?.push(option)
      }
      return key
    }, '')
    // 获取最后一个，放入文件信息
    resultMap[packageNameArray.join('.')].children?.push({
      key: path,
      label: fileName,
    })
  })
  return result
}

onMounted(() => {
  projectGenerateHistoryDetailRequest.listByHistoryId(props.historyId).then((data) => {
    list.value = data.data
    tree.value = resolveList(data.data)
    visibleTree.value = true
  })
})
</script>

<template>
  <div v-if="visibleTree" max-h-2xl overflow-y-auto>
    <NTree
      style="width: 100%;"
      block-line
      :data="tree"
      :render-switcher-icon="renderSwitcherIcon"
      selectable
      :expand-on-click="false"
      default-expand-all
      :render-prefix="renderPrefix"
      :render-label="renderLabel"
      draggable
    />
  </div>
  <div v-else flex items-center justify-center>
    <n-spin size="large">
      <template #description>
        明细数据正在火速加载中...
      </template>
    </n-spin>
  </div>
  <!--  防止unocss不加载 -->
  <div hidden absolute>
    <span i-carbon-document />
    <span c-red c-blue font-bold i-carbon-folder />
  </div>
</template>

<style scoped>

</style>
