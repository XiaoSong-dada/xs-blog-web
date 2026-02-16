
import { requestHttp } from '@/utils/http';
import type { IFriendLink, IFriendLinkQuery, IFriendLinkForm } from '@/types/main';
import type { ApiReposeBase, ApiResponse } from '@/types/http'

export const getList = async (params: IFriendLinkQuery): Promise<ApiResponse<IFriendLink[]>> => {
    return requestHttp.get('/friend_link', params)
}
export const getDetail = async (id: string): Promise<ApiResponse<IFriendLink>> => {
    return requestHttp.get(`/friend_link/${id}`)
}

export const addFriendLink = async (params: IFriendLinkForm): Promise<ApiReposeBase> => {
    return requestHttp.post('/friend_link', params)
}
export const updateFriendLink = async (params: IFriendLinkForm): Promise<ApiReposeBase> => {
    return requestHttp.put('/friend_link', params)
}
export const deleteFriendLink = async (id: string): Promise<ApiReposeBase> => {
    return requestHttp.delete(`/friend_link/${id}`)
}

export const getPublishList = async (): Promise<ApiResponse<IFriendLink[]>> => {
    return requestHttp.get('/friend_link/publish/links')
}
