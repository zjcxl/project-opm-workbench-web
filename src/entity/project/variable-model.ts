export interface VariableModel {
  // 变量名称
  name: string
  // 来源
  origin: string
  // 类型
  type: 'value' | 'list'
  // 示例值
  value: string
  // 是否显示来源
  showOrigin: boolean
}
