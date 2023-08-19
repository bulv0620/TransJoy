<script setup>
  import { darkTheme } from 'naive-ui'
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <router-view/>
  </n-config-provider>
</template>

<style lang="less"></style>
