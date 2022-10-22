import type { BaseVo } from '~/base/base-vo'

export interface TemplateVo extends BaseVo {
  // 模板编码
  code: string
  // 项目开发id
  developId: string
  // 模板名称
  name: string
  // 版本构建号
  tag: number
  // 忽略的字段信息
  ignoreFields: string
}
