import type { IUserCell, IUserSearch } from "@/types/main"
import { onMounted, ref } from "vue"
import { getList } from "@/api/user/user"

export const useUserList = async (params: IUserSearch) => {
    const userList = ref<IUserCell[] | undefined>(undefined);
    const userTotal = ref<number>(0);
    const res = await getList(params);
    if (res.code === 200) {
        userList.value = res.data;
        userTotal.value = res.total || 0
    }

    return { userList , userTotal }
}