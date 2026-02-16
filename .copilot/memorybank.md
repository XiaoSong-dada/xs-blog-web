# 记忆库 - 前端项目

此文件保存前端项目的持久化信息，帮助 Copilot 跨会话保持上下文连贯。

## 关键信息

- **项目名**：icu.xiaosong.blog.web
- **技术栈**：Vue 3 + TypeScript + Vite
- **UI 框架**：Ant Design Vue
- **状态管理**：Pinia
- **编辑器**：Vditor（支持 Markdown）

## 项目架构

### 目录结构
- `src/components/` - Vue 组件库（按功能分类）
- `src/hook/` - 自定义 Hooks（useBuilding、useDict、useFile 等）
- `src/layout/` - 布局组件（AppLayout、HomeLayout、AdminLayout）
- `src/router/` - 路由配置
- `src/stores/` - Pinia 状态管理（auth store 等）
- `src/utils/` - 工具函数（http、jwt、pinyin、verification 等）
- `src/views/` - 页面级组件（home、article、user、login 等）
- `src/icon/` - 页面使用的小图标(已经点赞，未点赞，评论，浏览)
### 核心模块

#### 认证系统
#### 收藏功能
 - **功能描述**：用户可以收藏/取消收藏文章，显示收藏数和状态图标（未收藏：collection.svg，已收藏：has_collection.svg）。
 - **实现细节**：
   - API：`POST /article/{id}/bookmark`（切换），`GET /article/bookmarks/list`（当前用户收藏列表）；POST 接口返回 `{bookmarked: boolean, bookmark_count: number}`。
   - 类型：`IArticle` 和 `IArticleSearchList` 添加 `bookmarked?` 和 `bookmark_count?` 字段。
   - Hook：`useArticleList` 和 `useSearchList` 提供 `toggleBookmark` 方法，支持乐观更新、登录检查和错误回滚。
   - 组件：`list.vue` 和 `search.list.vue` 根据 `bookmarked` 切换图标，绑定点击事件；新增用户侧页面 `src/views/me/bookmark.vue`，以卡片网格展示用户收藏（卡片头部为文章标题，内容为 `content_md` 前100字符）。
   - 页面路由：`/me/bookmark`（在用户中心菜单中已注册）。
- JWT 令牌管理（`src/utils/jwt.ts`）
- Auth 服务（`src/service/auth.service.ts`）
- Pinia Auth Store（`src/stores/auth.ts`）
- 登录/注册页面（`src/views/login/`）

#### API 通信
- HTTP 工具类（`src/utils/http.ts`）
- 请求锁（`src/utils/request.lock.ts`）- 防止重复请求
- 各功能 API 模块（article、user、file、link 等）

#### 编辑器
- Vditor 组件封装（`src/components/vditor/`）
- 用于文章编辑和预览

#### 工具函数
- `date.ts` - 日期处理
- `pinyin.ts` - 中文拼音转换
- `verification.ts` - 表单验证
- `concurrency.ts` - 并发控制

#### 点赞功能
- **功能描述**：用户可以对文章进行点赞/取消点赞，显示点赞数和状态图标（未点赞：like.svg，已点赞：has_like.svg）。
- **实现细节**：
  - API：`POST /article/{id}/like`，返回 `{liked: boolean, like_count: number}`。
  - 类型：`IArticle` 和 `IArticleSearchList` 添加 `liked?` 和 `like_count?` 字段。
  - Hook：`useArticleList` 和 `useSearchList` 提供 `toggleLike` 方法，支持乐观更新、登录检查和错误回滚。
  - 组件：`list.vue` 和 `search.list.vue` 根据 `liked` 切换图标，绑定点击事件。
  - 页面：`index.vue` 连接事件到 Hook。
- **技术点**：乐观更新（先本地更新，再同步服务器响应）；防重复点击；未登录提示；请求失败回滚。
- **相关文件**：
  - `src/api/article/article.ts`
  - `src/types/main.ts`
  - `src/hook/article/useArticle.ts`
  - `src/components/article/list.vue`
  - `src/components/article/search.list.vue`
  - `src/views/article/index.vue`

### 页面流程

1. **登录流程**：用户输入 → 验证 → 获取 JWT → 存储在 Cookie → 重定向首页
2. **文章查看**：首页列表 → 点击进入详情 → 可点赞/评论（需登录）
3. **文章编写**：点新建 → Vditor 编辑 → 提交到后端 → 返回列表
4. **用户管理**：个人中心 → 管理页面 → 增删改用户信息

## 编码决策

- 使用 `<script setup>` 风格减少冗余代码
- 所有 HTTP 请求统一通过 `http.ts` 工具处理（拦截器、错误处理）
- 使用 Pinia 集中管理用户认证状态
- 路由守卫保护需要登录的页面
- 使用 Ant Design Vue 提供一致的 UI 体验
- Vditor 用于富文本编辑，支持 Markdown 预览

## Hook 设计模式（新增约定）

- 列表型页面优先采用 `useHook` 分层：页面只负责展示与事件，数据获取/状态管理放在 `src/hook/**`。
- 标准返回结构：`params`、`data`、`total`、`loading`、`fetchList`、`resetParams`。
- 分页参数统一通过 `useBuildQueryParams` 转换（UI 的页码 `offset=1` 转 API 偏移量 `offset=0`），避免首条数据被跳过。
- API 参数类型按业务单独定义（如 `IBookmarkQuery`），避免复用不匹配的查询类型导致取数异常。
- 收藏页 `src/views/me/bookmark.vue` 采用该模式，实际数据逻辑在 `useBookmarkList`（`src/hook/article/useArticle.ts`）。

## 性能优化

- 路由懒加载提升首屏加载速度
- 使用 `computed` 而非方法计算属性，充分利用缓存
- 请求锁防止用户快速连续点击导致的重复请求
- 图片、静态资源存放在 `public/` 目录

## 与后端的交互

- 后端 API 基础 URL 在 `src/config/env.ts` 配置
- 所有请求自动携带 JWT 令牌（通过 axios 拦截器）
- 响应格式统一处理，错误时显示提示信息
