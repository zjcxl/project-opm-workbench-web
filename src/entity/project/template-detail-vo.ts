import type { BaseVo } from '~/base/base-vo'

export interface TemplateDetailVo extends BaseVo {
  // 模板id
  templateId: string
  // 模板内容
  content: string
  // 标识名称，用于参数传递
  keyName: string
  // 文件格式后缀
  format: string
  // 生成的文件名称
  fileName: string
  // 包名
  packageName: string
  // 模块名称
  moduleName: string
  // 文件相对位置
  fileRelativePosition: string
  // 前缀（待加上的表名前缀）
  prefix: string
  // 后缀（待加上的表名后缀）
  suffix: string
  // 是否是最新的版本 1=是 0=不是
  isNew: 0 | 1
  // 顺序，默认数字越小约在前面
  sortOrder: number
}
