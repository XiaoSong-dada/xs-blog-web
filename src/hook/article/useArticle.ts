import type { IAritcleCreate, IAritcleUpdate, IArticle, IArticleQuery } from "@/types/main";
import type { ArticlePayload } from '@/types/vditor';
import { ref } from "vue";
import { getList, createArticle, updateArticle } from '@/api/article/article';
import { useBuildQueryParams } from '@/hook/useBuilding';
import { message } from "ant-design-vue";
import { AuthService } from "@/service/auth.service";
import { isNull } from "@/utils/verification";

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
            const bulid = buildQueryParams<IArticleQuery>(query)
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


export const useArticleEditor = () => {
    const article_id = ref<string>('');
    const modle  = ref<'create' | 'edit'>('create')

    return {
        article_id,
        modle,
        createArticle: (article: ArticlePayload) => {
            // 获取用户id
            const user_id = AuthService.getUserInfo()?.user_id
            const article_create: IAritcleCreate = {
                ...article,
            }
            if (user_id) {
                article_create.author_id = user_id
            }
            createArticle(article).then(res => {
                console.log(res);
                
                if (res.code === 200) {
                    article_id.value = res.data?.article_id ?? '';
                    modle.value = 'edit';
                    
                    return message.success('保存成功')
                };
                return message.warn(res.message)
            })
        },
        editArticle: (article: ArticlePayload) => {
            if (isNull(article_id.value)) return message.warn('article id is not found!');

            const update_article: IAritcleUpdate = {
                ...article,
                id: article_id.value
            }
            updateArticle(update_article).then(res => {
                if (res.code === 200) message.success('编辑成功');
                else message.warn(res.message);
            })
        }
    }
}