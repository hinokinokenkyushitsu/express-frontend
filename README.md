# 校园快递代取系统 · Web 前端

> 同学 A（用户端）和 同学 B（快递员端）合并实现，登录后按角色展示不同界面。

## 技术栈

- **Vue 3** + Composition API
- **Vite** 构建
- **Vue Router 4** 路由
- **Pinia** 状态管理
- **Tailwind CSS 3** 样式（橙黄色主题）
- **Axios** HTTP 客户端

## 启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 5173 端口）
npm run dev

# 3. 构建生产版本
npm run build
```

> 后端默认运行在 `http://localhost:8080`，已通过 `vite.config.js` 的 proxy 配置好。
> 如果后端端口不同，修改 `vite.config.js` 的 `server.proxy['/api'].target`。

## 测试账号

后端启动后，先调 `POST /api/auth/register` 注册账号。注册后默认角色为 `USER`。
要测试快递员端，需要直接在数据库中把对应用户的 `role` 字段改为 `COURIER`：

```sql
UPDATE users SET role = 'COURIER' WHERE phone = '13800138000';
```

## 项目结构

```
src/
├── api/                   # 后端接口封装
│   ├── auth.js            # 登录/注册/个人信息
│   └── order.js           # 订单相关 + 状态常量
├── assets/
│   └── main.css           # 全局样式 + 自定义 Tailwind 组件类
├── components/            # 通用组件
│   ├── OrderCard.vue      # 订单卡片（双端共用）
│   ├── Pagination.vue     # 分页器
│   ├── EmptyState.vue     # 空状态
│   └── Toast.vue          # 消息提示
├── router/
│   └── index.js           # 路由 + 角色权限守卫
├── stores/
│   └── auth.js            # 登录态/用户信息（Pinia）
├── utils/
│   ├── request.js         # axios 实例 + 拦截器
│   └── toast.js           # 全局 toast composable
└── views/
    ├── auth/
    │   ├── Login.vue      # 登录
    │   └── Register.vue   # 注册
    ├── common/
    │   ├── Layout.vue     # 双端共用的导航布局（顶栏 + 底栏）
    │   └── Profile.vue    # 个人中心（双端共用）
    ├── user/              # ⭐ 同学 A 负责
    │   ├── MyOrders.vue   # 我的订单
    │   └── CreateOrder.vue # 发布订单
    └── courier/           # ⭐ 同学 B 负责
        ├── Hall.vue       # 抢单大厅
        └── MyTasks.vue    # 我的任务
```

## 分工对应

### 同学 A（用户端）
- ✅ 搭建小程序框架与 UI 主题 → 我已搭好基础（Tailwind + 橙黄主题）
- ✅ 完成登录、下单表单及订单列表页 → `Login.vue`、`Register.vue`、`CreateOrder.vue`、`MyOrders.vue`
- ✅ 对接后端接口，实现数据渲染与状态展示 → `api/auth.js`、`api/order.js`

### 同学 B（快递员端）
- ✅ 完成接单大厅、任务操作及个人中心页 → `Hall.vue`、`MyTasks.vue`、`Profile.vue`
- ✅ 实现抢单、状态更新等交互逻辑与反馈 → `Hall.vue` 的抢单按钮、`MyTasks.vue` 的"确认送达"
- ✅ 统一双端视觉风格，对接后端业务接口 → 双端共用 `OrderCard`、`Layout`

## 路由设计

登录后根据 `user.role` 自动跳转：

- `USER` → `/user/orders`（我的订单）
- `COURIER` → `/courier/hall`（抢单大厅）

路由守卫会拦截越权访问（用户访问 `/courier/*` 自动跳回用户端）。

## 后端接口对接说明

### ⚠️ 已知接口适配问题

`MyTasks.vue`（快递员-我的任务）目前对接的是 `GET /api/order/my`，但后端这个接口是按 `userId` 过滤的，对于快递员视角应该按 `courier_id` 过滤。

**两种解决方式**（请同 D 沟通）：

1. **推荐**：后端在 `/api/order/my` 中根据 Token 中的 role 自动判断：
   - role=USER 时按 `user_id` 过滤
   - role=COURIER 时按 `courier_id` 过滤

2. 或新增 `GET /api/order/my-tasks` 接口专供快递员使用。

如果后端未做适配，前端 `MyTasks.vue` 上的数据会不正确。

### 后端 OrderView 数据结构

接口返回的订单分页是 `IPage<OrderView>` 而不是 `IPage<Order>`，每个 `OrderView` 包含：

```json
{
  "order":   { "id": 101, "userId": 1, "courierId": 5, "status": 1, ... },
  "user":    { "id": 1, "name": "张三", "phone": "138...", "role": "USER" },
  "courier": { "id": 5, "name": "王师傅", "phone": "139...", "role": "COURIER" }
}
```

`OrderCard` 组件的 `mode` 属性决定显示哪一方信息：
- `mode="user"`：用户视角，看快递员
- `mode="hall"`：大厅视角，看发单人姓名
- `mode="task"`：任务视角，看发单人姓名+电话（方便联系）

## UI 主题

- **品牌色**：橙黄色（Tailwind 自定义 `brand-50` ~ `brand-900`）
- **主色**：`brand-500` (#ff8514)
- **预设按钮**：`btn-primary`、`btn-secondary`、`btn-danger`
- **预设输入框**：`input-base`
- **预设卡片**：`card`
- **预设徽章**：`badge`

## 部署建议

```bash
npm run build
# 输出在 dist/ 目录，部署到 Nginx：

# nginx.conf
server {
    listen 80;
    root  /var/www/express-web/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
    }
}
```
