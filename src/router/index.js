import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // 启动页：根据登录态自动跳转
  {
    path: '/',
    redirect: () => {
      const auth = useAuthStore()
      if (!auth.isLoggedIn) return '/login'
      return auth.isCourier ? '/courier/hall' : '/user/orders'
    }
  },

  // 公共：登录、注册
  { path: '/login',    component: () => import('@/views/auth/Login.vue'),    meta: { public: true, portal: 'user' } },
  { path: '/register', component: () => import('@/views/auth/Register.vue'), meta: { public: true, portal: 'user' } },
  { path: '/courier/login', component: () => import('@/views/auth/Login.vue'), meta: { public: true, portal: 'courier' } },
  { path: '/courier/register', component: () => import('@/views/auth/Register.vue'), meta: { public: true, portal: 'courier' } },

  // 用户端（同学 A 负责）
  {
    path: '/user',
    component: () => import('@/views/common/Layout.vue'),
    meta: { roles: ['USER', 'ADMIN'] },
    children: [
      { path: 'orders', component: () => import('@/views/user/MyOrders.vue') },
      { path: 'create', component: () => import('@/views/user/CreateOrder.vue') },
      { path: 'profile', component: () => import('@/views/common/Profile.vue') }
    ]
  },

  // 快递员端（同学 B 负责）
  {
    path: '/courier',
    component: () => import('@/views/common/Layout.vue'),
    meta: { roles: ['COURIER', 'ADMIN'] },
    children: [
      { path: 'hall',   component: () => import('@/views/courier/Hall.vue') },
      { path: 'tasks',  component: () => import('@/views/courier/MyTasks.vue') },
      { path: 'profile', component: () => import('@/views/common/Profile.vue') }
    ]
  },

  // 兜底
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局路由守卫：登录态 + 角色权限
router.beforeEach((to) => {
  const auth = useAuthStore()

  // 公共页面（登录/注册）：已登录则跳转到对应主页
  if (to.meta.public) {
    if (auth.isLoggedIn) {
      return auth.isCourier ? '/courier/hall' : '/user/orders'
    }
    return true
  }

  // 需要登录
  if (!auth.isLoggedIn) {
    return '/login'
  }

  // 角色校验
  if (to.meta.roles && !to.meta.roles.includes(auth.user?.role)) {
    return auth.isCourier ? '/courier/hall' : '/user/orders'
  }

  return true
})

export default router
