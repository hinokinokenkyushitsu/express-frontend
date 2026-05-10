<script setup>
/**
 * 抢单确认弹窗
 *
 * 复用 ConfirmModal 不合适，因为这里需要一个"承诺分钟数"的数字输入。
 *
 * 父组件用法：
 *   <GrabConfirmModal
 *     :visible="visible"
 *     :urgency="order.urgency"      // 0/1，决定上限和默认值
 *     :loading="grabbing"
 *     @confirm="(minutes) => grab(orderId, minutes)"
 *     @cancel="visible = false"
 *   />
 */
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ORDER_URGENCY, URGENCY_MAX_MINUTES, URGENCY_DEFAULT_MINUTES } from '@/api/order'

const props = defineProps({
  visible: { type: Boolean, default: false },
  urgency: { type: Number, default: 0 },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['confirm', 'cancel'])
const { t } = useI18n()

const minutes = ref(URGENCY_DEFAULT_MINUTES[ORDER_URGENCY.NORMAL])
const errorMsg = ref('')

const maxMinutes = computed(() => URGENCY_MAX_MINUTES[props.urgency] ?? 120)
const isUrgent = computed(() => props.urgency === ORDER_URGENCY.URGENT)

// 紧急度变化或弹窗重新打开时，重置默认值
watch(
  () => [props.visible, props.urgency],
  ([visible, urgency]) => {
    if (visible) {
      minutes.value = URGENCY_DEFAULT_MINUTES[urgency] ?? 60
      errorMsg.value = ''
    }
  },
  { immediate: true }
)

// 快捷选项 chip：紧急 [10,15,20,30] / 普通 [30,60,90,120]
const presets = computed(() => {
  return isUrgent.value ? [10, 15, 20, 30] : [30, 60, 90, 120]
})

function submit() {
  const n = parseInt(minutes.value, 10)
  if (Number.isNaN(n) || n < 1) {
    errorMsg.value = t('grab.invalidMinutes')
    return
  }
  if (n > maxMinutes.value) {
    errorMsg.value = t('grab.exceedMax', { max: maxMinutes.value })
    return
  }
  errorMsg.value = ''
  emit('confirm', n)
}

function close() {
  if (props.loading) return
  emit('cancel')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
        @click.self="close"
      >
        <div class="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            {{ $t('grab.title') }}
          </h3>
          <p class="text-sm text-gray-500 mb-4">
            <span v-if="isUrgent" class="text-red-600 font-medium">⚡ {{ $t('orderUrgency.1') }}</span>
            <span v-else>{{ $t('orderUrgency.0') }}</span>
            ·
            {{ $t('grab.maxHint', { max: maxMinutes }) }}
          </p>

          <div class="mb-3">
            <label class="text-sm text-gray-700 font-medium mb-1.5 block">
              {{ $t('grab.promiseLabel') }}
            </label>
            <div class="relative">
              <input
                v-model.number="minutes"
                type="number"
                min="1"
                :max="maxMinutes"
                class="input-base pr-12"
                :disabled="loading"
                @keyup.enter="submit"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                {{ $t('grab.unitMinutes') }}
              </span>
            </div>
            <p v-if="errorMsg" class="text-xs text-red-500 mt-1">{{ errorMsg }}</p>
          </div>

          <!-- 快捷预设 -->
          <div class="flex flex-wrap gap-2 mb-5">
            <button
              v-for="v in presets"
              :key="v"
              type="button"
              class="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-brand-100 hover:text-brand-700 transition"
              :class="{ 'bg-brand-100 text-brand-700': minutes === v }"
              :disabled="loading"
              @click="minutes = v; errorMsg = ''"
            >
              {{ v }} {{ $t('grab.unitMinutes') }}
            </button>
          </div>

          <div class="flex justify-end gap-3">
            <button
              class="btn-secondary px-4 py-2 text-sm"
              :disabled="loading"
              @click="close"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              class="btn-primary px-4 py-2 text-sm"
              :disabled="loading"
              @click="submit"
            >
              {{ loading ? $t('hall.grabbing') : $t('grab.confirmBtn') }}
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
