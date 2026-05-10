<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
const type = ref('info')   // 'info' | 'success' | 'error'

function show(msg, t = 'info') {
  message.value = msg
  type.value = t
  visible.value = true
  setTimeout(() => { visible.value = false }, 2000)
}

defineExpose({ show })
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm"
      :class="{
        'bg-gray-800': type === 'info',
        'bg-green-500': type === 'success',
        'bg-red-500':   type === 'error'
      }"
    >
      {{ message }}
    </div>
  </Transition>
</template>
