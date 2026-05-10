<script setup>
/**
 * 同学 A 任务：用户端 - 我的订单列表页
 * - 对接 GET /api/order/my
 * - 展示订单状态、地址、金额
 * - 待抢单状态可取消
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { orderApi, ORDER_STATUS } from '@/api/order'
import { useToast } from '@/utils/toast'
import OrderCard from '@/components/OrderCard.vue'
import Pagination from '@/components/Pagination.vue'
import EmptyState from '@/components/EmptyState.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const router = useRouter()
const toast = useToast()
const { t } = useI18n()

const orders = ref([])
const pageInfo = ref({ current: 1, pages: 0, total: 0 })
const loading = ref(false)
const confirmVisible = ref(false)
const pendingCancelId = ref(null)
const cancellingId = ref(null)

async function load(pageNum = 1) {
  loading.value = true
  try {
    const data = await orderApi.getMyOrders({ pageNum, pageSize: 10 })
    orders.value = data.records
    pageInfo.value = { current: data.current, pages: data.pages, total: data.total }
  } catch (e) {
    toast.error(e.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => load(1))

function cancelOrder(orderId) {
  pendingCancelId.value = orderId
  confirmVisible.value = true
}

function closeCancelConfirm() {
  if (cancellingId.value) return
  confirmVisible.value = false
  pendingCancelId.value = null
}

async function confirmCancelOrder() {
  if (!pendingCancelId.value) return
  const orderId = pendingCancelId.value
  cancellingId.value = orderId
  try {
    await orderApi.cancel(orderId)
    toast.success(t('userOrders.cancelSuccess'))
    confirmVisible.value = false
    pendingCancelId.value = null
    load(pageInfo.value.current)
  } catch (e) {
    toast.error(e.message)
  } finally {
    cancellingId.value = null
  }
}

const PENDING = ORDER_STATUS.PENDING
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-gray-800">{{ $t('userOrders.title') }}</h2>
      <button class="btn-primary text-sm py-2 px-4" @click="router.push('/user/create')">
        {{ $t('userOrders.publishNew') }}
      </button>
    </div>

    <div v-if="loading && orders.length === 0" class="text-center py-12 text-gray-400">
      {{ $t('common.loading') }}
    </div>

    <EmptyState v-else-if="orders.length === 0" :text="$t('userOrders.empty')" />

    <div v-else class="space-y-3">
      <OrderCard
        v-for="ov in orders"
        :key="ov.order.id"
        :order-view="ov"
        mode="user"
      >
        <template #actions="{ order }">
          <button
            v-if="order.status === PENDING"
            class="btn-secondary text-sm py-1.5 px-3"
            :disabled="cancellingId === order.id"
            @click="cancelOrder(order.id)"
          >
            {{ cancellingId === order.id ? $t('common.processing') : $t('userOrders.cancelOrder') }}
          </button>
        </template>
      </OrderCard>
    </div>

    <Pagination :current="pageInfo.current" :pages="pageInfo.pages" @change="load" />

    <ConfirmModal
      :visible="confirmVisible"
      :title="$t('common.notice')"
      :message="$t('userOrders.cancelConfirm')"
      :confirm-text="$t('common.confirm')"
      :cancel-text="$t('common.cancel')"
      :loading="!!cancellingId"
      @confirm="confirmCancelOrder"
      @cancel="closeCancelConfirm"
    />
  </div>
</template>
