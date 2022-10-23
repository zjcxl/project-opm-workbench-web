import { GetRequestModel, PostRequestModel } from '@dc-basic-component/request'
import type { QueryType } from '@dc-basic-component/config'
import type { ProjectVo } from '~/entity/project/project-vo'
import type { PageModel } from '~/base/page-model'
import type { FileRecordVo } from '~/entity/system/file-record-vo'

export default {

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  all: (query: QueryType) => new GetRequestModel<Array<ProjectVo>>('/opm/project/all', query).request(),

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  page: (query: QueryType) => new GetRequestModel<PageModel<ProjectVo>>('/opm/project/page', query).request(),

  /**
   * 生成模板信息
   * @param projectId 项目id
   * @param params 其他参数
   */
  generate: (
    projectId: string,
    params?: Partial<{
      sql: string
      templateId: string
      tableNameList: Array<string>
    }>,
  ) => new PostRequestModel<FileRecordVo>(`/opm/project/generate/${projectId}`, params).request(),

}
