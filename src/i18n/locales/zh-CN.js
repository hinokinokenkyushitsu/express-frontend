export default {
  // 通用
  common: {
    appName: '校园快递代取',
    appSubtitle: '便捷取件，互助派送',
    notice: '提示',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    edit: '编辑',
    refresh: '刷新',
    back: '返回',
    loading: '加载中...',
    submitting: '提交中...',
    saving: '保存中...',
    processing: '处理中...',
    logout: '退出',
    logoutConfirm: '确定要退出登录吗？',
    submit: '提交',
    optional: '可选'
  },

  // 角色
  role: {
    user: '用户',
    courier: '快递员',
    admin: '管理员'
  },

  // 订单状态
  orderStatus: {
    0: '待抢单',
    1: '配送中',
    2: '已完成',
    3: '已取消'
  },

  // 订单紧急度
  orderUrgency: {
    0: '普通',
    1: '紧急'
  },

  // 字段标签
  field: {
    name: '姓名',
    phone: '手机号',
    password: '密码',
    confirmPassword: '确认密码',
    avatar: '头像',
    avatarUrl: '头像 URL',
    role: '角色',
    createTime: '注册时间',
    stationAddress: '快递站地址',
    targetAddress: '配送目标地址',
    pickupCode: '取件码',
    amount: '代取费用',
    urgency: '紧急程度',
    courier: '快递员',
    sender: '发单人'
  },

  // 占位符
  placeholder: {
    phone: '请输入 11 位手机号',
    password: '请输入密码',
    passwordRule: '6~64 位',
    passwordAgain: '再输一次',
    name: '请输入姓名',
    avatar: 'https://...',
    stationExample: '例如：菜鸟驿站(北门店)',
    targetExample: '例如：宿舍楼A-301',
    pickupCodeExample: '例如：8-2-3456'
  },

  // 登录注册
  auth: {
    login: '登 录',
    loggingIn: '登录中...',
    register: '注 册',
    registering: '注册中...',
    welcome: '欢迎登录',
    courierWelcome: '快递员登录',
    courierLogin: '快递员登录',
    courierPortalSubtitle: '接单配送，高效完成任务',
    registerNew: '注册新账号',
    courierRegisterNew: '注册快递员账号',
    courierRegister: '注册快递员',
    noAccount: '还没有账号？',
    goRegister: '立即注册',
    goCourierRegister: '注册快递员账号',
    goUserRegister: '注册用户账号',
    hasAccount: '已有账号？',
    goLogin: '去登录',
    goCourierLogin: '我是快递员，去快递员登录',
    goCourierLoginShort: '去快递员登录',
    goUserLogin: '我是用户，去用户登录',
    invalidPhone: '请输入正确的手机号',
    passwordTooShort: '密码至少 6 位',
    nameRequired: '请输入姓名',
    passwordMismatch: '两次输入的密码不一致',
    notCourierAccount: '该账号不是快递员账号，请使用快递员账号登录'
  },

  // 用户端 - 我的订单
  userOrders: {
    title: '我的订单',
    publishNew: '+ 发布新订单',
    empty: '还没有订单，去发布一个吧',
    cancelConfirm: '确定要取消该订单吗？',
    cancelOrder: '取消订单',
    cancelSuccess: '订单已取消'
  },

  // 用户端 - 创建订单
  createOrder: {
    title: '发布订单',
    publish: '发布订单',
    success: '订单发布成功',
    pickupCodeHint: '取件码会显示给快递员，请确保正确',
    requireStation: '请填写快递站地址',
    requireTarget: '请填写配送地址',
    requirePickupCode: '请填写取件码',
    invalidAmount: '请输入有效的费用',
    urgencyNormalHint: '快递员可承诺最长 {max} 分钟送达',
    urgencyUrgentHint: '快递员需在 {max} 分钟内送达，超时免单'
  },

  // 快递员端 - 大厅
  hall: {
    title: '抢单大厅',
    waitingCount: '共 {count} 个待抢订单',
    empty: '当前没有待抢订单，稍后再看',
    grab: '抢单',
    grabbing: '抢单中...',
    grabSuccess: '抢单成功！'
  },

  // 抢单弹窗
  grab: {
    title: '承诺送达时间',
    maxHint: '最多承诺 {max} 分钟',
    promiseLabel: '我承诺在多少分钟内送达',
    unitMinutes: '分钟',
    confirmBtn: '确认抢单',
    invalidMinutes: '请输入大于 0 的分钟数',
    exceedMax: '不能超过 {max} 分钟'
  },

  // 倒计时（订单卡片）
  countdown: {
    remaining: '剩余 {time}',
    expired: '已超时 {time}',
    overdueRefunded: '已超时（用户免单）',
    overdueBadge: '已超时',
    promised: '承诺 {n} 分钟'
  },

  // 快递员端 - 我的任务
  tasks: {
    title: '我的任务',
    tabActive: '配送中',
    tabHistory: '历史记录',
    emptyActive: '没有配送中的任务，去大厅抢单吧',
    emptyHistory: '暂无历史记录',
    completeConfirm: '确认配送完成？',
    completeBtn: '确认送达',
    completeSuccess: '订单已完成'
  },

  // 个人中心
  profile: {
    title: '个人中心',
    basicInfo: '基本信息',
    settings: '设置',
    language: '语言',
    saveSuccess: '保存成功',
    nameRequired: '姓名不能为空',
    deliveryRating: '配送信誉',
    overdueCount: '累计超时',
    overdueHint: '累计超时达到 {threshold} 次将被封禁 7 天',
    banned: '当前处于封禁中',
    banExplain: '封禁期间无法抢新单，可继续查看历史订单',
    banRemaining: '剩余 {left}',
    banRemainingDH: '{d} 天 {h} 小时',
    banRemainingHM: '{h} 小时 {m} 分钟',
    banRemainingM: '{m} 分钟'
  },

  // 订单卡片
  orderCard: {
    pickup: '取件',
    deliver: '送达',
    pickupCode: '取件码'
  },

  // 分页
  pagination: {
    prev: '上一页',
    next: '下一页',
    page: '第 {current} / {total} 页'
  },

  // 错误（前端兜底，主要用后端返回的消息）
  error: {
    network: '网络错误',
    sessionExpired: '登录已过期，请重新登录',
    requestFailed: '请求失败'
  }
}
