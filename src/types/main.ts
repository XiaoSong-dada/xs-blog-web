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