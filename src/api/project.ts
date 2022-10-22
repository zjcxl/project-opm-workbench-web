import { GetRequestModel } from '@dc-basic-component/request'
import type { QueryType } from '@dc-basic-component/config'
import type { ProjectVo } from '~/entity/project/project-vo'
import type { PageModel } from '~/base/page-model'

export default {

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  all: (query: QueryType) => new GetRequestModel<Array<ProjectVo>>('/api/opm/project/all', query).request(),

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  page: (query: QueryType) => new GetRequestModel<PageModel<ProjectVo>>('/api/opm/project/page', query).request(),

}
