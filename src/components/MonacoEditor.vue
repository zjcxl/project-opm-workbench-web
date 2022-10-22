<script setup lang="ts">
import * as monaco from 'monaco-editor'

const props = defineProps<{ content?: string }>()

let monacoInstance: monaco.editor.IStandaloneCodeEditor | undefined

onMounted(() => {
  monacoInstance = monaco.editor.create(document.getElementById('container')!, {
    value: props.content || '',
    language: 'java',
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
 */
const setValue = (content: string): void => {
  if (monacoInstance)
    monacoInstance.setValue(content)
}

// 暴露给父组件
defineExpose({ getValue, setValue })

onUnmounted(() => {
  if (monacoInstance)
    monacoInstance.dispose()
})
</script>

<template>
  <div id="container" style="height: 100%;width: 100%" />
</template>
