import { requestHttp } from '@/utils/http';
import type { IUserSearch, IArticle } from '@/types/main';
import type { ApiResponse } from '@/types/http'

export const getList = async (params: IUserSearch): Promise<ApiResponse<IArticle[]>> => {
    return requestHttp.get('/article', params)
}

export const getDetailBySulg = async (sulg: string): Promise<ApiResponse<IArticle>> => {
    return requestHttp.delete(`/article/${sulg}`)
}
