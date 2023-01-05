import { GetRequestModel } from '@dc-basic-component/request'
import type { FileRecordVo } from '~/entity/system/file-record-vo'

export default {

  /**
   * 根据id获取信息
   * @param id 主键id
   */
  getById: (id: string) => new GetRequestModel<FileRecordVo>(`/file/record/${id}`).request(),

}
