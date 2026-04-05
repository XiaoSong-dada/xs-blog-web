# 小宋博客前端

这是小宋博客的前端项目，基于 Vue 3、TypeScript 和 Vite 构建，负责博客站点展示、用户登录注册、文章阅读互动、个人中心以及后台管理等功能。

## 项目简介

前端主要面向两类场景：

- 面向访客的公开站点：首页、文章列表、文章详情、评论区、友链页、关于页。
- 面向登录用户的个人功能：基础资料维护、安全设置、文章收藏。
- 面向管理员的内容管理：文章新建与编辑、标签管理、友链管理、用户管理。

项目内置 Vditor 编辑器能力，用于后台文章创作；同时通过前端代理与后端 API 通信，适合本地开发和分离部署。

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Ant Design Vue
- Axios
- Sass
- Vditor

## 目录说明

```text
src/
	api/          接口请求封装
	components/   业务组件
	config/       运行时配置
	hook/         组合式逻辑
	layout/       页面布局
	router/       路由配置
	stores/       状态管理
	types/        类型定义
	utils/        工具函数
	views/        页面视图
```

## 环境要求

- Node.js 18 及以上
- pnpm 8 及以上

## 环境变量

项目开发时主要依赖 Vite 环境变量。可以在项目根目录创建 `.env.development` 文件，例如：

```env
VITE_API_REQUEST_MODE=direct
VITE_BACKEND_API_URL=http://localhost:8000/api
VITE_STATIC_URL=http://localhost:8000/static/
VITE_VDITOR_CDN=/vditor
VITE_SITE_NAME=小宋博客
VITE_SITE_ICP=
VITE_SITE_ICP_LINK=
VITE_GITHUB_REPO=小宋博客前端
VITE_GITHUB_REPO_URL=https://github.com/your-name/your-repo
VITE_BACKEND_BASE_URL=http://localhost:8000
VITE_BACKEND_STATIC=static
```

说明：

- `VITE_API_REQUEST_MODE` 控制接口请求模式，`direct` 表示前端直接请求后端，`proxy` 表示前端统一请求同源 `/api`。
- `VITE_BACKEND_API_URL` 在 `direct` 模式下表示后端接口基地址，建议包含 `/api` 前缀，例如 `http://localhost:8000/api`。
- `VITE_STATIC_URL` 用于拼接后端静态资源访问地址，例如头像、文章图片等。
- `VITE_VDITOR_CDN` 默认使用项目中的 `public/vditor` 目录，也可以替换成外部静态资源地址。

## 安装依赖

```bash
pnpm install
```

## 启动项目

### 本地开发

```bash
pnpm dev
```

默认会启动 Vite 开发服务器，常见访问地址为：

- 前端：http://localhost:5173
- 后端接口：http://localhost:8000

默认开发模式使用前端直连后端接口，因此需要确保后端服务已先启动并允许 `http://localhost:5173` 跨域访问。

### 打包构建

```bash
pnpm build
```

该命令会先执行 TypeScript 类型检查，再生成生产环境静态资源。

### 本地预览构建产物

```bash
pnpm preview
```

## 主要页面与功能

- 首页：展示博客入口、站点介绍与内容引导。
- 文章列表：支持文章浏览、滚动加载、关键词搜索。
- 文章详情：支持目录导航、评论、回复、浏览统计。
- 登录与注册：支持用户认证与访问控制。
- 个人中心：支持头像、昵称、邮箱等资料维护，以及密码修改、收藏管理。
- 后台管理：支持文章发布、文章编辑、标签管理、友链管理、用户管理。

## 开发联调说明

- 开发环境默认使用 `direct` 模式，axios 会直接请求 `VITE_BACKEND_API_URL`。
- 生产环境默认使用 `proxy` 模式，前端统一请求同源 `/api`，再由 1Panel 的 Nginx 反向代理到后端服务。
- 如果开发阶段仍需走 Vite 代理，可将 `VITE_API_REQUEST_MODE=proxy`，并将 `VITE_BACKEND_API_URL` 配成真实后端地址（包含 `/api` 前缀）。
- 后端默认静态资源目录为 `/static`，前端展示图片、头像、附件时需要确保后端文件服务可访问。

## 生产部署建议

- 推荐由 1Panel 的 Nginx 统一处理 HTTPS、`/`、`/api/` 和 `/static/` 的反向代理。
- 当前项目中的容器内 Nginx 只负责分发前端静态文件，不再代理接口请求。
- 如果你需要生产环境直连后端，也可以在构建时设置 `VITE_API_REQUEST_MODE=direct`，并将 `VITE_BACKEND_API_URL` 配置为完整的 HTTPS 接口地址，例如 `https://api.example.com/api`。
- 生产环境直连后端时，需要同步将前端域名加入后端 `ALLOWED_ORIGINS`，否则浏览器会因跨域策略拒绝接口请求。

## 推荐开发流程

1. 先启动后端服务、数据库和 Redis。
2. 配置前端 `.env.development`。
3. 执行 `pnpm install` 安装依赖。
4. 执行 `pnpm dev` 启动前端。
5. 打开浏览器访问前端首页进行联调。
