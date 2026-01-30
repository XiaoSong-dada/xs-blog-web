
// 通用消息弹窗
export interface ApiReposeBase {
    code: number;
    message: string;
}

// 分页搜索
export interface IPages {
    limit?: number;
    offset?: number;
}


// 定义 API 响应数据类型
export interface ApiResponse<T> extends ApiReposeBase {
    data?: T;
    total?: number;
}
