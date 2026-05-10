<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import expressIllustration from '@/assets/express-illustration.png'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

const isCourierPortal = computed(() => route.meta.portal === 'courier')
const form = reactive({ name: '', phone: '', password: '', confirmPassword: '' })
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  error.value = ''
  if (!form.name.trim()) return error.value = t('auth.nameRequired')
  if (!/^1[3-9]\d{9}$/.test(form.phone)) return error.value = t('auth.invalidPhone')
  if (form.password.length < 6) return error.value = t('auth.passwordTooShort')
  if (form.password !== form.confirmPassword) return error.value = t('auth.passwordMismatch')

  loading.value = true
  try {
    await auth.register({
      name: form.name,
      phone: form.phone,
      password: form.password,
      role: isCourierPortal.value ? 'COURIER' : 'USER'
    })
    // 注册成功后自动登录
    await auth.login(form.phone, form.password)
    router.replace(auth.isCourier ? '/courier/hall' : '/user/orders')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-brand-50 via-white to-amber-50 py-10">
    <div class="mb-8 text-center">
      <img
        :src="expressIllustration"
        alt="Express illustration"
        class="w-20 h-20 mx-auto object-contain"
      />
      <h1 class="mt-3 text-xl font-bold text-gray-800">
        {{ isCourierPortal ? $t('auth.courierRegisterNew') : $t('auth.registerNew') }}
      </h1>
      <p v-if="isCourierPortal" class="mt-1 text-sm text-gray-500">{{ $t('auth.courierPortalSubtitle') }}</p>
    </div>

    <div class="w-full max-w-sm card p-6">
      <div class="space-y-4">
        <div>
          <label class="text-sm text-gray-600 mb-1.5 block">{{ $t('field.name') }}</label>
          <input v-model="form.name" maxlength="32" :placeholder="$t('placeholder.name')" class="input-base" />
        </div>

        <div>
          <label class="text-sm text-gray-600 mb-1.5 block">{{ $t('field.phone') }}</label>
          <input v-model="form.phone" type="tel" maxlength="11" :placeholder="$t('placeholder.phone')" class="input-base" />
        </div>

        <div>
          <label class="text-sm text-gray-600 mb-1.5 block">{{ $t('field.password') }}</label>
          <input v-model="form.password" type="password" :placeholder="$t('placeholder.passwordRule')" class="input-base" />
        </div>

        <div>
          <label class="text-sm text-gray-600 mb-1.5 block">{{ $t('field.confirmPassword') }}</label>
          <input v-model="form.confirmPassword" type="password" :placeholder="$t('placeholder.passwordAgain')" class="input-base"
                 @keyup.enter="handleRegister" />
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <button class="btn-primary w-full" :disabled="loading" @click="handleRegister">
          {{ loading ? $t('auth.registering') : (isCourierPortal ? $t('auth.courierRegister') : $t('auth.register')) }}
        </button>
      </div>

      <div class="mt-5 text-center text-sm text-gray-500">
        {{ $t('auth.hasAccount') }}
        <router-link
          :to="isCourierPortal ? '/courier/login' : '/login'"
          class="text-brand-600 hover:underline"
        >
          {{ isCourierPortal ? $t('auth.goCourierLoginShort') : $t('auth.goLogin') }}
        </router-link>
      </div>

      <div class="mt-3 text-center text-sm">
        <router-link
          :to="isCourierPortal ? '/register' : '/courier/register'"
          class="text-gray-500 hover:text-brand-600 hover:underline"
        >
          {{ isCourierPortal ? $t('auth.goUserRegister') : $t('auth.goCourierRegister') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
