import type { BaseCreateVo } from '~/base/base-vo'
import type { ProjectDevelopVo } from '~/entity/project/project-develop-vo'
import type { ProjectVo } from '~/entity/project/project-vo'
import type { TemplateVo } from '~/entity/project/template-vo'

export interface ProjectGenerateHistoryVo extends BaseCreateVo {
  // 名称
  name: string
  // 生成的方式 1=数据库表 2=建表sql
  type: 1 | 2
  // 文件数量
  fileCount: number
  // 项目开发id
  developId: string
  // 项目开发数据
  develop: ProjectDevelopVo
  // 文件包id
  fileId: string
  // 项目id
  projectId: string
  // 项目数据
  project: ProjectVo
  // 使用的模板id
  templateId: string
  // 模板数据
  template: TemplateVo
}
