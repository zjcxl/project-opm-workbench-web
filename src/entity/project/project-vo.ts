import type { ProjectUserVo } from '~/entity/project/project-user-vo'
import type { BaseVo } from '~/base/base-vo'

export interface ProjectVo extends BaseVo {
  // 项目名称
  name: string
  // 是否不可用 0=可用 1=不可用
  isDisabled: 0 | 1
  // 项目描述
  description: string
  // 查看的用户信息
  projectUserVo: ProjectUserVo
  // 项目成员列表
  members: Array<ProjectUserVo>
}
