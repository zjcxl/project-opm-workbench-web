import { GetRequestCacheModel } from '@dc-basic-component/request'

export default {

  /**
   * 根据流水id查询数据信息
   * @param historyId 流水id
   */
  listByHistoryId: (historyId: string) => new GetRequestCacheModel<Array<string>>(`opm/project/generate/history/detail/history/${historyId}`).request(),

}
