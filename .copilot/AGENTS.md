# 前端工作规范 (icu.xiaosong.blog.web)
> 本文件定义了 AI 助手（GitHub Copilot / 其他 Agent）在本项目中的行为规范、编码约定与禁止事项。
> 每次开始任务前必须阅读本文件与 `memorybank.md`。
## 项目概览

- **框架：** Vue 3 + TypeScript
- **构建工具：** Vite
- **状态管理：** Pinia
- **路由：** Vue Router
- **UI 组件库：** Ant Design Vue
- **HTTP 客户端：** Axios（封装于 `src/utils/http.ts`）
- **样式：** SCSS，全局变量通过 `vite.config.ts` 自动注入

---

## 目录结构约定

```
src/
  api/          # 按资源分组的 API 调用函数（如 api/tag/tag.ts）
  assets/       # 静态资源（图标等）
  components/   # 可复用组件，按功能分组
  config/       # 本地环境配置（local.env.ts）
  constants/    # 常量定义（菜单项等）
  hook/         # 组合式函数（useXxx），按功能分组
  layout/       # 页面布局组件
  router/       # 路由配置（routes.ts + main.ts）
  service/      # 纯逻辑服务类（如 AuthService）
  stores/       # Pinia Store
  style/        # 全局 SCSS 样式
  types/        # TypeScript 类型定义（main.ts、http.ts 等）
  ui/           # 通用 UI 工具组件（菜单、状态等）
  utils/        # 工具函数（http、date、jwt 等）
  views/        # 页面级组件，按路由分组
```

---

## API 层规范

- 每个资源对应独立目录，如 `src/api/tag/tag.ts`。
- 函数直接使用 `requestHttp`（`src/utils/http.ts` 导出），返回 `Promise<ApiResponse<T>>` 或 `Promise<ApiReposeBase>`。
- 类型从 `@/types/main` 和 `@/types/http` 导入。

```typescript
// 示例：src/api/tag/tag.ts
import { requestHttp } from '@/utils/http';
import type { ITag, ITagForm } from '@/types/main';
import type { ApiReposeBase, ApiResponse } from '@/types/http';

export const getTagList = async (): Promise<ApiResponse<ITag[]>> => {
    return requestHttp.get('/tag', {});
};

export const addTag = async (params: ITagForm): Promise<ApiReposeBase> => {
    return requestHttp.post('/tag', params);
};
```

---

## Hook（组合式函数）规范

- 放在 `src/hook/` 下，按功能子目录分组（如 `hook/article/useArticle.ts`）。
- 命名以 `use` 开头，每个 hook 聚焦单一职责。
- 内部使用 `ref`/`reactive`/`computed`，状态不跨组件共享时优先用 hook，否则用 Pinia Store。

---

## 类型定义规范

- 所有共用接口/类型放在 `src/types/main.ts`；HTTP 相关类型放 `src/types/http.ts`。
- 接口命名以 `I` 开头（如 `ITag`、`IArticle`）。
- 表单类型以 `Form` 结尾（如 `ITagForm`），查询参数类型以 `Query` 结尾（如 `ITagQuery`）。

---

## 路由规范

路由在 `src/router/routes.ts` 中集中定义，分三类：

| 类别 | 路径前缀 | 备注 |
|------|---------|------|
| 公开页面 | `/` | 无需认证 |
| 管理后台 | `/admin` | `requiresAuth: true, requiresAdmin: true` |
| 用户中心 | `/me` | `requiresAuth: true` |

- 非首页视图一律使用动态导入（`() => import(...)`）实现路由级懒加载。
- 页面组件放 `src/views/<模块>/index.vue`（列表）或 `detail.vue`（详情）。

---

## 认证规范

- Token 通过 `AuthService`（`src/service/auth.service.ts`）统一管理。
- Token 持久化到 Cookie（key: `blog_token`，过期 1 天，`secure + SameSite:Strict`）。
- Axios 请求拦截器自动在 Header 中附加 `Authorization: Bearer <token>`；Token 过期时自动清除。
- 在组件/Hook 中判断登录状态用 `AuthService.isLogin()`，判断管理员用 `AuthService.isAdmin()`。

---

## 样式规范

- 全局 SCSS 文件（`default.scss`、`flex.scss`、`layout.scss`、`variable.scss`）由 Vite 自动注入，**组件内无需 `@import`**。
- 组件级样式写在 `<style scoped lang="scss">` 中。
- 全局变量（颜色、间距等）定义在 `src/style/variable.scss`。

---

## 环境配置

- 运行时环境变量通过 `src/config/local.env.ts` 中的 `config` 对象统一访问，不要在组件中直接使用 `import.meta.env`。
- Vite Dev Server 将 `/api/*` 代理到 `VITE_BACKEND_API_URL`，前端 API 调用统一走 `/api` 前缀。

---

## 常用命令

```bash
pnpm install        # 安装依赖
pnpm dev            # 启动开发服务器
pnpm build          # 生产构建
```
