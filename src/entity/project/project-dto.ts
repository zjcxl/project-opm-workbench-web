import type { BaseDto } from '~/base/base-dto'

export interface ProjectDto extends BaseDto {
  // 来源项目id
  sourceProjectId?: string
  // 项目名称
  name: string
  // 是否不可用 0=可用 1=不可用
  isDisabled: 0 | 1
  // 项目描述
  description: string
}
