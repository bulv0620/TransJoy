<script setup>
import { SettingsSharp, ReloadSharp } from "@vicons/ionicons5";
import { computed, onMounted, ref, watch } from "vue";
import mitt from "@/utils/mitt.js";
import { ipcApiRoute } from "@/api/main";
import { ipc } from "@/utils/ipcRenderer";
import UserConfig from "../UserConfig/index.vue";

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

watch(activeDevice, () => {
  mitt.emit("updateActiveDevice", {
    device: { ...activeDevice.value },
    user: { ...userState.value },
  });
});

onMounted(async () => {
  ipc.removeAllListeners(ipcApiRoute.subscribeDeviceServe);
  ipc.on(ipcApiRoute.subscribeDeviceServe, (_, result) => {
    devices.value = result.map((el) => ({
      ...el,
      active: activeDevice.value?.id === el.id,
      count: 0,
    }));
  });

  await publish();
  await subscribeDeviceServe();
});

async function publish() {
  await ipc.invoke(ipcApiRoute.publish);
}

async function subscribeDeviceServe() {
  await ipc.send(ipcApiRoute.subscribeDeviceServe);
}

function handleDeviceClick(index) {
  devices.value[index].count = 0;
  if (devices.value[index].active) {
    devices.value[index].active = false;
  } else {
    devices.value.forEach((el) => (el.active = false));
    devices.value[index].active = true;
  }
}

// userconfig
const userConfigRef = ref(null);

function openUserConfig() {
  userConfigRef.value.openUserConfig(userState.value);
}

async function handleSave(userInfo) {
  await ipc.invoke(ipcApiRoute.updateUserInfo, {
    id: userInfo.id,
    username: userInfo.username,
    port: userInfo.port,
  });

  await getUserInfo();
}

// message
onMounted(async () => {
  ipc.removeAllListeners(ipcApiRoute.subscribeMessageServe);
  ipc.on(ipcApiRoute.subscribeMessageServe, (_, result) => {
    if (result) {
      if (activeDevice.value?.id === result.deviceId) {
        // push to content
        mitt.emit("newMessage", result);
        return;
      }

      const sourceDevice = devices.value.find(
        (device) => device.id === result.deviceId
      );
      if (sourceDevice) {
        typeof sourceDevice.count === "number"
          ? sourceDevice.count++
          : (sourceDevice.count = 1);
      }
    }
  });

  await subscribeMessageServe();
});

async function subscribeMessageServe() {
  await ipc.send(ipcApiRoute.subscribeMessageServe);
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
            <n-button size="small" @click="openUserConfig">
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
    <UserConfig ref="userConfigRef" @save="handleSave"></UserConfig>
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
                <n-badge :value="device.count" :max="99" type="info">
                  <n-avatar round>{{ device.username }}</n-avatar>
                </n-badge>
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
