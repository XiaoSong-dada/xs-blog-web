import { requestHttp } from '@/utils/http';
import type { ApiResponse, UserLoginData, IUserSearch, IUserListResponse } from '@/types/main';
export const login = async (data: UserLoginData): Promise<ApiResponse<{ token: string }>> => {
    return requestHttp.post<{ token: string }>('/auth/login', data);
}

export const getList = async (params: IUserSearch):Promise<ApiResponse<IUserListResponse | IUserListResponse['list']>> => {
    return requestHttp.get('/users', params)
}
