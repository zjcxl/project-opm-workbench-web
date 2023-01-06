import {
  DeleteRequestModel,
  GetRequestModel,
  PostRequestCacheModel,
  PostRequestModel,
  PutRequestModel,
} from '@dc-basic-component/request'
import type { QueryType } from '@dc-basic-component/config'
import type { ProjectVo } from '~/entity/project/project-vo'
import type { PageModel } from '~/base/page-model'
import type { FileRecordVo } from '~/entity/system/file-record-vo'
import type { VariableModel } from '~/entity/project/variable-model'
import type { ProjectMapVo } from '~/entity/project/project-map-vo'
import type { TableSchemaVo } from '~/entity/project/table-schema-vo'
import type { ProjectDto } from '~/entity/project/project-dto'

export default {

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  all: (query: QueryType) => new PostRequestCacheModel<Array<ProjectVo>>('/opm/project/all', query).request(),

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  page: (query: QueryType) => new PostRequestModel<PageModel<ProjectVo>>('/opm/project/page', query).request(),

  /**
   * map获取所有的信息
   * @param query 查询条件
   */
  map: (query?: QueryType) => new PostRequestCacheModel<Array<ProjectMapVo>>('/opm/project/map', query).request(),

  /**
   * 根据id获取信息
   * @param id 主键id
   */
  getById: (id: string) => new GetRequestModel<ProjectVo>(`/opm/project/${id}`).request(),

  /**
   * 根据id删除信息
   * @param id 主键id
   */
  delete: (id: string) => new DeleteRequestModel<ProjectVo>(`/opm/project/${id}`).request(),

  /**
   * 新增
   * @param form 表单信息
   */
  add: (form: ProjectDto) => new PostRequestModel<ProjectVo>('/opm/project/', form).request(),

  /**
   * 修改
   * @param id 主键id
   * @param form 表单信息
   */
  update: (id: string, form: ProjectDto) => new PutRequestModel<ProjectVo>(`/opm/project/${id}`, form).request(),

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
      ignoreError: 0 | 1
    }>,
  ) => new PostRequestModel<FileRecordVo>(`/opm/project/generate/${projectId}`, params).request(),

  /**
   * 获取所有的keys
   * @param projectId 项目id
   * @param params 其他参数
   */
  listVariable: (
    projectId: string,
    params?: Partial<{
      sql: string
      templateId: string
    }>,
  ) => new PostRequestCacheModel<Array<VariableModel>>(`/opm/project/keys/${projectId}`, params).request(),

  /**
   * 获取所有的schema
   * @param projectId 项目id
   * @param templateId 模板id
   */
  schema: (projectId: string, templateId?: string) => new PostRequestCacheModel<Array<TableSchemaVo>>(`/opm/project/schema/${projectId}`, { templateId }).request(),

}
