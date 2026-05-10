import request from '@/utils/request'

export const authApi = {
  /** 登录 */
  login(data) {
    return request.post('/auth/login', data)
  },

  /** 注册 */
  register(data) {
    return request.post('/auth/register', data)
  },

  /** 获取个人信息 */
  getProfile() {
    return request.get('/user/profile')
  },

  /** 更新个人信息 */
  updateProfile(data) {
    return request.patch('/user/profile', data)
  }
}
