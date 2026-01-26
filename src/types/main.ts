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


