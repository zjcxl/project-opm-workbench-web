import { GetRequestModel, PostRequestCacheModel, PostRequestModel, PutRequestModel } from '@dc-basic-component/request'
import type { QueryType } from '@dc-basic-component/config'
import type { PageModel } from '~/base/page-model'
import type { ProjectDevelopVo } from '~/entity/project/project-develop-vo'
import type { ProjectDevelopMapVo } from '~/entity/project/project-develop-map-vo'
import type { ProjectDevelopDto } from '~/entity/project/project-develop-dto'

export default {

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  all: (query: QueryType) => new PostRequestCacheModel<Array<ProjectDevelopVo>>('/opm/project/develop/all', query).request(),

  /**
   * 分页查询数据
   * @param query 查询条件
   */
  page: (query: QueryType) => new PostRequestCacheModel<PageModel<ProjectDevelopVo>>('/opm/project/develop/page', query).request(),

  /**
   * map查询数据
   * @param query 查询条件
   */
  map: (query: QueryType) => new PostRequestCacheModel<Array<ProjectDevelopMapVo>>('/opm/project/develop/map', query).request(),

  /**
   * 根据id获取信息
   * @param id 主键id
   */
  getById: (id: string) => new GetRequestModel<ProjectDevelopVo>(`/opm/project/develop/${id}`).request(),

  /**
   * 新增
   * @param form 表单信息
   */
  add: (form: ProjectDevelopDto) => new PostRequestModel<ProjectDevelopVo>('/opm/project/develop/', form).request(),

  /**
   * 修改
   * @param id 主键id
   * @param form 表单信息
   */
  update: (id: string, form: ProjectDevelopDto) => new PutRequestModel<ProjectDevelopVo>(`/opm/project/develop/${id}`, form).request(),

}
