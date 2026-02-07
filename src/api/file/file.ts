import type { ApiResponse, ApiReposeBase } from "@/types/http"
import type { IUplaodSession, IUploadGroup, IUploadResult } from "@/types/main"
import { requestHttp } from "@/utils/http"

export const createSession = async (): Promise<ApiResponse<IUplaodSession>> => {
    return requestHttp.post(`/file/session`)
}


export const uploadSession = async (session_id: string , file:IUploadGroup): Promise<ApiResponse<IUploadResult>> => {
    return requestHttp.post(`/file/${session_id}/upload`, file);
}

export const commitSession = async (url: string): Promise<ApiReposeBase> => {
    return requestHttp.post(url)
}