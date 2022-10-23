import { GetRequestModel, PostRequestModel, PutRequestModel } from '@dc-basic-component/request'
import type { QueryType } from '@dc-basic-component/config'
import type { PageModel } from '~/base/page-model'
import type { TemplateDetailVo } from '~/entity/project/template-detail-vo'
import type { TemplateDetailDto } from '~/entity/project/template-detail-dto'

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

  /**
   * 新增模板内容
   * @param data 新增的数据
   */
  add: (data: TemplateDetailDto) => new PostRequestModel<TemplateDetailVo>('/api/opm/template/detail', data).request(),

  /**
   * 修改模板内容
   * @param id 主键id
   * @param data 修改的数据
   */
  update: (id: string, data: TemplateDetailDto) => new PutRequestModel<TemplateDetailVo>(`/api/opm/template/detail/${id}`, data).request(),

}
