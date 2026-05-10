<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ORDER_STATUS, ORDER_STATUS_STYLE, ORDER_URGENCY, ORDER_URGENCY_STYLE } from '@/api/order'
import { useCountdown } from '@/utils/useCountdown'

const props = defineProps({
  // OrderView: { order, user, courier }
  orderView: { type: Object, required: true },
  // 显示模式：'user'（用户视角，看到接单快递员）| 'hall'（大厅模式，看到发单人） | 'task'（快递员任务视角）
  mode: { type: String, default: 'user' }
})

const { t } = useI18n()

// 倒计时仅对"配送中"的订单有意义（PENDING 还没抢，COMPLETED/CANCELLED 已结束）
const order = computed(() => props.orderView.order)
const isInProgress = computed(() => order.value.status === ORDER_STATUS.IN_PROGRESS)
const isOverdueSettled = computed(() => order.value.overdue === 1)

const { remainingMs, expired, label: countdownLabel } = useCountdown(
  () => isInProgress.value ? order.value.deadline : null
)

/**
 * 倒计时状态：
 *   - settled: 已超时且已结算（amount=0，用户免单），整张卡都显示"已超时(免单)"
 *   - expired: 配送中但已过 deadline，等待结算（少见，1~5 分钟内）
 *   - urgent:  剩余 ≤ 5 分钟，红色警告
 *   - warn:    剩余 ≤ 15 分钟，橙色提醒
 *   - normal:  绿色
 */
const countdownState = computed(() => {
  if (isOverdueSettled.value) return 'settled'
  if (!isInProgress.value || remainingMs.value == null) return null
  if (expired.value) return 'expired'
  if (remainingMs.value <= 5 * 60 * 1000) return 'urgent'
  if (remainingMs.value <= 15 * 60 * 1000) return 'warn'
  return 'normal'
})

const countdownClass = computed(() => {
  switch (countdownState.value) {
    case 'settled':
    case 'expired':
    case 'urgent':
      return 'text-red-600 font-medium'
    case 'warn':
      return 'text-amber-600 font-medium'
    case 'normal':
      return 'text-emerald-600'
    default:
      return 'text-gray-400'
  }
})

const countdownText = computed(() => {
  if (countdownState.value === 'settled') {
    return t('countdown.overdueRefunded')
  }
  if (countdownState.value === 'expired') {
    return t('countdown.expired', { time: countdownLabel.value })
  }
  if (remainingMs.value != null) {
    return t('countdown.remaining', { time: countdownLabel.value })
  }
  return ''
})

function formatTime(t) {
  if (!t) return ''
  return t.replace('T', ' ').slice(0, 16)
}

function formatAmount(n) {
  return Number(n).toFixed(2)
}

const isUrgent = computed(() => order.value.urgency === ORDER_URGENCY.URGENT)
</script>

<template>
  <div
    class="card p-4 hover:shadow-md transition-shadow"
    :class="isOverdueSettled ? 'border-red-200 bg-red-50/30' : ''"
  >
    <!-- 头部：状态徽章 + 紧急标签 + 金额 -->
    <div class="flex items-center justify-between mb-3 gap-2">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="badge" :class="ORDER_STATUS_STYLE[orderView.order.status]">
          {{ $t('orderStatus.' + orderView.order.status) }}
        </span>
        <span
          v-if="isUrgent"
          class="badge"
          :class="ORDER_URGENCY_STYLE[ORDER_URGENCY.URGENT]"
        >
          ⚡ {{ $t('orderUrgency.1') }}
        </span>
        <span
          v-if="isOverdueSettled"
          class="badge bg-red-100 text-red-700"
        >
          {{ $t('countdown.overdueBadge') }}
        </span>
      </div>
      <span
        class="font-semibold text-lg"
        :class="isOverdueSettled ? 'text-gray-400 line-through' : 'text-brand-600'"
      >
        ¥ {{ formatAmount(orderView.order.amount) }}
      </span>
    </div>

    <!-- 倒计时（仅在配送中或已结算超时时显示） -->
    <div
      v-if="countdownState"
      class="mb-3 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
      :class="{
        'bg-red-50': countdownState === 'urgent' || countdownState === 'expired' || countdownState === 'settled',
        'bg-amber-50': countdownState === 'warn',
        'bg-emerald-50': countdownState === 'normal'
      }"
    >
      <svg class="w-4 h-4 shrink-0" :class="countdownClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span :class="countdownClass">{{ countdownText }}</span>
      <span
        v-if="orderView.order.promisedMinutes && countdownState !== 'settled'"
        class="text-xs text-gray-400 ml-auto"
      >
        {{ $t('countdown.promised', { n: orderView.order.promisedMinutes }) }}
      </span>
    </div>

    <!-- 地址信息 -->
    <div class="space-y-2 mb-3">
      <div class="flex items-start text-sm">
        <span class="inline-block w-12 shrink-0 text-gray-400">{{ $t('orderCard.pickup') }}</span>
        <span class="text-gray-800">{{ orderView.order.stationAddress }}</span>
      </div>
      <div class="flex items-start text-sm">
        <span class="inline-block w-12 shrink-0 text-gray-400">{{ $t('orderCard.deliver') }}</span>
        <span class="text-gray-800">{{ orderView.order.targetAddress }}</span>
      </div>
      <div class="flex items-start text-sm">
        <span class="inline-block w-12 shrink-0 text-gray-400">{{ $t('orderCard.pickupCode') }}</span>
        <span class="font-mono font-medium text-gray-900">{{ orderView.order.pickupCode }}</span>
      </div>
    </div>

    <!-- 关联用户信息 -->
    <div v-if="mode === 'user' && orderView.courier" class="flex items-center text-sm text-gray-600 pt-3 border-t border-gray-100">
      <span class="text-gray-400 mr-2">{{ $t('field.courier') }}</span>
      <span>{{ orderView.courier.name }}</span>
      <span class="ml-2 text-gray-400">{{ orderView.courier.phone }}</span>
    </div>
    <div v-else-if="(mode === 'hall' || mode === 'task') && orderView.user" class="flex items-center text-sm text-gray-600 pt-3 border-t border-gray-100">
      <span class="text-gray-400 mr-2">{{ $t('field.sender') }}</span>
      <span>{{ orderView.user.name }}</span>
      <span v-if="mode === 'task'" class="ml-2 text-gray-400">{{ orderView.user.phone }}</span>
    </div>

    <!-- 时间 + 操作槽 -->
    <div class="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
      <span class="text-xs text-gray-400">{{ formatTime(orderView.order.createTime) }}</span>
      <div class="flex gap-2">
        <slot name="actions" :order="orderView.order"></slot>
      </div>
    </div>
  </div>
</template>
