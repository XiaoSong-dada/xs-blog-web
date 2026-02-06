import type { IUplaodSession } from "@/types/main"
import { ref } from "vue"
import { createSession as create } from "@/api/file/file";
import type { ApiResponse } from '@/types/http';
import { message } from 'ant-design-vue';


export const useSession = () => {
    const session = ref<IUplaodSession>();
    const createSession = async () => {
        const res: ApiResponse<IUplaodSession> = await create();
        if (res.code === 200) session.value = res.data;
        else message.error('创建session失败!');
    }
    return {
        createSession,
        session
    }
}