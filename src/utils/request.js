import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import i18n from '@/i18n'
import { syncServerTime } from '@/utils/clock'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截：自动带上 Token + 当前语言
request.interceptors.request.use(config => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  // 让后端根据当前语言返回对应的错误消息
  config.headers['Accept-Language'] = i18n.global.locale.value
  return config
})

// 响应拦截：统一处理后端 { code, msg, data, serverTime } 格式
request.interceptors.response.use(
  response => {
    const { code, msg, data, serverTime } = response.data
    // 不管成功失败，都用响应里的 serverTime 校准时钟（保持倒计时准确）
    if (serverTime) syncServerTime(serverTime)

    if (code === 200) {
      return data
    }
    // 业务错误（非 200），抛出错误让调用方处理
    return Promise.reject(new Error(msg || i18n.global.t('error.requestFailed')))
  },
  error => {
    // 错误响应也尝试同步一次时钟
    const serverTime = error.response?.data?.serverTime
    if (serverTime) syncServerTime(serverTime)

    if (error.response?.status === 401) {
      // Token 失效：清空登录态并跳转登录页
      const auth = useAuthStore()
      auth.logout()
      // 直接 window.location 而不是 router 是为了避免循环依赖
      if (location.pathname !== '/login') {
        location.href = '/login'
      }
      return Promise.reject(new Error(i18n.global.t('error.sessionExpired')))
    }
    return Promise.reject(new Error(error.response?.data?.msg || error.message || i18n.global.t('error.network')))
  }
)

export default request
