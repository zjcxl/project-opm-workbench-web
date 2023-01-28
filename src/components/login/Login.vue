<script setup lang="ts">
import { ref } from 'vue'
import { NANOID, copyText, useMessage } from '@dc-basic-component/util'
import loginRequest from '~/api/login'
import { setAutoToken, setToken } from '~/util/once/token-util'
import { handleRsa } from '~/util/once/rsa-util'

const account = ref<string>('')
const password = ref<string>('')

// 是否显示密码
const showPassword = ref<boolean>(false)

const router = useRouter()

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
  useMessage().warning('登录环境检测完中...')
  const key = NANOID(16)
  // 加密密码
  const { data: rsaKey } = await loginRequest.rsa(key)
  const newPassword = handleRsa(password.value, rsaKey)
  // 登录请求
  await loginRequest.login(account.value, newPassword, key).then(async (data) => {
    // 设置token信息
    setToken(data.data)
    // 显示消息
    useMessage().success('登录成功')
  })
  // 设置自动登录的信息
  const autoLoginKey = await loginRequest.getAutoLoginKey()
  // 将key存入缓存
  setAutoToken(autoLoginKey.data)
  // 跳转到项目页面
  await router.replace('/project')
}

/**
 * 点击邮箱事件
 * @param text 邮箱地址
 */
const handleClickEmail = (text: string) => {
  copyText(text)
  // 显示消息
  useMessage().success('邮箱已复制到剪切板')
}
</script>

<template>
  <div class="login-container site">
    <!--    <div style="position: absolute;top: 10px;right: 10px;"> -->
    <!--      <button class="icon-btn mx-2 !outline-none" @click="toggleDark()"> -->
    <!--        <div i="carbon-sun dark:carbon-moon" /> -->
    <!--      </button> -->
    <!--    </div> -->
    <div class="container">
      <div class="login">
        <div class="hero">
          <h1>Sign In to<br> Open the World</h1>
          <p>
            If you don't have an account, <br> you can contact <a
              href="#"
              @click="handleClickEmail('zjphchenxueli@gmail.com')"
            >zjphchenxueli@gmail.com</a>
          </p>
        </div>
        <div class="main">
          <div class="form">
            <p>
              <input v-model="account" type="email" placeholder="Press Your Account" @keydown.enter="handleClickLogin">
            </p>
            <p class="password">
              <input
                v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Press Your Password"
                @keydown.enter="handleClickLogin"
              >
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
@import "login.less";
</style>
