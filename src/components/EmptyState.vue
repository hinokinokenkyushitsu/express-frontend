<script setup>
defineProps({
  // 由调用方传入已翻译好的文案；若不传则只显示图标
  text: { type: String, default: '' }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-gray-400">
    <svg class="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
    </svg>
    <p v-if="text" class="text-sm">{{ text }}</p>
  </div>
</template>
