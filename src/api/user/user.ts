import { requestHttp } from '@/utils/http';
import type { ApiResponse, UserLoginData } from '@/types/main';
import AuthService from '@/service/auth_service';

export const login = async (data: UserLoginData): Promise<ApiResponse<{ token: string }>> =>  {
    const response = await requestHttp.request<{ token: string }>('/auth/login', {
        method: 'POST',
        data
    });

    console.log(response);
    
    if (response.code === 200 && response.data?.token) {
        AuthService.setToken(response.data.token);
    }

    return response;
}
