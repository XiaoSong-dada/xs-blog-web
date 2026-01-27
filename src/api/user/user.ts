import { requestHttp } from '@/utils/http';
import type { ApiResponse, UserLoginData } from '@/types/main';
export const login = async (data: UserLoginData): Promise<ApiResponse<{ token: string }>> => {
    const response = await requestHttp.request<{ token: string }>('/auth/login', {
        method: 'POST',
        data
    });
    return response;
}
