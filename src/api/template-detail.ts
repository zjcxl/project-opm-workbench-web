import { GetRequestModel } from '@dc-basic-component/request'
import type { QueryType } from '@dc-basic-component/config'
import type { PageModel } from '~/base/page-model'
import type { TemplateDetailVo } from '~/entity/project/template-detail-vo'

export default {

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  all: (query: QueryType) => new GetRequestModel<Array<TemplateDetailVo>>('/api/opm/template/detail/all', query).request(),

  /**
   * 获取所有的信息
   * @param query 查询条件
   */
  page: (query: QueryType) => new GetRequestModel<PageModel<TemplateDetailVo>>('/api/opm/template/detail/page', query).request(),

  /**
   * 获取所有的信息
   * @param id 主键id
   */
  content: (id: string) => new GetRequestModel<string>(`/api/opm/template/detail/content/${id}`).request(),

}
