<script setup>
import { SettingsSharp, ReloadSharp } from "@vicons/ionicons5";
import { computed, onMounted, ref } from "vue";
import mitt from "@/utils/mitt.js";
import { ipcApiRoute } from "@/api/main";
import { ipc } from "@/utils/ipcRenderer";

// user
const userState = ref({ username: "", ip: "" });

onMounted(() => {
  getUserInfo();
});

async function getUserInfo() {
  const data = await ipc.invoke(ipcApiRoute.getUserInfo);
  userState.value = data;
}

// devices
const devices = ref([]);

const activeDevice = computed(() => {
  return devices.value.find((el) => el.active) || null;
});

onMounted(async () => {
  ipc.removeAllListeners(ipcApiRoute.getDevices);
  ipc.on(ipcApiRoute.getDevices, (_, result) => {
    devices.value = result
  });

  await publish();
  await getDevices();
});

async function publish() {
  await ipc.invoke(ipcApiRoute.publish);
}

async function getDevices() {
  await ipc.send(ipcApiRoute.getDevices);
}

function handleDeviceClick(index) {
  if (devices.value[index].active) {
    devices.value[index].active = false;
  } else {
    devices.value.forEach((el) => (el.active = false));
    devices.value[index].active = true;
  }

  mitt.emit("updateActiveDevice", activeDevice.value);
}
</script>

<template>
  <div class="my-sider h-full">
    <div class="p-4 bg-slate-800">
      <n-thing>
        <template #avatar>
          <n-avatar round>{{ userState.username }}</n-avatar>
        </template>
        <template #header>{{ userState.username }}</template>
        <template #description>
          {{ `PORT: ${userState.port}` }}
        </template>
        <template #action>
          <n-space>
            <n-button size="small">
              <template #icon>
                <n-icon>
                  <settings-sharp />
                </n-icon>
              </template>
              Setting
            </n-button>
            <n-button size="small" @click="publish">
              <template #icon>
                <n-icon>
                  <reload-sharp />
                </n-icon>
              </template>
              Refresh
            </n-button>
          </n-space>
        </template>
      </n-thing>
    </div>
    <div class="h-list bg-slate-800">
      <n-scrollbar style="max-height: 100%" v-if="devices.length > 0">
        <n-list clickable class="bg-slate-700">
          <n-list-item
            v-for="(device, index) in devices"
            :key="device.username"
            @click="handleDeviceClick(index)"
            :class="{
              'bg-cyan-700': device.active,
            }"
          >
            <n-thing class="pl-4">
              <template #avatar>
                <n-avatar round>{{ device.username }}</n-avatar>
              </template>
              <template #header>{{ device.username }}</template>
              <template #description>
                {{ `${device.ip}:${device.port}` }}
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
      </n-scrollbar>
      <div v-else class="h-full w-full flex items-center justify-center">
        <n-empty description="No Device"></n-empty>
      </div>
    </div>
  </div>
</template>

<style>
.my-sider {
  user-select: none;
}
</style>
