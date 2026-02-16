import type { IFriendLink, IFriendLinkForm, IFriendLinkQuery } from "@/types/main"
import { computed, reactive, ref } from "vue"
import { addFriendLink, deleteFriendLink, getDetail, getList, updateFriendLink, getPublishList as getPublishListAPi } from "@/api/link/link"
import { useBuildQueryParams } from "../useBuilding";
import { useForm } from "ant-design-vue/es/form";
import { message } from "ant-design-vue";

const buildQueryParams = useBuildQueryParams;

const columns = [
    {
        title: '序号',
        key: 'index',
        dataIndex: 'index',
        width: '80px'
    },
    {
        title: '名称',
        key: 'name',
        width: '200px',
        dataIndex: 'name'
    },
    {
        title: '连接',
        key: 'url',
        width: '200px',
        dataIndex: 'url'
    },
    {
        title: '介绍',
        key: 'description',
        width: '150px',
        dataIndex: 'description'
    },
    {
        title: 'sort_order',
        key: 'sort_order',
        width: '150px',
        dataIndex: 'sort_order'
    },
    {
        title: '创建时间',
        key: 'created_at',
        width: '200px',
        dataIndex: 'created_at'
    },

    {
        title: '修改时间',
        key: 'updated_at',
        width: '200px',
        dataIndex: 'updated_at'
    },
    {
        title: '操作',
        key: 'action',
        width: '200px'
    },
];


const createDefaultParams = (): IFriendLinkQuery => ({
    name: "",
    offset: 1,
    limit: 10
})

const selectedRows = ref<IFriendLink[]>()
const selectedRowKeys = ref<(string | number)[]>([])
const rowSelection = computed(() => ({
    checkStrictly: true,
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: (string | number)[], rows: IFriendLink[]) => {
        selectedRowKeys.value = keys
        selectedRows.value = rows
    },
}))

const params = ref<IFriendLinkQuery>(createDefaultParams())
const data = ref<IFriendLink[]>([])
const total = ref(0)
const loading = ref(false)

const fetchList = async (overrides: Partial<IFriendLinkQuery> = {}) => {
    loading.value = true
    try {
        const query = buildQueryParams({ ...params.value, ...overrides })

        const res = await getList(query)
        const resTotal = (res as { total?: number }).total
        data.value = res.data ?? []
        total.value = resTotal ?? 0

    } finally {
        loading.value = false
    }
}
const resetParams = () => {
    params.value = createDefaultParams()
}

export const useFriendLinkList = () => {
    return {
        params,
        data,
        total,
        loading,
        fetchList,
        resetParams,
        columns,
        rowSelection
    }
}

const modalOpen = ref<boolean>(false);
const title = ref<string>('');
const isAdd = ref<boolean>(false);
const formModel = ref<IFriendLinkForm>({
    id: '',
    name: '',
    url: '',
    description: '',
})
const rulesRef = reactive({
    name: [
        {
            required: true,
            message: '请输入名称',
        },
    ],
    url: [
        {
            required: true,
            message: '请输入地址',
        },
    ]
});
const { validateInfos, validate, resetFields } = useForm(formModel, rulesRef)

const cancel = () => {
    modalOpen.value = false;
    formModel.value = {
        id: '',
        name: '',
        url: '',
        description: '',
    }
    resetFields();
}


const submit = async () => {
    validate();

    if (isAdd.value) {
        const res = await addFriendLink(formModel.value)
        if (res.code !== 201) return message.error(`新增失败: ${res.message}`);
        message.success('新增成功');
        fetchList();
    }
    else {
        const res = await updateFriendLink(formModel.value);
        if (res.code !== 200) return message.error(`修改失败: ${res.message}`);
        message.success('修改成功');
        fetchList();
    }

    cancel();

}

export const useDelteFriendLink = () => {
    const delteLink = async (id: string) => {
        const res = await deleteFriendLink(id)
        if (res.code !== 200) return message.error('删除失败');
        message.success('删除成功')
        fetchList();
    }
    return {
        delteLink
    }
}
export const useFriendLinkModal = () => {

    return {
        modalOpen,
        submit,
        cancel,
        title,
        formModel,
        validateInfos,
        validate
    }

}

export const useUpdateFriendLink = () => {
    const updateLink = async (id: string) => {
        const res = await getDetail(id);
        if (res.code !== 200) return message.error('获取详细信息失败');
        //  拼接数据
        Object.assign(formModel.value, res.data);
        modalOpen.value = true
        title.value = '修改友链信息'
        isAdd.value = false;

    }

    return {
        updateLink,
        cancel
    }
}

export const useAddFriendLink = () => {
    const addLink = () => {
        modalOpen.value = true
        title.value = '新增友链'
        isAdd.value = true;

    }


    return {
        addLink,
        cancel
    }
}

export const usePublishLinkList = () => {
    const publishLinks = ref<IFriendLink[]>([])
    const total = ref<number>(0)
    const getPublishList = () => {
        getPublishListAPi().then(res => {
            if (res.code !== 200) return message.error('获取发布友链失败: ' + res.message);
            publishLinks.value = res.data ?? [];
            total.value = res.total ?? 0;
        })
    }

    return {
        total,
        publishLinks,
        getPublishList,
    }
}