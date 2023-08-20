<script setup>
import { Save, ArrowUndo } from "@vicons/ionicons5";
import { ref } from "vue";

const loading = ref(false);
const showModal = ref(false);
const formModel = ref({
  username: "",
  port: "",
});
const formRef = ref(null);
const emits = defineEmits(["save"]);

const rules = {
  username: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule, value) {
      if (!value) {
        return new Error("username is required");
      } else if (value.length > 10 || value.length < 1) {
        return new Error("username length 1-10");
      }
      return true;
    },
  },
  port: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule, value) {
      if (!value) {
        return new Error("port is required");
      } else if (parseInt(value) > 65535 || parseInt(value) < 0) {
        return new Error("port range 0-65535");
      }
      return true;
    },
  },
};

function openUserConfig(userInfo) {
  formModel.value = { ...userInfo };
  showModal.value = true;
}

async function handleSave() {
  if (loading.value) return;

  try {
    loading.value = true;
    await validate();

    emits("save", formModel.value);

    showModal.value = false;
  } catch (error) {
    console.warn(error);
  } finally {
    loading.value = false;
  }
}

function validate() {
  return new Promise((resolve, reject) => {
    formRef.value?.validate((errors) => {
      if (!errors) {
        resolve("valid");
      } else {
        reject(errors);
      }
    });
  });
}

defineExpose({ openUserConfig });
</script>

<template>
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 400px"
      title="Setting"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="medium"
      >
        <n-form-item label="username" path="username">
          <n-input v-model:value="formModel.username" placeholder="username" />
        </n-form-item>
        <n-form-item label="port" path="port">
          <n-input-number v-model:value="formModel.port" placeholder="port" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space class="float-right">
          <n-button @click="handleSave" :loading="loading">
            <template #icon>
              <n-icon>
                <Save />
              </n-icon>
            </template>
            save
          </n-button>
          <n-button @click="showModal = false">
            <template #icon>
              <n-icon>
                <ArrowUndo />
              </n-icon>
            </template>
            cancel
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<style>
.n-card.n-modal {
  background: #1e293b;
}
</style>
