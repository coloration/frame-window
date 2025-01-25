<script setup lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window'
import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart'
import { onKeyStroke } from '@vueuse/core'
import { onMounted, reactive, ref } from 'vue'
import conf from '../src-tauri/tauri.conf.json'

const name = conf.productName
const modalVisible = ref(false)

interface AppConfOption {
  frameUrl: string
  autoStart: boolean
}

const appConf = reactive<AppConfOption>({
  frameUrl: 'https://myapp.com',
  autoStart: false,
})

onMounted(async () => {
  document.title = name

  const originConf: Partial<AppConfOption> = JSON.parse(localStorage.getItem(name) || '{}')
  if (originConf.frameUrl) {
    appConf.frameUrl = originConf.frameUrl
  }

  if (typeof originConf.autoStart === 'boolean') {
    appConf.autoStart = originConf.autoStart
  }
  else {
    await disable()
  }
})

onKeyStroke('F11', async (e) => {
  e.preventDefault()
  const appWindow = getCurrentWindow()
  const isFullscreen = await appWindow.isFullscreen()
  await appWindow.setFullscreen(!isFullscreen)
})

onKeyStroke('F8', (e) => {
  e.preventDefault()
  modalVisible.value = !modalVisible.value
})

async function saveConf() {
  localStorage.setItem(name, JSON.stringify(appConf))

  const autoStartEnable = await isEnabled()

  if (autoStartEnable !== appConf.autoStart) {
    autoStartEnable ? await disable() : await enable()
  }
  modalVisible.value = false
}
</script>

<template>
  <iframe
    class="frame-window"
    border="0"
    frameborder="no"
    framespacing="0"
    :src="appConf.frameUrl"
  />

  <div v-if="modalVisible" class="modal">
    <div class="modal-shadow" @click="modalVisible = false" />
    <div class="modal-container">
      <div class="modal-form">
        <label>
          <span>开机自启: </span>
          <input v-model="appConf.autoStart" type="checkbox">
        </label>

        <label>
          <span>网页地址: </span>
          <input v-model="appConf.frameUrl" type="text">
        </label>
      </div>
      <div class="flex justify-end">
        <button class="border-1 border-blue-700 rounded bg-blue-500 px-2 py-1 text-white tracking-wider" @click="saveConf">
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
#app,
body,
html {
  @apply w-full h-full;
}
.frame-window {
  @apply w-full h-full border-none z-10;
}

.modal {
  @apply fixed inset-0 z-20;
}
.modal-shadow {
  @apply absolute inset-0 bg-dark/30;
}

.modal-container {
  @apply absolute z-1 left-0 top-0 h-full w-80 bg-white px-4 pb-4 flex flex-col;

  & .modal-form {
    @apply flex-1;
  }
  & label {
    @apply block py-2 flex items-center;
  }

  & span {
    @apply w-18;
  }

  & input {
    @apply outline-none outline-0 border-1 border-blue-500 rounded px-2 py-1;
  }
}
</style>
