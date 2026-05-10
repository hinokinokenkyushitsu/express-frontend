<script setup>
/**
 * 同学 B 任务：快递员端 - 抢单大厅
 * - 对接 GET /api/order/hall
 * - 显示所有 status=0 的订单（紧急单优先排序由后端完成）
 * - 点击"抢单"弹出 GrabConfirmModal，提交承诺分钟数后调 POST /api/order/{id}/grab
 * - 抢单成功后从列表中移除
 * - 支持手动刷新
 */
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { orderApi } from '@/api/order'
import { useToast } from '@/utils/toast'
import OrderCard from '@/components/OrderCard.vue'
import Pagination from '@/components/Pagination.vue'
import EmptyState from '@/components/EmptyState.vue'
import GrabConfirmModal from '@/components/GrabConfirmModal.vue'

const toast = useToast()
const { t } = useI18n()
const orders = ref([])
const pageInfo = ref({ current: 1, pages: 0, total: 0 })
const loading = ref(false)
const grabbing = ref(null)            // 正在抢的订单ID（接口请求中）
const confirmVisible = ref(false)
const pendingGrabOrder = ref(null)    // 当前弹窗对应的订单（带 urgency 给弹窗用）

async function load(pageNum = 1) {
  loading.value = true
  try {
    const data = await orderApi.getHallOrders({ pageNum, pageSize: 10 })
    orders.value = data.records
    pageInfo.value = { current: data.current, pages: data.pages, total: data.total }
  } catch (e) {
    toast.error(e.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => load(1))

function startGrab(order) {
  if (grabbing.value) return
  pendingGrabOrder.value = order
  confirmVisible.value = true
}

function closeGrab() {
  if (grabbing.value) return
  confirmVisible.value = false
  pendingGrabOrder.value = null
}

async function confirmGrab(promisedMinutes) {
  if (!pendingGrabOrder.value) return
  const orderId = pendingGrabOrder.value.id
  grabbing.value = orderId
  try {
    await orderApi.grab(orderId, promisedMinutes)
    toast.success(t('hall.grabSuccess'))
    confirmVisible.value = false
    pendingGrabOrder.value = null
    // 从当前页移除该订单
    orders.value = orders.value.filter(ov => ov.order.id !== orderId)
    // 如果当前页空了且不是第一页，回到上一页
    if (orders.value.length === 0 && pageInfo.value.current > 1) {
      load(pageInfo.value.current - 1)
    }
  } catch (e) {
    toast.error(e.message)
    // 抢单失败说明被人捷足先登 / 自己被封禁；关闭弹窗并刷新
    confirmVisible.value = false
    pendingGrabOrder.value = null
    load(pageInfo.value.current)
  } finally {
    grabbing.value = null
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">{{ $t('hall.title') }}</h2>
        <p class="text-sm text-gray-500 mt-1">{{ $t('hall.waitingCount', { count: pageInfo.total }) }}</p>
      </div>
      <button
        class="btn-secondary text-sm py-2 px-3 flex items-center gap-1"
        :disabled="loading"
        @click="load(pageInfo.current)"
      >
        <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        {{ $t('common.refresh') }}
      </button>
    </div>

    <div v-if="loading && orders.length === 0" class="text-center py-12 text-gray-400">
      {{ $t('common.loading') }}
    </div>

    <EmptyState v-else-if="orders.length === 0" :text="$t('hall.empty')" />

    <div v-else class="space-y-3">
      <OrderCard
        v-for="ov in orders"
        :key="ov.order.id"
        :order-view="ov"
        mode="hall"
      >
        <template #actions="{ order }">
          <button
            class="btn-primary text-sm py-1.5 px-4"
            :disabled="grabbing === order.id"
            @click="startGrab(order)"
          >
            {{ grabbing === order.id ? $t('hall.grabbing') : $t('hall.grab') }}
          </button>
        </template>
      </OrderCard>
    </div>

    <Pagination :current="pageInfo.current" :pages="pageInfo.pages" @change="load" />

    <GrabConfirmModal
      :visible="confirmVisible"
      :urgency="pendingGrabOrder?.urgency ?? 0"
      :loading="!!grabbing"
      @confirm="confirmGrab"
      @cancel="closeGrab"
    />
  </div>
</template>
