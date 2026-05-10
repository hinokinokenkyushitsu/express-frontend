import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import en from './locales/en'

export const SUPPORTED_LOCALES = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en',    label: 'English' }
]

const STORAGE_KEY = 'app_locale'

/** 检测初始语言：localStorage > 浏览器语言 > 默认中文 */
function detectInitialLocale() {
  // 1. 用户曾经选过的语言
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && SUPPORTED_LOCALES.some(l => l.code === saved)) {
    return saved
  }
  // 2. 浏览器语言
  const browser = (navigator.language || 'en').toLowerCase()
  if (browser.startsWith('zh')) return 'zh-CN'
  return 'en'
}

const i18n = createI18n({
  legacy: false,                 // 使用 Composition API 模式
  globalInjection: true,         // 模板中可直接用 $t
  locale: detectInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    'zh-CN': zhCN,
    'en': en
  }
})

/**
 * 切换语言
 * - 更新 vue-i18n
 * - 持久化到 localStorage
 * - 同步 <html lang> 属性
 */
export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.some(l => l.code === locale)) return
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.setAttribute('lang', locale)
}

/** 当前语言 code */
export function getCurrentLocale() {
  return i18n.global.locale.value
}

// 启动时同步 <html lang>
document.documentElement.setAttribute('lang', i18n.global.locale.value)

export default i18n
