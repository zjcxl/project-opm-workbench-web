<script setup lang="ts">
import { copyText, useMessage } from '@dc-basic-component/util'
import { ref } from 'vue'
import type { VariableModel } from '~/entity/project/variable-model'

interface PropsState {
  /**
   * 获取所有的keys的方法
   */
  listVariable?: () => Promise<Array<VariableModel>>
}

const props = defineProps<PropsState>()

// 可用变量的列表
const variableList = ref<Array<VariableModel>>([])
// 变量加载提示
const variableLoading = ref<boolean>(false)

const colorRecord: Record<string, 'default' | 'error' | 'primary' | 'info' | 'success' | 'warning'> = {
  value: 'success',
  list: 'warning',
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
 * 点击处理复制事件
 * @param item 复制的内容
 */
const handleCopyItem = (item: VariableModel) => {
  // 如果是value，直接复制变量
  switch (item.type) {
    case 'value':
      copyText(`\${${item.name}}`)
      break
    case 'list':
      copyText(`<#list ${item.name} as item>
  \${item}
</#list>`)
      break
  }
  useMessage().success(`${item.name} 已复制到剪切板`)
}

onMounted(() => {
  resolveVariable()
})
</script>

<template>
  <div class="copy-list-manage-container">
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
        transition
        @click="handleCopyItem(item)"
      >
        <NTag
          v-if="item.type"
          :type="colorRecord[item.type] || 'info'"
          size="small"
          :bordered="false"
          strong
          round
          w-50px
          flex
          justify-center
          items-center
        >
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
</template>

<style scoped lang="less">
@import "./copy-list-manage.less";
</style>
