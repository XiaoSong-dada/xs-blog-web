import { requestHttp } from '@/utils/http';
import type { UserLoginData, IUserSearch, IUserListResponse, IRegister } from '@/types/main';
import type { ApiReposeBase, ApiResponse } from '@/types/http'
export const login = async (data: UserLoginData): Promise<ApiResponse<{ token: string }>> => {
    return requestHttp.post<{ token: string }>('/auth/login', data);
}

export const getList = async (params: IUserSearch): Promise<ApiResponse<IUserListResponse | IUserListResponse['list']>> => {
    return requestHttp.get('/users', params)
}

export const deleteUser = async (username: string): Promise<ApiReposeBase> => {
    return requestHttp.delete(`/users/${username}`)
}

export const registerUser = async (params: IRegister): Promise<ApiReposeBase> => {
    return requestHttp.post('/users/register', params)
}