<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' },
  message: { type: String, required: true },
  confirmText: { type: String, required: true },
  cancelText: { type: String, required: true },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
        @click.self="!loading && emit('cancel')"
      >
        <div class="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ title }}
          </h3>
          <p class="text-sm leading-6 text-gray-600 mb-6">
            {{ message }}
          </p>

          <div class="flex justify-end gap-3">
            <button
              class="btn-secondary px-4 py-2 text-sm"
              :disabled="loading"
              @click="emit('cancel')"
            >
              {{ cancelText }}
            </button>
            <button
              class="btn-primary px-4 py-2 text-sm"
              :disabled="loading"
              @click="emit('confirm')"
            >
              {{ loading ? confirmText : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.18s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
