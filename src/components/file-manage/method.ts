import type { TreeOption } from 'naive-ui'
import { h } from 'vue'
import type { ResultModel } from '@dc-basic-component/config'

// 修改过的文件列表
const updatedSet = ref<Set<string>>(new Set<string>())

/**
 * 设置前缀信息
 * @param option 选项
 */
export const renderPrefix = ({ option }: { option: TreeOption }) => {
  if (option.children)
    return h('div', { class: 'i-carbon-folder c-red' })
  return h('div', { class: 'i-carbon-document' })
}

/**
 * 设置文本信息
 * @param option 选项
 */
export const renderLabel = ({ option }: { option: TreeOption }) => {
  if (option.children) {
    return h('span', {
      class: 'c-red',
      onContextmenu: (e: PointerEvent) => {
        e.preventDefault()
        // eslint-disable-next-line no-console
        console.log(e)
      },
    }, option.label)
  }
  return h('span', { style: updatedSet.value.has(option.key as any as string) ? 'color: blue;font-weight: bold;' : '' }, option.label)
}

/**
 * 排序
 * @param array 数组
 */
export const sortTreeOption = (array: TreeOption[]): TreeOption[] => {
  array.sort((a, b) => {
    if (!a.label)
      return -1
    if (!b.label)
      return 1
    // 如果不是同一个属性
    if (!a.children !== !b.children)
      return !a.children ? 1 : -1
    // ascii比较
    return a.label.localeCompare(b.label)
  })
  // 循环下一层
  array.forEach((item) => {
    if (item.children)
      item.children = sortTreeOption(item.children)
  })
  return array
}

/**
 * 获取第一份信息
 * @param array 数组
 */
export const getFirstOption = (array: TreeOption[]): TreeOption => {
  if (array.length > 0) {
    const item = array[0]
    if (!item)
      throw new Error('item is null')
    if (item.children)
      return getFirstOption(item.children)
    return item
  }
  throw new Error('item is null')
}

/**
 * 文件管理对象
 */
export class FileManage {
  // 编辑器对象
  protected _getEditorValue: () => string
  protected _setEditorValue: (value: string) => void
  // 文件缓存
  protected _fileStore: Record<string, string> = {}
  // 文件缓存（旧）
  protected _fileOldStore: Record<string, string> = {}
  // 上一次打开的文件
  protected _lastFileId = ''
  // 获取的方法
  protected _getContentMethod: (fileId: string) => Promise<ResultModel<string>>

  constructor(getEditorValue: () => string, setEditorValue: (value: string) => void, getContentMethod: (fileId: string) => Promise<ResultModel<string>>) {
    this._getEditorValue = getEditorValue
    this._setEditorValue = setEditorValue
    this._getContentMethod = getContentMethod
  }

  /**
   * 获取当前打开的文件内容
   */
  getCurrentContent(): string {
    return this._getEditorValue()
  }

  /**
   * 获取当前打开的文件id
   */
  getCurrentFileId(): string {
    return this._lastFileId
  }

  /**
   * 获取文件内容
   * @param fileId 文件id
   */
  getContent(fileId: string) {
    // 如果有已打开的信息（需要保存）
    if (this._lastFileId) {
      this._fileStore[this._lastFileId] = this._getEditorValue()
      // 判断文件是否被修改过
      if (this.isUpdated(this._lastFileId))
        updatedSet.value.add(this._lastFileId)
      else
        updatedSet.value.delete(this._lastFileId)
    }
    // 文件id保存
    this._lastFileId = fileId
    // 判断有没有缓存信息
    if (this._fileStore[fileId]) {
      this._setEditorValue(this._fileStore[fileId])
    }
    else {
      this._getContentMethod(fileId).then((res) => {
        this._fileStore[fileId] = res.data
        this._fileOldStore[fileId] = res.data
        this._setEditorValue(res.data)
      })
    }
  }

  /**
   * 清除缓存
   */
  clearStore() {
    this._fileStore = {}
    this._lastFileId = ''
  }

  /**
   * 是否有打开文件
   */
  isOpenFile(): boolean {
    return !!this._lastFileId
  }

  /**
   * 文件是否修改过了
   * @param fileId 文件id
   */
  isUpdated(fileId: string): boolean {
    return this._fileStore[fileId] !== this._fileOldStore[fileId]
  }
}
