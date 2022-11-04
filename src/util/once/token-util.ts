export const token = useLocalStorage('token', '')

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
