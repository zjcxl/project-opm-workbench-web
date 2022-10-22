import type { BaseVo } from '~/base/base-vo'

export interface ProjectUserVo extends BaseVo {
  // 用户id
  userId: number
  // 项目id
  projectId: number
  // 权限信息 1=create 2=master 3=developer 4=guest
  permission: 1 | 2 | 3 | 4
}
