<script setup>
import { RemoveCircle, CloseCircle } from "@vicons/ionicons5";
import { ipcApiRoute } from "@/api/main";
import { ipc } from '@/utils/ipcRenderer';

async function handleHideWindow() {
  await ipc.invoke(ipcApiRoute.hideWindow);
}

async function handleCloseWindow() {
  await ipc.invoke(ipcApiRoute.closeWindow)
}

</script>

<template>
  <div class="my-header h-full px-4 pt-1 flex justify-between items-center bg-slate-800">
    <div>TransJoy</div>
    <div style="-webkit-app-region: no-drag">
      <n-space>
        <n-icon size="22" class="cursor-pointer" @click="handleHideWindow">
          <RemoveCircle />
        </n-icon>
        <n-icon size="22" class="cursor-pointer" @click="handleCloseWindow">
          <CloseCircle />
        </n-icon>
      </n-space>
    </div>
  </div>
</template>

<style>
.my-header {
  user-select: none;
}
</style>