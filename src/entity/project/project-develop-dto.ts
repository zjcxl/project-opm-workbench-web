import type { BaseDto } from '~/base/base-dto'

export interface ProjectDevelopDto extends BaseDto {
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
  // 开发版描述
  description: string
  // 数据库用户名
  databaseUsername: string
  // 数据库密码
  databasePassword: string
  // 数据库名称
  databaseName: string
  // 数据库类型
  databaseType: number
  // 数据库host
  databaseHost: string
  // 数据库端口
  databasePort: string
  // 依赖的模块名称列表
  moduleNames: string
}
