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
  handleCancel()
}

async function handleCancel() {
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
  <a-drawer
    :width="380"
    :visible="modalVisible"
    ok-text="保存"
    unmount-on-close
    @ok="saveConf"
    @cancel="handleCancel"
  >
    <template #title>
      系统设置
    </template>
    <div>
      <a-form :model="appConf">
        <a-form-item
          field="autoStart"
          label="开机启动"
        >
          <a-checkbox v-model="appConf.autoStart" />
        </a-form-item>
        <a-form-item
          field="frameUrl"
          label="网页地址"
        >
          <a-input v-model="appConf.frameUrl" />
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
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
</style>
