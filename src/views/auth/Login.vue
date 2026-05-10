<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { SUPPORTED_LOCALES, setLocale } from '@/i18n'
import expressIllustration from '@/assets/express-illustration.png'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { t, locale } = useI18n()

const isCourierPortal = computed(() => route.meta.portal === 'courier')
const form = reactive({ phone: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    error.value = t('auth.invalidPhone')
    return
  }
  if (form.password.length < 6) {
    error.value = t('auth.passwordTooShort')
    return
  }

  loading.value = true
  try {
    await auth.login(form.phone, form.password)

    // 快递员入口只允许快递员账号进入，避免普通用户误进快递员端
    if (isCourierPortal.value && !auth.isCourier) {
      auth.logout()
      error.value = t('auth.notCourierAccount')
      return
    }

    router.replace(auth.isCourier ? '/courier/hall' : '/user/orders')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-brand-50 via-white to-amber-50">
    <!-- Language Switcher -->
    <div class="fixed right-4 top-4 z-10 flex items-center gap-2 rounded-xl border border-gray-200 bg-white/85 px-3 py-2 text-sm text-gray-600 shadow-sm backdrop-blur">
      <span aria-hidden="true">🌐</span>
      <select
        :value="locale"
        class="bg-transparent outline-none cursor-pointer"
        :aria-label="$t('profile.language')"
        @change="setLocale($event.target.value)"
      >
        <option
          v-for="item in SUPPORTED_LOCALES"
          :key="item.code"
          :value="item.code"
        >
          {{ item.label }}
        </option>
      </select>
    </div>

    <!-- Logo -->
    <div class="mb-10 text-center">
      <img
        :src="expressIllustration"
        alt="Express illustration"
        class="w-24 h-24 mx-auto object-contain"
      />
      <h1 class="mt-4 text-2xl font-bold text-gray-800">{{ $t('common.appName') }}</h1>
      <p class="mt-1 text-sm text-gray-500">
        {{ isCourierPortal ? $t('auth.courierPortalSubtitle') : $t('common.appSubtitle') }}
      </p>
    </div>

    <!-- 登录表单 -->
    <div class="w-full max-w-sm card p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-5">
        {{ isCourierPortal ? $t('auth.courierWelcome') : $t('auth.welcome') }}
      </h2>

      <div class="space-y-4">
        <div>
          <label class="text-sm text-gray-600 mb-1.5 block">{{ $t('field.phone') }}</label>
          <input
            v-model="form.phone"
            type="tel"
            maxlength="11"
            :placeholder="$t('placeholder.phone')"
            class="input-base"
            @keyup.enter="handleLogin"
          />
        </div>

        <div>
          <label class="text-sm text-gray-600 mb-1.5 block">{{ $t('field.password') }}</label>
          <input
            v-model="form.password"
            type="password"
            :placeholder="$t('placeholder.password')"
            class="input-base"
            @keyup.enter="handleLogin"
          />
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <button
          class="btn-primary w-full"
          :disabled="loading"
          @click="handleLogin"
        >
          {{ loading ? $t('auth.loggingIn') : (isCourierPortal ? $t('auth.courierLogin') : $t('auth.login')) }}
        </button>
      </div>

      <div class="mt-5 text-center text-sm text-gray-500">
        {{ $t('auth.noAccount') }}
        <router-link
          :to="isCourierPortal ? '/courier/register' : '/register'"
          class="text-brand-600 hover:underline"
        >
          {{ isCourierPortal ? $t('auth.goCourierRegister') : $t('auth.goRegister') }}
        </router-link>
      </div>

      <div class="mt-3 text-center text-sm">
        <router-link
          :to="isCourierPortal ? '/login' : '/courier/login'"
          class="text-gray-500 hover:text-brand-600 hover:underline"
        >
          {{ isCourierPortal ? $t('auth.goUserLogin') : $t('auth.goCourierLogin') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
