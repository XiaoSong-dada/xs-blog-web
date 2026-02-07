import type { ApiResponse, ApiReposeBase } from "@/types/http"
import type { IUplaodSession, IUploadGroup, IUploadResult } from "@/types/main"
import { requestHttp } from "@/utils/http"

export const createSession = async (): Promise<ApiResponse<IUplaodSession>> => {
    return requestHttp.post(`/file/session`)
}


export const uploadSession = async (session_id: string, group: IUploadGroup): Promise<ApiResponse<IUploadResult>> => {
    console.log('this is file ', group);

    const formData = new FormData()

    group.file_array.forEach(file => {
    // ⚠️ 注意：这里的 key 必须和后端参数名一致
    formData.append("file_array", file.originFileObj as File)
    })

    return requestHttp.post(`/file/${session_id}/upload`, formData);
}

export const commitSession = async (url: string): Promise<ApiReposeBase> => {
    return requestHttp.post(url)
}
