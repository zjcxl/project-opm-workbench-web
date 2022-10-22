import type { BaseVo } from '~/base/base-vo'

export interface ProjectDevelopMapVo extends BaseVo {
  // 项目id
  projectId: string
  // 开发版名称
  name: string
  // 是否是建议使用的版本 1=是 0=不是
  isSuggestUse: 0 | 1
  // 是否废弃 1=是 0=不是
  isDiscard: 0 | 1
  // 是否不可用 0=可用 1=不可用
  isDisabled: 0 | 1
  // 数据库类型
  databaseType: number
}
