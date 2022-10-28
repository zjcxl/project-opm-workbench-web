export const token = useLocalStorage('token', '')

/**
 * 获取token信息
 */
export const getToken = () => token.value
