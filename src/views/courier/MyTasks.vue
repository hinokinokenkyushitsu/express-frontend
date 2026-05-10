<script setup>
/**
 * 同学 B 任务：快递员端 - 我的任务
 * - 对接 GET /api/order/courier/my
 * - 后端会按当前登录快递员的 courier_id 查询已抢订单
 * - 按状态分类：待配送（status=1）、已完成（status=2）、已取消（status=3）
 * - status=1 的可以点击"完成"按钮（PATCH status=2）
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { orderApi, ORDER_STATUS } from '@/api/order'
import { useToast } from '@/utils/toast'
import OrderCard from '@/components/OrderCard.vue'
import Pagination from '@/components/Pagination.vue'
import EmptyState from '@/components/EmptyState.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const toast = useToast()
const { t } = useI18n()
const orders = ref([])
const pageInfo = ref({ current: 1, pages: 0, total: 0 })
const loading = ref(false)
const updatingId = ref(null)
const activeTab = ref('active')   // 'active' = 配送中, 'history' = 已完成/取消
const confirmVisible = ref(false)
const pendingCompleteId = ref(null)

async function load(pageNum = 1) {
  loading.value = true
  try {
    const data = await orderApi.getCourierTasks({ pageNum, pageSize: 10 })
    orders.value = data.records
    pageInfo.value = { current: data.current, pages: data.pages, total: data.total }
  } catch (e) {
    toast.error(e.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => load(1))

const filteredOrders = computed(() => {
  if (activeTab.value === 'active') {
    return orders.value.filter(ov => ov.order.status === ORDER_STATUS.IN_PROGRESS)
  }
  return orders.value.filter(ov =>
    ov.order.status === ORDER_STATUS.COMPLETED ||
    ov.order.status === ORDER_STATUS.CANCELLED
  )
})

const emptyText = computed(() =>
  activeTab.value === 'active' ? t('tasks.emptyActive') : t('tasks.emptyHistory')
)

function completeTask(orderId) {
  pendingCompleteId.value = orderId
  confirmVisible.value = true
}

function closeCompleteConfirm() {
  if (updatingId.value) return
  confirmVisible.value = false
  pendingCompleteId.value = null
}

async function confirmCompleteTask() {
  if (!pendingCompleteId.value) return
  const orderId = pendingCompleteId.value
  updatingId.value = orderId
  try {
    await orderApi.updateStatus(orderId, ORDER_STATUS.COMPLETED)
    toast.success(t('tasks.completeSuccess'))
    confirmVisible.value = false
    pendingCompleteId.value = null
    load(pageInfo.value.current)
  } catch (e) {
    toast.error(e.message)
  } finally {
    updatingId.value = null
  }
}

const IN_PROGRESS = ORDER_STATUS.IN_PROGRESS
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ $t('tasks.title') }}</h2>

    <!-- Tab 切换 -->
    <div class="flex bg-gray-100 rounded-lg p-1 mb-4">
      <button
        class="flex-1 py-2 text-sm font-medium rounded-md transition-colors"
        :class="activeTab === 'active' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-600'"
        @click="activeTab = 'active'"
      >
        {{ $t('tasks.tabActive') }}
      </button>
      <button
        class="flex-1 py-2 text-sm font-medium rounded-md transition-colors"
        :class="activeTab === 'history' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-600'"
        @click="activeTab = 'history'"
      >
        {{ $t('tasks.tabHistory') }}
      </button>
    </div>

    <div v-if="loading && orders.length === 0" class="text-center py-12 text-gray-400">
      {{ $t('common.loading') }}
    </div>

    <EmptyState
      v-else-if="filteredOrders.length === 0"
      :text="emptyText"
    />

    <div v-else class="space-y-3">
      <OrderCard
        v-for="ov in filteredOrders"
        :key="ov.order.id"
        :order-view="ov"
        mode="task"
      >
        <template #actions="{ order }">
          <button
            v-if="order.status === IN_PROGRESS"
            class="btn-primary text-sm py-1.5 px-3"
            :disabled="updatingId === order.id"
            @click="completeTask(order.id)"
          >
            {{ updatingId === order.id ? $t('common.processing') : $t('tasks.completeBtn') }}
          </button>
        </template>
      </OrderCard>
    </div>

    <Pagination :current="pageInfo.current" :pages="pageInfo.pages" @change="load" />

    <ConfirmModal
      :visible="confirmVisible"
      :title="$t('common.notice')"
      :message="$t('tasks.completeConfirm')"
      :confirm-text="$t('common.confirm')"
      :cancel-text="$t('common.cancel')"
      :loading="!!updatingId"
      @confirm="confirmCompleteTask"
      @cancel="closeCompleteConfirm"
    />
  </div>
</template>
