<script setup lang="ts">
import * as monaco from 'monaco-editor'

const props = defineProps<{
  content?: string
  containerId?: string
  language?: string
}>()

let monacoInstance: monaco.editor.IStandaloneCodeEditor | undefined

const containerId = computed<string>(() => props.containerId || 'container')

onMounted(() => {
  monacoInstance = monaco.editor.create(document.getElementById(containerId.value)!, {
    value: props.content || '',
    language: props.language || 'txt',
  })
})

/**
 * 获取编辑器内容
 */
const getValue = (): string => {
  return monacoInstance?.getValue() || ''
}

/**
 * 设置值
 * @param content 设置的内容
 * @param fileType 文件类型
 */
const setValue = (content: string, fileType = 'txt'): void => {
  monacoInstance!.setValue(content)
  monaco.editor.setModelLanguage(monacoInstance!.getModel()!, fileType)
}

// 暴露给父组件
defineExpose({ getValue, setValue })

onUnmounted(() => {
  if (monacoInstance)
    monacoInstance.dispose()
})
</script>

<template>
  <div :id="containerId" style="height: 100%;width: 100%" />
</template>
