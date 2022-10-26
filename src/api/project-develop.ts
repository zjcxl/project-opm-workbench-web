import { PostRequestModel } from '@dc-basic-component/request'
import type { QueryType } from '@dc-basic-component/config'
import type { PageModel } from '~/base/page-model'
import type { ProjectDevelopVo } from '~/entity/project/project-develop-vo'
import type { ProjectDevelopMapVo } from '~/entity/project/project-develop-map-vo'

export default {

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  all: (query: QueryType) => new PostRequestModel<Array<ProjectDevelopVo>>('/opm/project/develop/all', query).request(),

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  page: (query: QueryType) => new PostRequestModel<PageModel<ProjectDevelopVo>>('/opm/project/develop/page', query).request(),

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  map: (query: QueryType) => new PostRequestModel<Array<ProjectDevelopMapVo>>('/opm/project/develop/map', query).request(),

}
