<script setup lang="ts">
import { ref } from 'vue'
import { NANOID, useMessage } from '@dc-basic-component/util'
import { JSEncrypt } from 'jsencrypt'
import loginRequest from '~/api/login'
import { setToken } from '~/util/once/token-util'

const account = ref<string>('')
const password = ref<string>('')

// 是否显示密码
const showPassword = ref<boolean>(false)

const router = useRouter()

/**
 * 加密数据
 * @param content 要加密的内容
 * @param publicKey 公钥
 * @returns {string}
 */
const handleRsa = (content: string, publicKey: string): string => {
  const encrypt = new JSEncrypt({})
  encrypt.setPublicKey(publicKey)
  return encrypt.encrypt(content) || ''
}

/**
 * 点击登录后的操作
 */
const handleClickLogin = async () => {
  if (!account.value) {
    useMessage().error('请输入账号')
    return
  }
  if (!password.value) {
    useMessage().error('请输入密码')
    return
  }
  useMessage().warning('登录环境监测中...')
  const key = NANOID(16)
  // 加密密码
  const { data: rsaKey } = await loginRequest.rsa(key)
  const newPassword = handleRsa(password.value, rsaKey)
  // 登录请求
  loginRequest.login(account.value, newPassword, key).then(async (data) => {
    // 设置token信息
    setToken(data.data)
    // 显示消息
    useMessage().success('登录成功')
    // 跳转到项目页面
    await router.replace('/project')
  })
}
</script>

<template>
  <div class="login-container site">
    <div class="container">
      <div class="login">
        <div class="hero">
          <h1>Sign In to<br> Open the World</h1>
          <p>If you don't have an account, <br> you can contact <a href="#">zjphchenxueli@gmail.com</a></p>
        </div>
        <div class="main">
          <div class="form">
            <p>
              <input v-model="account" type="email" placeholder="Press Your Account" @keydown.enter="handleClickLogin">
            </p>
            <p class="password">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Press Your Password" @keydown.enter="handleClickLogin">
              <i v-if="!showPassword" class="i-ri-eye-off-line" @click="showPassword = true" />
              <i v-else class="i-ri-eye-line" @click="showPassword = false" />
              <!--              <a href="#">Recovery password</a> -->
            </p>
            <p>
              <input type="submit" class="submit" value="Sign In" @click="handleClickLogin">
            </p>
          </div>
          <div class="options">
            <div class="separator">
              <p>or continue with</p>
            </div>
            <ul>
              <li>
                <a href="#"><i i-ri-wechat-fill /></a>
              </li>
              <li>
                <a href="#"><i i-ri-qq-fill /></a>
              </li>
              <li>
                <a href="#"><i i-ri-dingding-fill /></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "../assets/login.less";
</style>
