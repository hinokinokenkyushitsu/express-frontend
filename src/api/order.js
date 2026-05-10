import request from '@/utils/request'

export const orderApi = {
  /**
   * 创建订单（用户端）
   * @param {{
   *   stationAddress: string,
   *   targetAddress: string,
   *   pickupCode: string,
   *   amount: number,
   *   urgency?: number   // 0 普通 / 1 紧急，默认 0
   * }} data
   */
  create(data) {
    return request.post('/order', data)
  },

  /** 我的订单（分页） */
  getMyOrders(params) {
    return request.get('/order/my', { params })
  },

  /** 抢单大厅（分页，快递员端） */
  getHallOrders(params) {
    return request.get('/order/hall', { params })
  },

  /** 快递员我的任务（分页） */
  getCourierTasks(params) {
    return request.get('/order/courier/my', { params })
  },

  /**
   * 抢单：提交承诺送达分钟数（紧急 ≤ 30，普通 ≤ 120）。
   * 后端会校验：被封禁的快递员 → 403；超出上限 → 400。
   */
  grab(orderId, promisedMinutes) {
    return request.post(`/order/${orderId}/grab`, { promisedMinutes })
  },

  /** 更新订单状态 */
  updateStatus(orderId, status) {
    return request.patch(`/order/${orderId}/status`, null, { params: { status } })
  },

  /** 取消订单 */
  cancel(orderId) {
    return request.delete(`/order/${orderId}`)
  }
}

/** 订单状态常量 */
export const ORDER_STATUS = {
  PENDING: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  CANCELLED: 3
}

/** 紧急度常量 */
export const ORDER_URGENCY = {
  NORMAL: 0,
  URGENT: 1
}

/** 紧急度对应的承诺时间上限（分钟）—— 与后端 OrderUrgency 枚举保持一致 */
export const URGENCY_MAX_MINUTES = {
  [ORDER_URGENCY.NORMAL]: 120,
  [ORDER_URGENCY.URGENT]: 30
}

/** 紧急度对应的"默认承诺值"——抢单弹窗里预填一个合理值 */
export const URGENCY_DEFAULT_MINUTES = {
  [ORDER_URGENCY.NORMAL]: 60,
  [ORDER_URGENCY.URGENT]: 15
}

// 状态文案改用 i18n：模板里 $t('orderStatus.' + status)，脚本里 i18n.global.t('orderStatus.' + status)

/** 状态对应的徽章样式 */
export const ORDER_STATUS_STYLE = {
  0: 'bg-amber-100 text-amber-700',
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-green-100 text-green-700',
  3: 'bg-gray-100 text-gray-500'
}

/** 紧急度徽章样式 */
export const ORDER_URGENCY_STYLE = {
  0: 'bg-gray-100 text-gray-600',
  1: 'bg-red-100 text-red-700'
}
