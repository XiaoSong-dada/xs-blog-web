import type { IFriendLink, IFriendLinkQuery } from "@/types/main"
import { computed, ref } from "vue"
import { getList } from "@/api/link/link"
import { useBuildQueryParams } from "../useBuilding";

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
        title: 'Logo',
        key: 'log_url',
        width: '200px',
        dataIndex: 'log_url'
    },
    {
        title: '发布时间',
        key: 'published_at',
        width: '200px',
        dataIndex: 'published_at'
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

export const useFriendLinkList = () => {
    const params = ref<IFriendLinkQuery>(createDefaultParams())
    const data = ref<IFriendLink[]>([])
    const total = ref(0)
    const loading = ref(false)

    const fetchList = async (overrides: Partial<IFriendLinkQuery> = {}) => {
        loading.value = true
        try {
            const query = buildQueryParams({ ...params.value, ...overrides })
            console.log(query);

            const res = await getList(query)
            const resTotal = (res as { total?: number }).total
            data.value = res.data ?? []
            total.value = resTotal ?? 0
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
        resetParams,
        columns,
        rowSelection
    }
}