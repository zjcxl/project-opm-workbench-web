import type { BaseMapVo } from '~/base/base-map-vo'

export interface ProjectMapVo extends BaseMapVo {
  // 项目名称
  name: string
  // 是否不可用 0=可用 1=不可用
  isDisabled: 0 | 1
  // 项目描述
  description: string
}
