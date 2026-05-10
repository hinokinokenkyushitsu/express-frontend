<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import Toast from '@/components/Toast.vue'
import { setToast } from '@/utils/toast'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { t } = useI18n()
const toastRef = ref(null)

onMounted(() => {
  setToast(toastRef.value)
})

// 根据角色生成底部导航（computed 保证语言切换时实时更新）
const navItems = computed(() => {
  if (auth.isCourier) {
    return [
      { path: '/courier/hall',    label: t('hall.title'),     icon: 'hall' },
      { path: '/courier/tasks',   label: t('tasks.title'),    icon: 'task' },
      { path: '/courier/profile', label: t('profile.title'),  icon: 'user' }
    ]
  }
  return [
    { path: '/user/orders',  label: t('userOrders.title'),  icon: 'task' },
    { path: '/user/create',  label: t('createOrder.title'), icon: 'plus' },
    { path: '/user/profile', label: t('profile.title'),     icon: 'user' }
  ]
})

function logout() {
  auth.logout()
  router.replace('/login')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- 顶部 Header -->
    <header class="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold">
            快
          </div>
          <span class="font-semibold text-gray-800">{{ $t('common.appName') }}</span>
          <span v-if="auth.isCourier" class="badge bg-brand-100 text-brand-700 ml-1">{{ $t('role.courier') }}</span>
          <span v-else class="badge bg-blue-100 text-blue-700 ml-1">{{ $t('role.user') }}</span>
        </div>
        <button class="text-sm text-gray-500 hover:text-brand-600 transition" @click="logout">
          {{ $t('common.logout') }}
        </button>
      </div>
    </header>

    <!-- 主体 -->
    <main class="flex-1 max-w-2xl w-full mx-auto px-4 py-4 pb-24">
      <router-view />
    </main>

    <!-- 底部 Tab -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30">
      <div class="max-w-2xl mx-auto grid grid-cols-3">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center py-2.5 transition-colors"
          :class="route.path === item.path ? 'text-brand-600' : 'text-gray-400'"
        >
          <!-- 图标 -->
          <svg v-if="item.icon === 'hall'"  class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7l9-4 9 4M4 10v10h16V10M9 21V13h6v8"/></svg>
          <svg v-if="item.icon === 'task'"  class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          <svg v-if="item.icon === 'plus'"  class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <svg v-if="item.icon === 'user'"  class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span class="text-xs mt-0.5">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>

    <Toast ref="toastRef" />
  </div>
</template>
