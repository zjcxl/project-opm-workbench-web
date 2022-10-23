<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { NANOID } from '@dc-basic-component/util'

interface PropsState {
  /**
   * 文本内容
   */
  content?: string
  /**
   * 文本语言
   */
  language?: string
}

const props = withDefaults(defineProps<PropsState>(), {
  content: '',
  language: 'text',
})

/**
 * 编辑器对象
 */
let monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined

/**
 * 默认的容器id
 */
const containerId = `monaco-${NANOID(6)}${new Date().getTime()}`

/**
 * 获取编辑器内容
 */
const getValue = (): string => {
  return monacoEditor!.getValue() || ''
}

/**
 * 设置值
 * @param content 设置的内容
 * @param fileType 文件类型
 */
const setValue = (content: string, fileType = 'text'): void => {
  monacoEditor!.setValue(content)
  monaco.editor.setModelLanguage(monacoEditor!.getModel()!, fileType)
}

/**
 * 暴露给父组件
 */
defineExpose({ getValue, setValue })

onMounted(() => {
  // 初始化编辑器
  monacoEditor = monaco.editor.create(document.getElementById(containerId)!, {
    value: props.content,
    language: props.language,
  })
})

onUnmounted(() => {
  // 销毁编辑器（卸载之后要销毁编辑器）
  monacoEditor!.dispose()
})
</script>

<template>
  <div v-once :id="containerId" style="height: 100%;width: 100%" />
</template>
