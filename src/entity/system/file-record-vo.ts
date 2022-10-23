import type { BaseCreateVo } from '~/base/base-vo'

export interface FileRecordVo extends BaseCreateVo {
  // 文件名称
  name: string
  // 文件原名称
  oldName: string
  // 文件地址（相对路径）
  path: string
  // 文件位置
  position: string
  // 文件类型
  type: string
  // 文件大小（字节）
  size: number
  // 文件的md5值
  md5: string
}
