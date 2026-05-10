<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/utils/toast'
import { setLocale, SUPPORTED_LOCALES } from '@/i18n'
import { tick, nowMillis, parseDeadline } from '@/utils/clock'

const auth = useAuthStore()
const toast = useToast()
const { t, locale } = useI18n()

const editing = ref(false)
const form = reactive({ name: '', avatar: '' })
const loading = ref(false)

// 超时进度阈值与后端保持一致
const OVERDUE_THRESHOLD = 5

onMounted(async () => {
  if (!auth.user) await auth.fetchProfile()
  form.name = auth.user?.name || ''
  form.avatar = auth.user?.avatar || ''
})

async function save() {
  if (!form.name.trim()) {
    toast.error(t('profile.nameRequired'))
    return
  }
  loading.value = true
  try {
    await auth.updateProfile({ name: form.name, avatar: form.avatar })
    toast.success(t('profile.saveSuccess'))
    editing.value = false
  } catch (e) {
    toast.error(e.message)
  } finally {
    loading.value = false
  }
}

function cancel() {
  form.name = auth.user?.name || ''
  form.avatar = auth.user?.avatar || ''
  editing.value = false
}

function switchLocale(code) {
  setLocale(code)
}

// 快递员超时进度（用 computed，profile 切语言或刷新都跟得上）
const overdueCount = computed(() => auth.user?.overdueCount ?? 0)

// 是否处于封禁中：banUntil > 当前服务器时间
const banRemainingMs = computed(() => {
  // 让 tick 触发重算
  // eslint-disable-next-line no-unused-expressions
  tick.value
  const banUntil = parseDeadline(auth.user?.banUntil)
  if (banUntil == null) return null
  return banUntil - nowMillis()
})

const isBanned = computed(() => banRemainingMs.value != null && banRemainingMs.value > 0)

const banLabel = computed(() => {
  if (!isBanned.value) return ''
  const totalSec = Math.floor(banRemainingMs.value / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const mins = Math.floor((totalSec % 3600) / 60)
  if (days > 0) return t('profile.banRemainingDH', { d: days, h: hours })
  if (hours > 0) return t('profile.banRemainingHM', { h: hours, m: mins })
  return t('profile.banRemainingM', { m: mins })
})
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ $t('profile.title') }}</h2>

    <!-- 头像区 -->
    <div class="card p-6 flex items-center gap-4">
      <div class="w-16 h-16 rounded-full bg-gradient-to-br from-brand-300 to-brand-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shrink-0">
        <img v-if="auth.user?.avatar" :src="auth.user.avatar" alt="avatar" class="w-full h-full object-cover" />
        <span v-else>{{ auth.user?.name?.[0] || '?' }}</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-gray-800 truncate">{{ auth.user?.name }}</div>
        <div class="text-sm text-gray-500">{{ auth.user?.phone }}</div>
        <span class="badge mt-1" :class="auth.isCourier ? 'bg-brand-100 text-brand-700' : 'bg-blue-100 text-blue-700'">
          {{ auth.isCourier ? $t('role.courier') : $t('role.user') }}
        </span>
      </div>
    </div>

    <!-- 快递员专属：信誉/封禁状态 -->
    <div v-if="auth.isCourier" class="card p-5">
      <h3 class="font-medium text-gray-800 mb-3">{{ $t('profile.deliveryRating') }}</h3>

      <!-- 封禁横幅 -->
      <div
        v-if="isBanned"
        class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 mb-4"
      >
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-red-700 text-sm">{{ $t('profile.banned') }}</div>
            <div class="text-xs text-red-600 mt-0.5">{{ $t('profile.banRemaining', { left: banLabel }) }}</div>
            <div class="text-xs text-gray-600 mt-1">{{ $t('profile.banExplain') }}</div>
          </div>
        </div>
      </div>

      <!-- 超时计数进度 -->
      <div>
        <div class="flex items-center justify-between text-sm mb-2">
          <span class="text-gray-600">{{ $t('profile.overdueCount') }}</span>
          <span
            class="font-medium"
            :class="overdueCount >= 3 ? 'text-red-600' : 'text-gray-800'"
          >
            {{ overdueCount }} / {{ OVERDUE_THRESHOLD }}
          </span>
        </div>
        <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            class="h-full transition-all"
            :class="overdueCount >= 3 ? 'bg-red-500' : 'bg-brand-500'"
            :style="{ width: Math.min(100, (overdueCount / OVERDUE_THRESHOLD) * 100) + '%' }"
          ></div>
        </div>
        <p class="text-xs text-gray-400 mt-2">
          {{ $t('profile.overdueHint', { threshold: OVERDUE_THRESHOLD }) }}
        </p>
      </div>
    </div>

    <!-- 详情 / 编辑 -->
    <div class="card p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-medium text-gray-800">{{ $t('profile.basicInfo') }}</h3>
        <button v-if="!editing" class="text-sm text-brand-600" @click="editing = true">{{ $t('common.edit') }}</button>
      </div>

      <div v-if="!editing" class="space-y-3 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-500">{{ $t('field.name') }}</span>
          <span class="text-gray-800">{{ auth.user?.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">{{ $t('field.phone') }}</span>
          <span class="text-gray-800">{{ auth.user?.phone }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">{{ $t('field.createTime') }}</span>
          <span class="text-gray-800">{{ auth.user?.createTime?.replace('T', ' ').slice(0, 16) }}</span>
        </div>
      </div>

      <div v-else class="space-y-3">
        <div>
          <label class="text-sm text-gray-600 mb-1.5 block">{{ $t('field.name') }}</label>
          <input v-model="form.name" maxlength="32" class="input-base" />
        </div>
        <div>
          <label class="text-sm text-gray-600 mb-1.5 block">
            {{ $t('field.avatarUrl') }}（{{ $t('common.optional') }}）
          </label>
          <input v-model="form.avatar" :placeholder="$t('placeholder.avatar')" class="input-base" />
        </div>
        <div class="flex gap-3 pt-2">
          <button class="btn-secondary flex-1" :disabled="loading" @click="cancel">{{ $t('common.cancel') }}</button>
          <button class="btn-primary flex-1" :disabled="loading" @click="save">
            {{ loading ? $t('common.saving') : $t('common.save') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 设置：语言切换 -->
    <div class="card p-5">
      <h3 class="font-medium text-gray-800 mb-4">{{ $t('profile.settings') }}</h3>
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">{{ $t('profile.language') }}</span>
        <div class="inline-flex bg-gray-100 rounded-lg p-1" role="group" :aria-label="$t('profile.language')">
          <button
            v-for="opt in SUPPORTED_LOCALES"
            :key="opt.code"
            class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
            :class="locale === opt.code ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-600'"
            :aria-pressed="locale === opt.code"
            @click="switchLocale(opt.code)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
