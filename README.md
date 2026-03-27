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
VITE_BACKEND_API_URL=http://localhost:8000
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

- `VITE_BACKEND_API_URL` 用于 Vite 开发服务器代理，当前项目会将前端请求的 `/api` 转发到该地址。
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

开发模式下，前端通过 Vite 代理访问后端接口，因此需要确保后端服务已先启动。

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

- 前端接口前缀统一走 `/api`。
- Vite 代理会将 `/api` 前缀转发到 `VITE_BACKEND_API_URL`，并在转发时去掉 `/api` 前缀。
- 后端默认静态资源目录为 `/static`，前端展示图片、头像、附件时需要确保后端文件服务可访问。

## 推荐开发流程

1. 先启动后端服务、数据库和 Redis。
2. 配置前端 `.env.development`。
3. 执行 `pnpm install` 安装依赖。
4. 执行 `pnpm dev` 启动前端。
5. 打开浏览器访问前端首页进行联调。
