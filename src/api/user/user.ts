import { requestHttp } from '@/utils/http';
import type { ApiResponse, UserLoginData } from '@/types/main';

export const login = async (data: UserLoginData) => {
    return await requestHttp.request<ApiResponse<{ token: string }>>('/auth/login', {
        method: 'POST',
        data
    });
}
