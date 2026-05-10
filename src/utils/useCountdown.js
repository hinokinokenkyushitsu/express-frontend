/**
 * 倒计时复用逻辑
 *
 * 用法：
 *   const { remaining, expired, label } = useCountdown(() => order.deadline)
 *   <span :class="expired ? 'text-red-500' : 'text-gray-700'">{{ label }}</span>
 *
 * 实现要点：返回的都是 computed，依赖全局 tick ref，每秒自动重算。
 */
import { computed } from 'vue'
import { tick, nowMillis, parseDeadline } from './clock'

/**
 * @param {() => string|null} deadlineGetter 获取 deadline ISO 字符串的函数
 * @returns {{
 *   remainingMs: import('vue').ComputedRef<number|null>,
 *   expired: import('vue').ComputedRef<boolean>,
 *   label: import('vue').ComputedRef<string>
 * }}
 */
export function useCountdown(deadlineGetter) {
  // 把 tick 引入 computed 的依赖图，让其每秒重算
  const remainingMs = computed(() => {
    // eslint-disable-next-line no-unused-expressions
    tick.value
    const deadline = parseDeadline(deadlineGetter())
    if (deadline == null) return null
    return deadline - nowMillis()
  })

  const expired = computed(() => {
    const r = remainingMs.value
    return r != null && r <= 0
  })

  /**
   * 友好展示：
   *   1h 23m 12s  / 23m 12s / 12s（剩余时）
   *   超 1h 23m / 超 23m / 超 12s（已过期）
   * 多语言由调用方决定，这里返回纯数字格式（h/m/s 用大写字母方便区分）
   */
  const label = computed(() => {
    const r = remainingMs.value
    if (r == null) return ''
    return formatDuration(Math.abs(r))
  })

  return { remainingMs, expired, label }
}

/**
 * 把毫秒数格式化成 "Xh Ym Zs" 风格。
 * - 大于 1 小时：显示 h m s
 * - 大于 1 分钟：显示 m s
 * - 否则：只显示 s
 * 单位字母固定，避免 i18n 大量配置；如果未来想本地化可以改这里。
 */
function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}
