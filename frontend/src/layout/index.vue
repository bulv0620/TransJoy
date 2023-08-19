<script setup>
import Sider from "@/components/Sider/index.vue";
import Content from "@/components/Content/index.vue";
import Header from "@/components/Header/index.vue";
import Footer from "@/components/Footer/index.vue";
</script>

<template>
  <n-layout class="h-screen">
    <n-layout-header bordered class="h-8" style="-webkit-app-region: drag">
      <Header></Header>
    </n-layout-header>
    <n-layout position="absolute" style="top: 32px; bottom: 32px" has-sider>
      <n-layout-sider bordered width="230px">
        <Sider></Sider>
      </n-layout-sider>
      <n-layout>
        <Content></Content>
      </n-layout>
    </n-layout>
    <n-layout-footer bordered position="absolute" class="h-8">
      <Footer></Footer>
    </n-layout-footer>
  </n-layout>
</template>

<style lang="less" scoped></style>
