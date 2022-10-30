<script>
export default {
  name: 'Login',
}
</script>

<template>
  <div class="login-container site">
    <div class="container">
      <div class="login">
        <div class="hero">
          <h1>Sign In to<br> Open the World</h1>
          <p>If you don't have an account, <br> you can <a href="#">Register here</a></p>
        </div>
        <div class="main">
          <form action="">
            <p>
              <input type="email" placeholder="Your email address">
            </p>
            <p class="password">
              <input type="password" placeholder="Password">
              <i class="i-ri-eye-off-line" />
              <a href="#">Recovery password</a>
            </p>
            <p>
              <input type="submit" class="submit" value="Sign In">
            </p>
          </form>
          <div class="options">
            <div class="separator">
              <p>or continue with</p>
            </div>
            <ul>
              <li>
                <a href="#"><i class="i-ri-facebook-fill" /></a>
              </li>
              <li>
                <a href="#"><i class="i-ri-twitter-fill" /></a>
              </li>
              <li>
                <a href="#"><i class="i-ri-google-fill" /></a>
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
