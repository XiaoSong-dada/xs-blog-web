import { requestHttp } from '@/utils/http';
import type { IArticleQuery, IArticle, IAritcleCreate,IAritcleUpdate } from '@/types/main';
import type { ApiResponse, ApiReposeBase } from '@/types/http'

export const getList = async (params: IArticleQuery): Promise<ApiResponse<IArticle[]>> => {
    return requestHttp.get('/article', params)
}

export const getPublishList = async (params: IArticleQuery): Promise<ApiResponse<IArticle[]>> => {
    return requestHttp.get('/publish', params)
}

export const getDetailBySulg = async (sulg: string): Promise<ApiResponse<IArticle>> => {
    return requestHttp.get(`/article/${sulg}`)
}

export const getPublishDetailBySulg = async (sulg: string): Promise<ApiResponse<IArticle>> => {
    return requestHttp.get(`/publish/${sulg}`)
}

export const getDetailById = async (id: string): Promise<ApiResponse<IArticle>> => {
    return requestHttp.get(`/article/id/${id}`)
}

export const createArticle = async (article: IAritcleCreate): Promise<ApiResponse<{ article_id: string }>> => {
    return requestHttp.post(`/article`, article)
}

export const updateArticle = async (article: IAritcleUpdate): Promise<ApiReposeBase> => {
    return requestHttp.put(`/article`, article)
}

export const publishArticle = async (article_id:string): Promise<ApiReposeBase> => {
    return requestHttp.post(`/article/${article_id}`)
}



