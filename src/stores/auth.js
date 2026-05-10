import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isCourier: (state) => state.user?.role === 'COURIER',
    isUser: (state) => state.user?.role === 'USER',
    isAdmin: (state) => state.user?.role === 'ADMIN'
  },

  actions: {
    async login(phone, password) {
      const data = await authApi.login({ phone, password })
      this.token = data.token
      localStorage.setItem('token', data.token)
      // 拿到 token 后立即获取用户信息
      await this.fetchProfile()
    },

    async register(payload) {
      await authApi.register(payload)
    },

    async fetchProfile() {
      const user = await authApi.getProfile()
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
      return user
    },

    async updateProfile(payload) {
      await authApi.updateProfile(payload)
      await this.fetchProfile()
    },

    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
