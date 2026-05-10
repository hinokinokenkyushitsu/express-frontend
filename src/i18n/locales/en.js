export default {
  common: {
    appName: 'Campus Express Pickup',
    appSubtitle: 'Convenient pickup, mutual delivery',
    notice: 'Notice',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    refresh: 'Refresh',
    back: 'Back',
    loading: 'Loading...',
    submitting: 'Submitting...',
    saving: 'Saving...',
    processing: 'Processing...',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to log out?',
    submit: 'Submit',
    optional: 'Optional'
  },

  role: {
    user: 'User',
    courier: 'Courier',
    admin: 'Admin'
  },

  orderStatus: {
    0: 'Pending',
    1: 'In Delivery',
    2: 'Completed',
    3: 'Cancelled'
  },

  orderUrgency: {
    0: 'Standard',
    1: 'Urgent'
  },

  field: {
    name: 'Name',
    phone: 'Phone',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    avatar: 'Avatar',
    avatarUrl: 'Avatar URL',
    role: 'Role',
    createTime: 'Registered At',
    stationAddress: 'Pickup Station',
    targetAddress: 'Delivery Address',
    pickupCode: 'Pickup Code',
    amount: 'Delivery Fee',
    urgency: 'Urgency',
    courier: 'Courier',
    sender: 'Sender'
  },

  placeholder: {
    phone: 'Enter 11-digit phone number',
    password: 'Enter password',
    passwordRule: '6 to 64 characters',
    passwordAgain: 'Enter again',
    name: 'Enter your name',
    avatar: 'https://...',
    stationExample: 'e.g. Cainiao Station (North Gate)',
    targetExample: 'e.g. Dorm A-301',
    pickupCodeExample: 'e.g. 8-2-3456'
  },

  auth: {
    login: 'Log In',
    loggingIn: 'Logging in...',
    register: 'Register',
    registering: 'Registering...',
    welcome: 'Welcome Back',
    courierWelcome: 'Courier Login',
    courierLogin: 'Courier Login',
    courierPortalSubtitle: 'Take orders and complete deliveries efficiently',
    registerNew: 'Create Account',
    courierRegisterNew: 'Create Courier Account',
    courierRegister: 'Register as Courier',
    noAccount: "Don't have an account?",
    goRegister: 'Sign up',
    goCourierRegister: 'Create courier account',
    goUserRegister: 'Create user account',
    hasAccount: 'Already have an account?',
    goLogin: 'Log in',
    goCourierLogin: 'Courier login',
    goCourierLoginShort: 'Courier login',
    goUserLogin: 'User login',
    invalidPhone: 'Please enter a valid phone number',
    passwordTooShort: 'Password must be at least 6 characters',
    nameRequired: 'Please enter your name',
    passwordMismatch: 'Passwords do not match',
    notCourierAccount: 'This account is not a courier account. Please use a courier account.'
  },

  userOrders: {
    title: 'My Orders',
    publishNew: '+ New Order',
    empty: 'No orders yet, create one!',
    cancelConfirm: 'Are you sure you want to cancel this order?',
    cancelOrder: 'Cancel Order',
    cancelSuccess: 'Order cancelled'
  },

  createOrder: {
    title: 'Create Order',
    publish: 'Publish Order',
    success: 'Order published successfully',
    pickupCodeHint: 'The pickup code will be shown to the courier, please ensure it is correct',
    requireStation: 'Please enter pickup station',
    requireTarget: 'Please enter delivery address',
    requirePickupCode: 'Please enter pickup code',
    invalidAmount: 'Please enter a valid fee',
    urgencyNormalHint: 'Couriers can promise up to {max} minutes',
    urgencyUrgentHint: 'Courier must deliver within {max} min — free if late'
  },

  hall: {
    title: 'Order Hall',
    waitingCount: '{count} orders waiting',
    empty: 'No orders available right now, check back later',
    grab: 'Grab',
    grabbing: 'Grabbing...',
    grabSuccess: 'Order grabbed successfully!'
  },

  grab: {
    title: 'Promise a Delivery Time',
    maxHint: 'Max {max} minutes',
    promiseLabel: 'I commit to deliver within',
    unitMinutes: 'min',
    confirmBtn: 'Confirm & Grab',
    invalidMinutes: 'Please enter a positive number',
    exceedMax: 'Cannot exceed {max} minutes'
  },

  countdown: {
    remaining: '{time} left',
    expired: 'Overdue by {time}',
    overdueRefunded: 'Overdue (user refunded)',
    overdueBadge: 'Overdue',
    promised: 'Promised {n} min'
  },

  tasks: {
    title: 'My Tasks',
    tabActive: 'Active',
    tabHistory: 'History',
    emptyActive: 'No active tasks, head to the hall to grab one',
    emptyHistory: 'No history',
    completeConfirm: 'Confirm delivery completion?',
    completeBtn: 'Mark Delivered',
    completeSuccess: 'Order completed'
  },

  profile: {
    title: 'Profile',
    basicInfo: 'Basic Info',
    settings: 'Settings',
    language: 'Language',
    saveSuccess: 'Saved successfully',
    nameRequired: 'Name is required',
    deliveryRating: 'Delivery Reputation',
    overdueCount: 'Overdue Count',
    overdueHint: '{threshold} overdue deliveries triggers a 7-day ban',
    banned: 'You are currently banned',
    banExplain: 'You cannot grab new orders, but historical orders are still visible',
    banRemaining: '{left} left',
    banRemainingDH: '{d}d {h}h',
    banRemainingHM: '{h}h {m}m',
    banRemainingM: '{m}m'
  },

  orderCard: {
    pickup: 'From',
    deliver: 'To',
    pickupCode: 'Code'
  },

  pagination: {
    prev: 'Previous',
    next: 'Next',
    page: 'Page {current} / {total}'
  },

  error: {
    network: 'Network error',
    sessionExpired: 'Session expired, please log in again',
    requestFailed: 'Request failed'
  }
}
