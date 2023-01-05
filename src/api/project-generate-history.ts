import { PostRequestCacheModel } from '@dc-basic-component/request'
import type { QueryType } from '@dc-basic-component/config'
import type { PageModel } from '~/base/page-model'
import type { ProjectGenerateHistoryVo } from '~/entity/project/project-generate-history-vo'

export default {

  /**
   * 分页查询数据
   * @param query 查询条件
   */
  page: (query: QueryType) => new PostRequestCacheModel<PageModel<ProjectGenerateHistoryVo>>('opm/project/generate/history/page', query).request(),

}
