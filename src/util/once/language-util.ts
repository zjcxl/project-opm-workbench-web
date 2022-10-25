import languageSuffixMap from './language-map.json'

/**
 * 根据后缀获取语言
 * @param suffix 后缀
 */
export const getLanguageBySuffix = (suffix: string): string => {
  return (languageSuffixMap as Record<string, string>)[suffix] || 'plaintext'
}

/**
 * 根据文件名获取语言
 * @param fileName 文件名
 */
export const getLanguageByFileName = (fileName: string): string => {
  return getLanguageBySuffix(fileName.split('.').pop() || 'txt')
}
