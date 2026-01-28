import { requestHttp } from '@/utils/http';
import type { ApiResponse, UserLoginData, IUserSearch, IUserCell } from '@/types/main';
export const login = async (data: UserLoginData): Promise<ApiResponse<{ token: string }>> => {
    return requestHttp.post<{ token: string }>('/auth/login', data);
}

export const getList = async (params: IUserSearch):Promise<ApiResponse<IUserCell[]>> => {
    return requestHttp.get('/users', params)
}