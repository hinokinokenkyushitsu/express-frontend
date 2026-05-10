<script setup>
const props = defineProps({
  current: { type: Number, required: true },
  pages:   { type: Number, required: true }
})

const emit = defineEmits(['change'])

function go(p) {
  if (p < 1 || p > props.pages || p === props.current) return
  emit('change', p)
}
</script>

<template>
  <div v-if="pages > 1" class="flex items-center justify-center gap-2 py-4">
    <button
      class="px-3 py-1.5 rounded border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
      :disabled="current <= 1"
      @click="go(current - 1)"
    >{{ $t('pagination.prev') }}</button>

    <span class="text-sm text-gray-500 px-2">
      {{ $t('pagination.page', { current, total: pages }) }}
    </span>

    <button
      class="px-3 py-1.5 rounded border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
      :disabled="current >= pages"
      @click="go(current + 1)"
    >{{ $t('pagination.next') }}</button>
  </div>
</template>
