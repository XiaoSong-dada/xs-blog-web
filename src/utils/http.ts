import axios, {
    type AxiosInstance,
    type AxiosError,
    type AxiosRequestConfig,
    type AxiosResponse,
    AxiosHeaders
} from 'axios';
import { message } from 'ant-design-vue';
import { config as local_config } from '@/config/local.env';
import { AuthService } from '@/service/auth.service';

// 数据返回的接口
interface Result {
    code: number;
    message: string;
}

interface ResultData<T = any> extends Result {
    data?: T;
}


// 使用常量对象替代枚举
const RequestEnums = {
    TIMEOUT: 20000,
    OVERDUE: 600,  // 登录失效
    FAIL: 999,     // 请求失败
    SUCCESS: 200,  // 请求成功
    CREATED: 201
} as const;

const config = {
    baseURL: local_config.PROXY_NAME,
    timeout: local_config.TIMEOUT,
    withCredentials: true
};

class RequestHttp {
    service: AxiosInstance;

    public constructor(config: AxiosRequestConfig) {
        this.service = axios.create(config);

        /** 
         * 请求拦截器
         * 客户端发送请求 -> [请求拦截器] -> 服务器
         */
        this.service.interceptors.request.use(
            (conf) => {
                const token = AuthService.getToken();
                if (token && !AuthService.isTokenExpired(token)) {
                    const headers = AxiosHeaders.from(conf.headers || {});
                    headers.set('Authorization', `Bearer ${token}`);
                    conf.headers = headers;
                } else {
                    AuthService.clearToken();
                }
                return conf;
            },
            (error) => {
                message.error('请求失败，请稍后重试');
                return Promise.reject(error);
            }
        );

        /** 
         * 响应拦截器
         * 服务器响应 -> [响应拦截器] -> 客户端
         */
        this.service.interceptors.response.use(
            (response: AxiosResponse) => {

                const rt = response.config.responseType;
                if (rt === 'blob' || rt === 'arraybuffer') {
                    return response;
                }


                const { data } = response; // 提取response的data部分

                if (![RequestEnums.SUCCESS, RequestEnums.CREATED].includes(data.code)) {
                    // 如果请求失败，统一弹出错误提示
                    message.error(data.message || '请求失败');
                    return Promise.reject(data.message || '请求失败');
                }
                return response
            },
            (error: AxiosError<Result>) => {
                // 根据错误类型做相应处理
                if (error.response) {
                    // 服务器响应失败
                    const status = error.response.status;
                    const msg = error.response.data?.message ?? error.message;

                    if (status === 401) {
                        AuthService.clearToken();
                        // router.push('/login');
                        message.error('登录已过期，请重新登录');
                    } else if (status === 500) {
                        message.error('服务器错误，请稍后重试');
                    } else {
                        message.error(`请求错误：${msg}`);
                    }
                } else if (error.request) {
                    // 请求没有响应
                    message.error('网络请求失败，请检查网络连接');
                } else {
                    // 其他错误
                    message.error('请求失败，请稍后重试');
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * 通用的请求方法
     * @param url 请求地址
     * @param config 请求配置
     * @returns 响应结果
     */
    public async request<T>(url: string, config: AxiosRequestConfig = {}): Promise<ResultData<T>> {
        try {
            const response = await this.service.request<T>({ url, ...config });
            // 提取返回的 data 部分并返回 ResultData 类型
            return response.data as ResultData<T>;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 简单的重试机制
     * @param url 请求地址
     * @param retries 重试次数
     * @param config 请求配置
     */
    public async retryRequest<T>(url: string, retries: number = 3, config: AxiosRequestConfig = {}): Promise<ResultData<T>> {
        let lastError: any;
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await this.request<T>(url, config);
                return response;
            } catch (error) {
                lastError = error;
                if (attempt < retries) {
                    console.log(`重试第 ${attempt} 次...`);
                }
            }
        }
        throw lastError;
    }

    public async get<T, P = Record<string, any>>(url: string, params?: P): Promise<ResultData<T>> {
        return this.request<T>(url, { method: 'GET', params })
    }

    public async post<T, D = any>(url: string, data?: D): Promise<ResultData<T>> {
        return this.request<T>(url, { method: 'POST', data })
    }

    public async put<T, D = any>(url: string, data?: D): Promise<ResultData<T>> {
        return this.request<T>(url, { method: 'PUT', data })
    }

    public async delete<T, P = Record<string, any>>(url: string, params?: P): Promise<ResultData<T>> {
        return this.request<T>(url, { method: 'DELETE', params })
    }
    public async download(url: string): Promise<Blob> {
        const res = await this.service.request<Blob>({
            url,
            method: 'GET',
            responseType: 'blob',
        });
        return res.data;
    }

}

const requestHttp = new RequestHttp(config);

export { requestHttp };
