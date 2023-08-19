<script setup>
import { onMounted, ref } from "vue";
import mitt from "@/utils/mitt.js";

const activeDevice = ref(null);

onMounted(() => {
  mitt.on("updateActiveDevice", (e) => {
    activeDevice.value = e;
  });
});
</script>

<template>
  <div class="w-full h-full bg-slate-600">
    <div v-if="activeDevice" class="w-full h-full">
      <div class="bg-slate-800">
        <n-thing class="py-2 px-4">
          <template #avatar>
            <n-avatar round>{{ activeDevice.username }}</n-avatar>
          </template>
          <template #header>{{ activeDevice.username }}</template>
          <template #description>
            {{ `${activeDevice.ip}:${activeDevice.port}` }}
          </template>
        </n-thing>
      </div>
      <div class="h-content bg-gradient-to-b from-slate-800"></div>
      <div class="bg-slate-600 p-1 absolute w-full bottom-0">
        <n-input></n-input>
      </div>
    </div>
    <div v-else class="w-full h-full flex items-center justify-center">
      <n-empty description="Select a Device">
      </n-empty>
    </div>
  </div>
</template>
