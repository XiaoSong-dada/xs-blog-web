import { requestHttp } from '@/utils/http';
import type { IArticleQuery, IArticle, IAritcleCreate,IAritcleUpdate, IArticleSearchQuery, IArticleSearchList } from '@/types/main';
import type { ApiResponse, ApiReposeBase } from '@/types/http'

export interface IArticleLikeResult {
    liked: boolean;
    like_count: number;
}

export interface IArticleBookmarkResult {
    bookmarked: boolean;
    bookmark_count: number;
}

export const getList = async (params: IArticleQuery): Promise<ApiResponse<IArticle[]>> => {
    return requestHttp.get('/article', params)
}

export const getSearchList = async (params: IArticleSearchQuery): Promise<ApiResponse<IArticleSearchList[]>> => {
    return requestHttp.get('/publish/search/list', params)
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

export const addView = async (article_id:string): Promise<ApiReposeBase> => {
    return requestHttp.post(`/publish/${article_id}/view`)
}

export const batchPublish = async(article_id:string[]):Promise<ApiReposeBase> => {
    return requestHttp.post(`/article/batch/publish`, article_id)
}

export const deleteArticle = async(article_id:string):Promise<ApiReposeBase> => {
    return requestHttp.delete(`/article/${article_id}`)
}

export const toggleLike = async (article_id: string): Promise<ApiResponse<IArticleLikeResult>> => {
    return requestHttp.post(`/article/${article_id}/like`)
}

export const toggleBookmark = async (article_id: string): Promise<ApiResponse<IArticleBookmarkResult>> => {
    return requestHttp.post(`/article/${article_id}/bookmark`)
}