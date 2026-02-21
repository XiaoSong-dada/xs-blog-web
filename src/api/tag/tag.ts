import { requestHttp } from '@/utils/http';
import type { ITag, ITagForm, ITagQuery, ITagWithCount } from '@/types/main';
import type { ApiReposeBase, ApiResponse } from '@/types/http';

export const getTagList = async (params: ITagQuery): Promise<ApiResponse<ITag[]>> => {
    return requestHttp.get('/tag', params);
};

export const getHotTagList = async (limit = 10): Promise<ApiResponse<ITagWithCount[]>> => {
    return requestHttp.get('/tag/hot', { limit });
};

export const getTagDetail = async (id: string): Promise<ApiResponse<ITag>> => {
    return requestHttp.get(`/tag/${id}`);
};

export const addTag = async (params: ITagForm): Promise<ApiReposeBase> => {
    return requestHttp.post('/tag', params);
};

export const updateTag = async (id: string, params: ITagForm): Promise<ApiReposeBase> => {
    return requestHttp.put(`/tag/${id}`, params);
};

export const deleteTag = async (id: string): Promise<ApiReposeBase> => {
    return requestHttp.delete(`/tag/${id}`);
};
