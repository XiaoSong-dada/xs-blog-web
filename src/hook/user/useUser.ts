import type { IUserBaseFrom, IUserListResponse, IUserSearch, IUserCell } from "@/types/main"
import { ref } from "vue"
import { getList, getUserInfo } from "@/api/user/user"
import { message } from "ant-design-vue"

const createDefaultParams = (): IUserSearch => ({
    username: "",
    email: "",
    nick_name: "",
    offset: 1,
    limit: 10
})

const normalizeUserList = (data?: IUserListResponse | IUserCell[], totalOverride?: number) => {
    if (Array.isArray(data)) {
        return { list: data, total: totalOverride ?? data.length }
    }
    return {
        list: data?.list ?? [],
        total: totalOverride ?? data?.total ?? 0
    }
}

const buildQueryParams = (raw: IUserSearch) => {
    const page = raw.offset ?? 1
    const limit = raw.limit ?? 10
    const apiOffset = (page - 1) * limit
    return { ...raw, offset: apiOffset, limit }
}

export const useUserList = () => {
    const params = ref<IUserSearch>(createDefaultParams())
    const data = ref<IUserCell[]>([])
    const total = ref(0)
    const loading = ref(false)

    const fetchList = async (overrides: Partial<IUserSearch> = {}) => {
        loading.value = true
        try {
            const query = { ...params.value, ...overrides }
            console.log(query);

            const res = await getList(buildQueryParams(query))
            const resTotal = (res as { total?: number }).total
            const normalized = normalizeUserList(res.data, resTotal)
            data.value = normalized.list
            total.value = normalized.total
            console.log(res);

        } finally {
            loading.value = false
        }
    }

    const resetParams = () => {
        params.value = createDefaultParams()
    }

    return {
        params,
        data,
        total,
        loading,
        fetchList,
        resetParams
    }
}

export const useUser = () => {
    const user = ref<IUserBaseFrom>({
        username: "",
        email: "",
        nick_name: "",
        status: '',
        is_admin: false,
        avatar_url: ''
    });
    const getOwnerInfo = () => {
        getUserInfo().then(res => {
            if (res.code === 200 && res.data) Object.assign(user.value, res.data);
            else message.error('获取用户信息失败:' + res.message);
        })
    }


    return { user, getOwnerInfo };
}
