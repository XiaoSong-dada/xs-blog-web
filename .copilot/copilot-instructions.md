# Contoso Companions - 前端 Copilot 指令

## 项目概述

- **项目名**：Contoso Companions Web（博客系统前端）
- **框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **主要页面/功能**：
  - 首页：热门文章展示
  - 文章详情：文章内容展示、点赞、评论
  - 写文章：编辑器（使用 Vditor）
  - 用户系统：登录、注册、个人中心
  - 链接页：友情链接管理
  - 管理后台：用户、文章等管理界面

## 技术栈

```
前端框架：Vue 3 + TypeScript 5.9
构建工具：Vite 7
UI 框架：Ant Design Vue 4.2
状态管理：Pinia 3
路由：Vue Router 4
HTTP 客户端：Axios
编辑器：Vditor（Markdown 富文本编辑）
样式：SASS
其他工具：date-fns (日期处理)、js-cookie (Cookie 操作)、jwt-decode (JWT 解析)、pinyin-pro (拼音处理)
```

## 编码规范

1. **TypeScript 风格**：
   - 使用严格模式（strict: true）
   - 所有组件和函数必须有完整的类型注解
   - 避免使用 `any`，优先使用具体类型或泛型

2. **Vue 3 + Composition API**：
   - 优先使用 Composition API（`<script setup>`）
   - 使用 `ref` 和 `reactive` 管理组件状态
   - 自定义 hooks 放在 `src/hook/` 目录

3. **组件结构**：
   - 组件放在 `src/components/` 下，按功能分类（article、user、header 等）
   - 单文件组件（.vue）使用清晰的命名
   - Props、Emits 必须有类型定义和文档注释

4. **状态管理**（Pinia）：
   - Store 定义在 `src/stores/`，使用 Composition API 风格
   - 单一职责原则：每个 store 对应一个业务模块
   - State、Getters、Actions 要有清晰的命名和注释

5. **路由设计**：
   - 路由定义在 `src/router/routes.ts`
   - 使用懒加载组件优化性能
   - 路由元信息（`meta`）用于权限验证和页面标题

6. **API 集成**：
   - 所有 HTTP 请求通过 `src/utils/http.ts` 工具类
   - 使用 `src/api/` 目录组织 API 接口（article、user、link 等）
   - 请求拦截器统一处理 JWT 令牌
   - 响应拦截器统一处理错误

7. **样式**：
   - 使用 SCSS 预处理器，遵循 BEM 命名规范
   - 全局样式在 `src/style/` 下
   - 组件私有样式放在 .vue 文件的 `<style scoped>`
   - 使用 CSS 变量定义主题颜色

8. **富文本编辑**：
   - 使用 Vditor 组件处理 Markdown 编辑（在 `src/components/vditor/`）
   - 支持代码高亮、表格、公式等

9. **认证与权限**：
   - JWT 令牌存储在 Cookie（`js-cookie`）中
   - 使用 `jwt-decode` 解析令牌获取用户信息
   - Auth 服务在 `src/service/auth.service.ts` 中
   - 路由守卫处理未登录用户重定向

10. **性能优化**：
    - 使用 `<script setup>` 减少代码量
    - 组件按需加载
    - 图片资源放在 `public/` 目录
    - 避免在模板中执行复杂计算，使用 computed

## 测试与构建

- 开发：`pnpm dev` （Vite 开发服务器）
- 构建：`pnpm build` （类型检查 + Vite 打包）
- 预览：`pnpm preview` （本地预览生产构建）

## 浏览器兼容

- 目标：现代浏览器（Chrome、Firefox、Safari、Edge 最新版）
