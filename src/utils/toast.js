import { ref } from 'vue'

// 全局共享一个 toast 实例
const toastRef = ref(null)

export function setToast(instance) {
  toastRef.value = instance
}

export function useToast() {
  return {
    info:    (msg) => toastRef.value?.show(msg, 'info'),
    success: (msg) => toastRef.value?.show(msg, 'success'),
    error:   (msg) => toastRef.value?.show(msg, 'error')
  }
}
