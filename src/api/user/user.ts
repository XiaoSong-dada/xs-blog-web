import { requestHttp } from '@/utils/http';
import type { UserLoginData, IUserSearch, IUserListResponse, IRegister, IUserCell, IUserUpdate, IUserPassword } from '@/types/main';
import type { ApiReposeBase, ApiResponse, ApiResponseDetail } from '@/types/http'
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

export const getUserInfo = async (): Promise<ApiResponseDetail<IUserCell>> => {
    return requestHttp.get('/users/owner/info')
}

export const updateUserInfo = async (params: IUserUpdate): Promise<ApiReposeBase> => {
    return requestHttp.put('/users/owner/info', params)
}

export const updateUserPassword = async (params: IUserPassword): Promise<ApiReposeBase> => {
    return requestHttp.put('/users/owner/password', params)
}
