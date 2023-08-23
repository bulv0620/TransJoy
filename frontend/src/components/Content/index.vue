<script setup>
import { nextTick, onMounted, ref } from "vue";
import mitt from "@/utils/mitt.js";
import { ipcApiRoute } from "@/api/main";
import { ipc } from "@/utils/ipcRenderer";
import { useMessage } from "naive-ui";

const message = useMessage();

const activeDevice = ref(null);

const msgList = ref([]);

onMounted(() => {
  mitt.on("updateActiveDevice", async (device) => {
    if (JSON.stringify(device) !== "{}") {
      msgList.value = [];

      await getMessages(device);

      activeDevice.value = device;
      scrollToBottom();
    } else {
      activeDevice.value = null;
    }
  });

  mitt.on("newMessage", (msg) => {
    msgList.value.push(msg);

    scrollToBottom();
  });
});

async function getMessages(device) {
  const list = await ipc.invoke(ipcApiRoute.queryMessage, { ...device });
  msgList.value = list || [];
}

function scrollToBottom() {
  nextTick(() => {
    const scrollContent = document.querySelector(
      ".scroll-content .n-scrollbar-container"
    );
    scrollContent.scrollTo(0, scrollContent.scrollHeight);
  });
}

// send message
const inputRef = ref(null);
const content = ref("");
const loading = ref(false);
async function sendMessage() {
  loading.value = true;

  try {
    const success = await ipc.invoke(ipcApiRoute.sendMessage, {
      target: { ...activeDevice.value },
      type: "msg",
      content: content.value,
    });

    if (success) {
      await getMessages(activeDevice.value);
      scrollToBottom();
    } else {
      message.error("发送失败");
    }
  } catch (error) {
    message.error("发送失败");
    console.warn(error);
  } finally {
    content.value = "";
    loading.value = false;

    nextTick(() => {
      inputRef.value.focus();
    })
  }
}
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
      <div class="h-content bg-gradient-to-b from-slate-800 overflow-auto">
        <n-scrollbar class="h-full scroll-content px-4">
          <div
            v-for="msg in msgList"
            :key="msg.id"
            class="overflow-hidden my-2"
          >
            <div :class="msg.self ? 'float-right text-right' : 'float-left'">
              <p
                class="p-2 max-w-xs break-all bg-slate-500 rounded-md inline-block"
              >
                <span>{{ msg.content }}</span>
              </p>
              <p class="text-xs text-gray-400">{{ msg.timestamp }}</p>
            </div>
          </div>
        </n-scrollbar>
      </div>
      <div class="bg-slate-600 p-1 absolute w-full bottom-0">
        <n-input
          ref="inputRef"
          :disabled="loading"
          :loading="loading"
          v-model:value="content"
          @keypress.enter.native="sendMessage"
        ></n-input>
      </div>
    </div>
    <div v-else class="w-full h-full flex items-center justify-center">
      <n-empty description="Select a Device"> </n-empty>
    </div>
  </div>
</template>
