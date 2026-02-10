import type { ApiResponse, ApiReposeBase } from "@/types/http"
import type { IDownloadResult, IUplaodFile, IUplaodSession, IUploadGroup, IUploadResult } from "@/types/main"
import { requestHttp } from "@/utils/http"
import { Form, type UploadFile } from "ant-design-vue"

export const uploadFile = async (file:File , bucket:string ): Promise<ApiResponse<IUplaodFile>> => {
    const form = new FormData();
    form.append('file' , file)
    form.append('bucket' , bucket)
    return requestHttp.post(`/file`,form)
}


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

export const commitSession = async (session_id: string): Promise<ApiReposeBase> => {
    return requestHttp.post(`/file/${session_id}/commit`)
}

export const exportCommitSession = async (session_id: string, article_id_array: string[]): Promise<ApiResponse<IDownloadResult>> => {
    return requestHttp.post(`/file/${session_id}/export`,  {
    session_id,      // 可传可不传（后端会以 path 为准）
    article_ids: article_id_array
  })
}


export const downloadFile = async (file_url: string): Promise<Blob> => {
    const data = await requestHttp.download(file_url);

    if (!data) {
        throw new Error('下载失败：未获取到文件内容');
    }

    return data;
};