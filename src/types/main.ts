// /types/main.ts
import type { UploadFile } from "ant-design-vue";
import type { IPages } from "./http";

// 用户登录数据模型
export interface UserLoginData {
    username: string;
    password: string;
}

// 用户注册数据模型
export interface UserRegisterData {
    username: string;
    password: string;
    email: string;
}

// JWT 检查选项接口
export interface JwtCheckOptions {
    leewayMs?: number;           // 默认 30s
    treatNoExpAsExpired?: boolean; // 没有 exp 怎么处理
}

// 首页顶部菜单项接口
export interface HomeTopMenuItem {
    key: string;
    label: string;
    route: string;
}

// payload
export interface IUserInfo {
    username: string;
    user_id: string;
    is_admin: boolean;
}

// 显示下拉框
export interface IDropDown {
    isShow: boolean
}

// 用户下拉框
export interface IDropDownItem {
    label: string;
    key: string | number;
    route: string;
    icon?: string | null | undefined;
    before_need_driver?: boolean;
    action?: 'logout'
}

export interface IItemCompoment {
    data: IDropDownItem
}

// 用户中心菜单项接口
export interface CenterMenuItem {
    key: string;
    label: string;
    icon?: 'user' | 'article' | 'link';
    route: string
}

// 用户columns
export interface IUserCell {
    username: string;
    nick_name: string | null;
    email: string | null;
    status: string;
    is_admin: boolean;
    avatar_url: string | null;
}

// 用户搜索
export type IUserSearch = IPages<{
    username?: string;
    email?: string;
    nick_name?: string;
    is_admin?: string;
}>;

// 用户列表返回
export interface IUserListResponse {
    list: IUserCell[];
    total: number;
}

// 重置密码
export interface IResetPassword {
    username: string;
    password: string;
    isPassword: string;
}

// 文章接口
export interface IArticle {
    id: string;
    author_id: string;
    title: string;
    slug: string;
    content_md: string | null;
    view_count: number;
    created_at: string;
    updated_at: string;
    published_at: string | null;
    deleted_at: string | null;
}

export type IArticleQuery = IPages<{
    title: string | undefined;
    slug: string | undefined;
    content_md: string | undefined;
    published_at:string | undefined;
}>;

export type IArticleSearchQuery = IPages<{
    kw?: string
}>;


// 文章接口
export interface IArticleSearchList {
    id: string;
    slug: string;
    title: string;
    snippet: string;
    view_count: number;
    published_at: string | null;
    rank: number;
    hit_title: boolean;
    hit_content: boolean;
}


// 新建文章
export interface IAritcleCreate {
    title: string;
    slug: string;
    content_md: string;
    author_id?: string;
}

// 新建文章
export interface IAritcleUpdate extends IAritcleCreate {
    id: string;
}

// 文章详细信息接口
export interface IArticleDetailPropos {
    slug: string;
}

// 文章卡片用户介绍行
export interface IArticleMeta {
    published_at?: string;
}

// 创建文件上传session
export interface IUplaodSession {
    session_id: string;
    expires_at: string;
}

// 上传笔记类型
export interface IUploadGroup {
    file_array: UploadFile[];
    has_img: boolean;
}

// 上传笔记时的返回结果
export interface IUploadResult {
    uploaded: string[];
    errors: string[];
}

export interface UploadTaskOk {
    uploaded: string[];
    errors?: string[]
} 

// 下载文件返回类型
export interface IDownloadResult {
    download_url: string;
    session_id:string;
    errors:string[];
}

// 修改基本信息
export interface IUserBaseFrom extends IUserCell{
    nick_name: string;
    email: string ;
    avatar_url: string;
}

// 上传图片文件基本类型
export interface IUplaodFile {
    original_name:string;
    stored_path:string;
}

// 修改用户基本信息
export interface IUserUpdate {
    nick_name: string;
    email: string ;
    avatar_url: string;
}

// 修改密码
export interface IUserPassword {
    old_password:string;
    password:string;
}

// 注册用户类型
export interface IRegister {
    username: string;
    password: string;
    nick_name: string;
    email: string;
    code: string;
}

// 友链接口
export interface IFriendLink {
    id: string;
    name: string;
    url: string;
    description: string | null;
    log_url: string | null;
    created_at: string;
    updated_at: string;
}
export type IFriendLinkQuery = IPages<{
    name?: string;
}>;