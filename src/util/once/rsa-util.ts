import { JSEncrypt } from 'jsencrypt'

/**
 * 加密数据
 * @param content 要加密的内容
 * @param publicKey 公钥
 * @returns {string}
 */
export const handleRsa = (content: string, publicKey: string): string => {
  const encrypt = new JSEncrypt({})
  encrypt.setPublicKey(publicKey)
  return encrypt.encrypt(content) || ''
}
