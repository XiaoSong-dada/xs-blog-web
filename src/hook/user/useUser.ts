import type { IUserBaseFrom, IUserListResponse, IUserSearch, IUserCell, IUserPassword } from "@/types/main"
import { ref } from "vue"
import { getList, getUserInfo, updateUserInfo, updateUserPassword } from "@/api/user/user"
import { message } from "ant-design-vue"
import { isNull } from "@/utils/verification"
import { AuthService } from "@/service/auth.service"
import { deepClone } from "@/utils/utils"

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
        avatar_url: '',
        code: '',
    });

    const _userInfo = ref<IUserBaseFrom>();
    const getOwnerInfo = () => {
        getUserInfo().then(res => {
            if (res.code === 200 && res.data) {
                Object.assign(user.value, res.data);
                _userInfo.value = deepClone(user.value);
            }
            else message.error('获取用户信息失败:' + res.message);
        })
    }

    const updateUser = () => {
        if (!checkUserFrom()) return;
        updateUserInfo(user.value).then(res => {
            if (res.code === 200) {
                message.success("更新成功");
                getOwnerInfo();
            } else {
                message.error("更新失败:" + res.message);
            }
        })
    }

    const checkUserFrom = (): boolean => {
        const notNullArray: Array<keyof IUserBaseFrom> = ['nick_name', 'email', 'avatar_url']
        let isPass: boolean = true
        notNullArray.forEach(item => {
            // 当前用户输入的值与原始用户信息中的值都为空时，提示不能为空；当当前用户输入的值与原始用户信息中的值不相等且当前用户输入的值为空时，提示不能为空
            if (isNull(user.value[item]) && user.value[item] !== _userInfo.value?.[item]) {
                message.warn(`${item}不能为空`)
                isPass = false
                return;
            }
        })

        return isPass
    }


    return { user, _userInfo, getOwnerInfo, updateUser, checkUserFrom };
}

export const useUpdatePassword = () => {
    const passwordUser = ref<IUserPassword>({
        old_password: '',
        password: '',
    })

    const modalVisible = ref(false);

    const updatePassword = () => {
        let checked = true;
        ['old_password', 'password'].forEach(item => {
            if (isNull(passwordUser.value[item as keyof IUserPassword])) {
                message.warn(`${item}不能为空`)
                checked = false;
                return;
            }
        });

        if (!checked) return;

        updateUserPassword(passwordUser.value).then(res => {
            if (res.code === 200) {
                message.success("密码更新成功，请重新登录");
                AuthService.clearToken();
                modalVisible.value = false;
                window.location.reload();
            } else {
                message.error("密码更新失败:" + res.message);
            }
        });
    }

    const resetPassword = () => {
        passwordUser.value = {
            old_password: '',
            password: '',
        }

        modalVisible.value = false;
    }

    return { passwordUser, updatePassword, modalVisible, resetPassword };
}