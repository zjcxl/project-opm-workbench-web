<script setup lang="ts">
import Avatar from './Avatar.vue'
import logo from '~/assets/logo.png'
</script>

<template>
  <div class="opm-header">
    <div class="logo">
      <img :src="logo">
    </div>
    <div />
    <Avatar class="opm-avatar" />
  </div>
</template>

<style scoped lang="less">
@import "./header.less";
</style>
