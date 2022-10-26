import { PostRequestModel } from '@dc-basic-component/request'
import type { QueryType } from '@dc-basic-component/config'
import type { PageModel } from '~/base/page-model'
import type { TemplateVo } from '~/entity/project/template-vo'
import type { TemplateMapVo } from '~/entity/project/template-map-vo'

export default {

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  all: (query: QueryType) => new PostRequestModel<Array<TemplateVo>>('/opm/template/all', query).request(),

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  page: (query: QueryType) => new PostRequestModel<PageModel<TemplateVo>>('/opm/template/page', query).request(),

  /**
   * map
   * @param query 查询条件
   */
  map: (query: QueryType) => new PostRequestModel<Array<TemplateMapVo>>('/opm/template/map', query).request(),

}
