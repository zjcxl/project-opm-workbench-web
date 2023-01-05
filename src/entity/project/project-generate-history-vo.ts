import type { BaseCreateVo } from '~/base/base-vo'

export interface ProjectGenerateHistoryVo extends BaseCreateVo {
  // 名称
  name: string
  // 生成的方式 1=数据库表 2=建表sql
  type: 1 | 2
  // 文件数量
  fileCount: number
  // 项目开发id
  developId: string
  // 文件包id
  fileId: string
  // 项目id
  projectId: string
  // 使用的模板id
  templateId: string
}
