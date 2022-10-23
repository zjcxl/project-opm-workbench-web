import type { TreeOption } from 'naive-ui'
import type { TemplateDetailVo } from '~/entity/project/template-detail-vo'

/**
 * 模板数据缓存对象
 */
const templateDetailStoreMap: Record<string, TemplateDetailVo> = {}

/**
 * 处理模板详情信息
 * @param array 模板详情数组
 */
export const handleTemplateDetailList = (array: TemplateDetailVo[]): TreeOption[] => {
  // 结果数组
  const result: TreeOption[] = []
  // 结果对象
  const resultMap: Record<string, TreeOption> = {}
  array.forEach((item) => {
    // 保存信息
    templateDetailStoreMap[item.id] = item
    const packageNameArray = item.packageName.split('.')
    packageNameArray.reduce((prev, current) => {
      const key = prev ? `${prev}.${current}` : current
      // 上一个节点
      const prevNode = resultMap[prev]
      if (!resultMap[key]) {
        const option: TreeOption = {
          key,
          label: current,
          children: [],
        }
        resultMap[key] = option
        if (!prevNode)
          result.push(option)
        else
          prevNode.children?.push(option)
      }
      return key
    }, '')
    // 获取最后一个，放入文件信息
    resultMap[item.packageName].children?.push({
      key: item.id,
      label: item.fileName,
    })
  })
  return result
}

/**
 * 根据详情id获取详情信息
 * @param detailId 详情id
 */
export const getTemplateDetailById = (detailId: string): TemplateDetailVo => {
  return templateDetailStoreMap[detailId]
}
