import type { IArticle, IArticleQuery } from "@/types/main";
import { ref } from "vue";
import { getList } from '@/api/article/article';
import { useBuildQueryParams } from '@/hook/useBuilding';

const buildQueryParams = useBuildQueryParams
const createDefaultParams = (): IArticleQuery => ({
    title: "",
    content_md: "",
    slug: "",
})

const normalizeArticleList = (data?: IArticle[], totalOverride?: number) => {
    if (Array.isArray(data)) {
        return { list: data, total: totalOverride ?? data.length }
    }
    return {
        list: data ?? [],
        total: totalOverride ?? 0
    }
}


const selectedRows = ref<IArticle[]>()

const rowSelection = ref({
    checkStrictly: false,
    onSelect: (record: IArticle, selected: boolean, selecteds: IArticle[]) => {
        selectedRows.value = selecteds
    }
})


export const useArticleList = () => {
    const params = ref<IArticleQuery>(createDefaultParams());
    const data = ref<IArticle[]>([]);
    const total = ref(0);
    const loading = ref(false);


    const fetchList = async (overrides: Partial<IArticleQuery> = {}) => {
        loading.value = true
        try {
            const query = { ...params.value, ...overrides }
            const bulid = buildQueryParams(query)
            console.log(bulid);

            const res = await getList(bulid)
            const resTotal = (res as { total?: number }).total
            const normalized = normalizeArticleList(res.data, resTotal)
            data.value = normalized.list
            console.log(data.value);

            total.value = normalized.total
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
        rowSelection,
        selectedRows
    }
}

