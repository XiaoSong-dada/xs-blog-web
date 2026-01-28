// /types/main.ts

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

// 定义 API 响应数据类型
export interface ApiResponse<T> {
    code: number;
    msg: string;
    data?: T;
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
    email: string | null | undefined;
    status: string;
    is_admin: boolean;
    avatar_url: string | null | undefined;
    nick_name: string | null | undefined;
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
    icon: 'user' | 'article';
    route: string
}
