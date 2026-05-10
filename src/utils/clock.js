/**
 * 全局时钟 / 倒计时服务
 *
 * 设计要点：
 *   1. 全局只有一个 setInterval（1s 一次），所有倒计时共享。
 *      避免一个列表里 20 个 OrderCard 各自起 timer 把页面拖慢。
 *   2. 用"服务器时间偏移"校准：response 拦截器把每次后端响应的 serverTime
 *      喂进来，本服务保存 (serverTime - Date.now()) 作为偏移量。
 *      之后调用 nowMillis() 总返回服务器视角下的"当前时间"。
 *      这样即使用户改本地时钟（甚至来自不同时区的设备），倒计时也准确。
 *   3. 暴露的 reactive `tick` ref 每秒变化一次，组件用 computed 监听它
 *      就能自然触发重渲染。
 */
import { ref } from 'vue'

/** 服务器与本地的时间差（毫秒）：serverNow - localNow */
let serverOffset = 0

/** 每秒自增的"心跳"。组件里用 computed 引用它，倒计时就会跟着重算。 */
export const tick = ref(0)

let timerId = null

/** 启动全局心跳（main.js 调一次） */
export function startClock() {
  if (timerId) return
  timerId = setInterval(() => {
    tick.value++
  }, 1000)
}

/**
 * 用一次后端响应的 serverTime 校准时钟。
 * @param {string} serverTimeIso ISO-like 字符串，例如 "2026-05-09T12:34:56" 或带毫秒
 */
export function syncServerTime(serverTimeIso) {
  if (!serverTimeIso) return
  // 后端 LocalDateTime 序列化没有时区信息，按本地时区解析即可
  // （前端和服务端都在中国时区时正确；跨时区部署时后端应改返回 ISO with offset）
  const parsed = Date.parse(serverTimeIso)
  if (Number.isNaN(parsed)) return
  serverOffset = parsed - Date.now()
}

/** 拿到"服务器视角"的当前时间戳（毫秒） */
export function nowMillis() {
  return Date.now() + serverOffset
}

/**
 * 把一个 ISO 时间字符串解析为毫秒时间戳；解析失败返回 null。
 * 提供给倒计时计算使用。
 */
export function parseDeadline(iso) {
  if (!iso) return null
  const t = Date.parse(iso)
  return Number.isNaN(t) ? null : t
}
