export const token = useLocalStorage('token', '')
export const autoToken = useLocalStorage('auto_token', '')

/**
 * 获取token信息
 */
export const getToken = () => token.value

/**
 * 设置token信息
 * @param tokenValue token信息
 */
export const setToken = (tokenValue: string) => {
  token.value = tokenValue
}

/**
 * 移除token信息
 */
export const clearToken = () => {
  token.value = ''
}

/**
 * 获取token信息
 */
export const getAutoToken = () => autoToken.value

/**
 * 设置token信息
 * @param tokenValue token信息
 */
export const setAutoToken = (tokenValue: string) => {
  autoToken.value = tokenValue
}

/**
 * 移除token信息
 */
export const clearAutoToken = () => {
  autoToken.value = ''
}
