<script setup>
import { darkTheme } from "naive-ui";
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="less"></style>
