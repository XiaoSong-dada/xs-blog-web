import type { IUserCell, IUserSearch } from "@/types/main"
import { onMounted, ref } from "vue"
import { getList } from "@/api/user/user"

export const useUserList = (params: IUserSearch) => {
    const data = ref<IUserCell[] | undefined>(undefined)

    onMounted(async () => {
        const res = await getList(params);
        if (res.code === 200) data.value = res.data
    })

    return { data }
}