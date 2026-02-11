
import { requestHttp } from '@/utils/http';
import type { UserLoginData, IUserSearch, IUserListResponse, IRegister, IUserCell, IUserUpdate, IUserPassword, IFriendLink } from '@/types/main';
import type { ApiReposeBase, ApiResponse, ApiResponseDetail } from '@/types/http'

export const getList = async (params: IUserSearch): Promise<ApiResponse<IFriendLink[]>> => {
    return requestHttp.get('/friend_link', params)
}
