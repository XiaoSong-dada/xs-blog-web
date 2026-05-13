import { requestHttp } from '@/utils/http';
import type { AIChatRequest, AIChatResponse } from '@/types/main';
import type { ApiResponse } from '@/types/http';

export const sendChatMessage = async (data: AIChatRequest): Promise<ApiResponse<AIChatResponse>> => {
    return requestHttp.post<AIChatResponse>('/ai/chat', data);
};
