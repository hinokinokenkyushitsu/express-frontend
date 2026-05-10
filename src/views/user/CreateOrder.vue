<script setup>
/**
 * 同学 A 任务：用户端 - 发布订单页
 * - 对接 POST /api/order
 * - 表单校验（地址、取件码、费用、紧急度）
 * - 提交成功后跳转回订单列表
 */
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { orderApi, ORDER_URGENCY, URGENCY_MAX_MINUTES } from '@/api/order'
import { useToast } from '@/utils/toast'

const router = useRouter()
const toast = useToast()
const { t } = useI18n()

const form = reactive({
  stationAddress: '',
  targetAddress: '',
  pickupCode: '',
  amount: '',
  urgency: ORDER_URGENCY.NORMAL
})
const loading = ref(false)

// 常用快递站快捷选择（保留为真实站点名称，不参与 i18n）
const STATIONS = [
  '菜鸟驿站(北门店)',
  '菜鸟驿站(南门店)',
  '中通快递点',
  '京东自提柜'
]

async function submit() {
  if (!form.stationAddress.trim()) return toast.error(t('createOrder.requireStation'))
  if (!form.targetAddress.trim())  return toast.error(t('createOrder.requireTarget'))
  if (!form.pickupCode.trim())     return toast.error(t('createOrder.requirePickupCode'))
  const amount = parseFloat(form.amount)
  if (isNaN(amount) || amount < 0) return toast.error(t('createOrder.invalidAmount'))

  loading.value = true
  try {
    await orderApi.create({
      stationAddress: form.stationAddress,
      targetAddress: form.targetAddress,
      pickupCode: form.pickupCode,
      amount,
      urgency: form.urgency
    })
    toast.success(t('createOrder.success'))
    setTimeout(() => router.push('/user/orders'), 800)
  } catch (e) {
    toast.error(e.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ $t('createOrder.title') }}</h2>

    <div class="card p-5 space-y-4">
      <!-- 取件地址 -->
      <div>
        <label class="text-sm text-gray-700 font-medium mb-1.5 block">
          {{ $t('field.stationAddress') }} <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.stationAddress"
          maxlength="256"
          :placeholder="$t('placeholder.stationExample')"
          class="input-base"
        />
        <div class="flex flex-wrap gap-2 mt-2">
          <button
            v-for="s in STATIONS"
            :key="s"
            class="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-brand-100 hover:text-brand-700 transition"
            @click="form.stationAddress = s"
          >{{ s }}</button>
        </div>
      </div>

      <!-- 送达地址 -->
      <div>
        <label class="text-sm text-gray-700 font-medium mb-1.5 block">
          {{ $t('field.targetAddress') }} <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.targetAddress"
          maxlength="256"
          :placeholder="$t('placeholder.targetExample')"
          class="input-base"
        />
      </div>

      <!-- 取件码 -->
      <div>
        <label class="text-sm text-gray-700 font-medium mb-1.5 block">
          {{ $t('field.pickupCode') }} <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.pickupCode"
          maxlength="32"
          :placeholder="$t('placeholder.pickupCodeExample')"
          class="input-base font-mono"
        />
        <p class="text-xs text-gray-400 mt-1">{{ $t('createOrder.pickupCodeHint') }}</p>
      </div>

      <!-- 金额 -->
      <div>
        <label class="text-sm text-gray-700 font-medium mb-1.5 block">
          {{ $t('field.amount') }} <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
          <input
            v-model="form.amount"
            type="number"
            min="0"
            step="0.5"
            placeholder="0.00"
            class="input-base pl-8"
          />
        </div>
        <div class="flex flex-wrap gap-2 mt-2">
          <button
            v-for="v in [3, 5, 8, 10]"
            :key="v"
            class="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-brand-100 hover:text-brand-700 transition"
            @click="form.amount = v"
          >¥{{ v }}</button>
        </div>
      </div>

      <!-- 紧急度 -->
      <div>
        <label class="text-sm text-gray-700 font-medium mb-1.5 block">
          {{ $t('field.urgency') }} <span class="text-red-500">*</span>
        </label>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="px-4 py-3 rounded-lg border-2 text-left transition-colors"
            :class="form.urgency === ORDER_URGENCY.NORMAL
              ? 'border-brand-500 bg-brand-50'
              : 'border-gray-200 hover:border-gray-300'"
            @click="form.urgency = ORDER_URGENCY.NORMAL"
          >
            <div class="font-medium text-gray-800">{{ $t('orderUrgency.0') }}</div>
            <div class="text-xs text-gray-500 mt-0.5">
              {{ $t('createOrder.urgencyNormalHint', { max: URGENCY_MAX_MINUTES[0] }) }}
            </div>
          </button>
          <button
            type="button"
            class="px-4 py-3 rounded-lg border-2 text-left transition-colors"
            :class="form.urgency === ORDER_URGENCY.URGENT
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 hover:border-gray-300'"
            @click="form.urgency = ORDER_URGENCY.URGENT"
          >
            <div class="font-medium text-gray-800">⚡ {{ $t('orderUrgency.1') }}</div>
            <div class="text-xs text-gray-500 mt-0.5">
              {{ $t('createOrder.urgencyUrgentHint', { max: URGENCY_MAX_MINUTES[1] }) }}
            </div>
          </button>
        </div>
      </div>

      <button class="btn-primary w-full mt-2" :disabled="loading" @click="submit">
        {{ loading ? $t('common.submitting') : $t('createOrder.publish') }}
      </button>
    </div>
  </div>
</template>
