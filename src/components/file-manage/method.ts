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
export const getFirstOption = (array: TreeOption[]): TreeOption | undefined => {
  if (array.length > 0) {
    const item = array[0]
    if (!item)
      return undefined
    if (item.children)
      return getFirstOption(item.children)
    return item
  }
  return undefined
}

/**
 * 文件管理对象
 */
export class FileManage {
  // 编辑器对象
  protected _getEditorValue: () => string
  protected _setEditorValue: (content: string, language?: string) => void
  // 文件缓存
  protected _fileStore: Record<string, string> = {}
  // 文件缓存（旧）
  protected _fileOldStore: Record<string, string> = {}
  // 上一次打开的文件
  protected _lastFileId = ''
  // 获取的方法
  protected _getContentMethod: (fileId: string) => Promise<ResultModel<string>>
  // 文件id映射表（旧指向新）
  protected _fileIdMap: Record<string, string> = {}
  // 文件id映射表（新指向旧）
  protected _fileIdMapSub: Record<string, string> = {}

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
    // 获取到的最新的那份数据
    return this._fileIdMap[this._lastFileId] || this._lastFileId
  }

  /**
   * 获取文件内容
   * @param fileId 文件id
   * @param language 文件语言
   */
  getContent(fileId: string, language?: string) {
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
      this._setEditorValue(this._fileStore[fileId], language)
    }
    else {
      this._getContentMethod(fileId).then((res) => {
        this._fileStore[fileId] = res.data
        this._fileOldStore[fileId] = res.data
        this._setEditorValue(res.data, language)
      })
    }
  }

  /**
   * 刷新
   * @param language
   */
  refreshLanguage(language: string) {
    this.getContent(this._lastFileId, language)
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

  /**
   * 更新缓存信息
   * @param newFileId 新的文件id
   * @param oldFileId 旧文件id
   * @param content 文件内容
   */
  updateCache(newFileId: string, oldFileId: string, content: string) {
    if (oldFileId === newFileId)
      return
    // 设置映射关系，如果已经有新指向旧的数据，需要删除
    oldFileId = this._fileIdMapSub[oldFileId] || oldFileId
    if (oldFileId)
      delete this._fileIdMapSub[oldFileId]
    // 更新旧缓存
    this._fileOldStore[oldFileId] = content
    // 将获取到的零时值设置为旧值
    this._fileIdMap[oldFileId] = newFileId
    this._fileIdMapSub[newFileId] = oldFileId
  }
}
