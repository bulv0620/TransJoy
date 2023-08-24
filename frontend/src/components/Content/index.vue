<script setup>
import { nextTick, onMounted, ref } from "vue";
import mitt from "@/utils/mitt.js";
import { ipcApiRoute } from "@/api/main";
import { ipc } from "@/utils/ipcRenderer";
import { useMessage } from "naive-ui";
import {
  DocumentAttachOutline,
  TrashOutline,
  CopyOutline,
  CloudDownloadOutline,
} from "@vicons/ionicons5";
import { conform } from "@/utils/confirm";
import { useDialog } from "naive-ui";

const dialog = useDialog();
const message = useMessage();

const activeDevice = ref(null);

const msgList = ref([]);

onMounted(() => {
  mitt.on("updateActiveDevice", async (device) => {
    if (JSON.stringify(device) !== "{}") {
      msgList.value = [];

      activeDevice.value = device;

      await getMessages(device);
    } else {
      activeDevice.value = null;
    }
  });

  mitt.on("newMessage", (msg) => {
    msgList.value.push(msg);

    scrollToBottom();
  });

  window.onresize = () => {
    scrollToBottom();
  };
});

async function getMessages(device) {
  const list = await ipc.invoke(ipcApiRoute.queryMessage, { ...device });
  msgList.value = list || [];

  scrollToBottom();
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
const msgContent = ref("");
const loading = ref(false);
function sendMessage() {
  if (loading.value) return;

  send("msg", msgContent.value);
}

async function send(type, content) {
  loading.value = true;

  try {
    const success = await ipc.invoke(ipcApiRoute.sendMessage, {
      target: { ...activeDevice.value },
      type,
      content,
    });

    if (success) {
      await getMessages(activeDevice.value);
    } else {
      message.error("fail");
    }
  } catch (error) {
    message.error("fail");
    console.warn(error);
  } finally {
    msgContent.value = "";
    loading.value = false;

    nextTick(() => {
      inputRef.value.focus();
    });
  }
}

// file fn
function isImg(fileName) {
  return /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileName);
}

function isVideo(fileName) {
  return /\.(mp4|avi|mov|mkv|flv|wmv|mpg|mpeg|webm)$/.test(fileName);
}

function handleUploadFile() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  fileInput.addEventListener("change", () => {
    const selectedFile = fileInput.files[0];

    if (selectedFile) {
      msgContent.value = selectedFile.name;

      const content = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        filePath:
          selectedFile.path ||
          selectedFile.webkitRelativePath ||
          selectedFile.mozRelativePath ||
          selectedFile.name,
        fileSize: selectedFile.size,
      };

      send("file", content);
    }
  });

  fileInput.click();
}

// remove message

const removeLoading = ref(false);

async function handleRemoveMessage(deviceId, messageId) {
  if (removeLoading.value) return;
  removeLoading.value = true;

  try {
    await conform(dialog, {
      type: "error",
      title: "warn",
      content: "Delete the information?",
      positiveText: "yes",
      negativeText: "no",
    });
    await ipc.invoke(ipcApiRoute.removeMessage, {
      deviceId,
      messageId,
    });

    message.success("success");

    getMessages(activeDevice.value);
  } catch (error) {
    console.warn(error);
  } finally {
    removeLoading.value = false;
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
                v-if="msg.type === 'msg'"
                class="p-2 max-w-xs break-all bg-slate-500 rounded-md inline-block text-left mb-2"
              >
                <span>{{ msg.content }}</span>
              </p>
              <div
                v-else
                class="max-w-lg max-h-96 overflow-hidden break-all bg-slate-500 rounded-md inline-block text-left"
              >
                <n-image
                  v-if="isImg(msg.content.fileName)"
                  class="align-middle"
                  :src="`http://${msg.self ? 'localhost' : activeDevice.ip}:${activeDevice.port}/controller/message/download?path=${msg.content.filePath}&name=${msg.content.fileName}&size=${msg.content.fileSize}&type=${msg.content.fileType}`"
                  style="max-width: 300px"
                  @load="scrollToBottom"
                ></n-image>
                <video
                  v-else-if="isVideo(msg.content.fileName)"
                  controls
                  width="300"
                  @loadeddata="scrollToBottom"
                >
                  <source
                    :src="`http://${msg.self ? 'localhost' : activeDevice.ip}:${activeDevice.port}/controller/message/download?path=${msg.content.filePath}&name=${msg.content.fileName}&size=${msg.content.fileSize}&type=${msg.content.fileType}`"
                    :type="msg.content.fileType"
                  />
                </video>
                <div v-else class="w-40 h-40 flex justify-center items-center">
                  <div class="text-center w-full">
                    <n-icon size="80">
                      <DocumentAttachOutline />
                    </n-icon>
                    <n-ellipsis class="w-5/6 text-base">
                      {{ msg.content.fileName }}
                    </n-ellipsis>
                  </div>
                </div>
              </div>
              <p
                class="text-gray-400 flex"
                :class="{ 'justify-end': msg.self }"
              >
                <span style="font-size: 12px">{{ msg.timestamp }}</span>

                <n-icon class="ml-2 cursor-pointer">
                  <CopyOutline />
                </n-icon>
                <n-icon class="ml-2 cursor-pointer" v-if="msg.type === 'file'">
                  <CloudDownloadOutline />
                </n-icon>
                <n-icon
                  class="ml-2 cursor-pointer"
                  @click="handleRemoveMessage(activeDevice.id, msg.id)"
                >
                  <TrashOutline />
                </n-icon>
              </p>
            </div>
          </div>
        </n-scrollbar>
      </div>
      <div class="bg-slate-600 p-1 absolute w-full bottom-0 flex gap-1">
        <n-button
          strong
          secondary
          circle
          @click="handleUploadFile"
          :disabled="loading"
        >
          <template #icon>
            <n-icon size="24"><DocumentAttachOutline /></n-icon>
          </template>
        </n-button>
        <n-input
          ref="inputRef"
          type="textarea"
          :disabled="loading"
          :loading="loading"
          v-model:value="msgContent"
          @keypress.enter.native="sendMessage"
          :autosize="{
            minRows: 1,
            maxRows: 3,
          }"
        ></n-input>
      </div>
    </div>
    <div v-else class="w-full h-full flex items-center justify-center">
      <n-empty description="Select a Device"> </n-empty>
    </div>
  </div>
</template>

<style>
.n-dialog {
  background: #1e293b;
}
</style>
