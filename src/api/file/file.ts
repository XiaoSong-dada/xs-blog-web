import type { ApiResponse, ApiReposeBase } from "@/types/http"
import type { IUplaodSession } from "@/types/main"
import { requestHttp } from "@/utils/http"

export const createSession = async (): Promise<ApiResponse<IUplaodSession>> => {
    return requestHttp.post(`/file/session`)
}


export const uploadSession = async (url: string): Promise<ApiResponse<IUplaodSession>> => {
    return requestHttp.post(url)
}

export const commitSession = async (url: string): Promise<ApiReposeBase> => {
    return requestHttp.post(url)
}