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

// 接口前缀
const API_PREFIX = '/opm/project'

export default {

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  all: (query: QueryType) => new PostRequestCacheModel<Array<ProjectVo>>(`${API_PREFIX}/all`, query).request(),

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  page: (query: QueryType) => new PostRequestModel<PageModel<ProjectVo>>(`${API_PREFIX}/page`, query).request(),

  /**
   * map获取所有的信息
   * @param query 查询条件
   */
  map: (query?: QueryType) => new PostRequestCacheModel<Array<ProjectMapVo>>(`${API_PREFIX}/map`, query).request(),

  /**
   * 根据id获取信息
   * @param id 主键id
   */
  getById: (id: string) => new GetRequestModel<ProjectVo>(`${API_PREFIX}/${id}`).request(),

  /**
   * 根据id删除信息
   * @param id 主键id
   */
  delete: (id: string) => new DeleteRequestModel<ProjectVo>(`${API_PREFIX}/${id}`).request(),

  /**
   * 新增
   * @param form 表单信息
   */
  add: (form: ProjectDto) => new PostRequestModel<ProjectVo>(`${API_PREFIX}/`, form).request(),

  /**
   * 修改
   * @param id 主键id
   * @param form 表单信息
   */
  update: (id: string, form: ProjectDto) => new PutRequestModel<ProjectVo>(`${API_PREFIX}/${id}`, form).request(),

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
  ) => new PostRequestModel<FileRecordVo>(`${API_PREFIX}/generate/${projectId}`, params).request(),

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
  ) => new PostRequestCacheModel<Array<VariableModel>>(`${API_PREFIX}/keys/${projectId}`, params).request(),

  /**
   * 获取所有的schema
   * @param projectId 项目id
   * @param templateId 模板id
   */
  schema: (projectId: string, templateId?: string) => new PostRequestCacheModel<Array<TableSchemaVo>>(`${API_PREFIX}/schema/${projectId}`, { templateId }).request(),

}
