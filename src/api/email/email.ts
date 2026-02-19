import type { ApiReposeBase } from "@/types/http";
import { requestHttp } from "@/utils/http";

export const sendEmailCode =async (email: string): Promise<ApiReposeBase> => {
    return requestHttp.post('/email/register', { email })
}
