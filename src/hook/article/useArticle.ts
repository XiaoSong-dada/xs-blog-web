import type { IAritcleCreate, IAritcleUpdate, IArticle, IArticleQuery } from "@/types/main";
import type { ArticlePayload } from '@/types/vditor';
import { ref } from "vue";
import { getList, createArticle as create, updateArticle, publishArticle, getDetailBySulg, getDetailById } from '@/api/article/article';
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
    const modle = ref<'create' | 'edit'>('create');
    const isDirty = ref<boolean>(false);
    const createArticle = (article: ArticlePayload) => {
        // 获取用户id
        const user_id = AuthService.getUserInfo()?.user_id
        const article_create: IAritcleCreate = {
            ...article,
        }
        if (user_id) {
            article_create.author_id = user_id
        }
        create(article).then(res => {

            if (res.code === 201) {
                article_id.value = res.data?.article_id ?? '';
                modle.value = 'edit';

                return message.success('保存成功')
            };
            return message.warn(res.message)
        })
    }

    const editArticle = (article: ArticlePayload) => {
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

    return {
        article_id,
        modle,
        isDirty,
        createArticle,
        editArticle,
        publishArticle: async () => {
            /**
             * 保存|新增 & 发布
             * TODO: 优化保存并发布
             * 当用户点击发布时会先进行文章内容保存后再进行发布 可优化后端接口
             */

            // 必须是已保存的文章才能发布
            if (isDirty.value) return message.info('文章还未保存');
            if (isNull(article_id)) return message.warn('未找到文章id');

            publishArticle(article_id.value).then(res => {
                if (res.code === 200) message.success('发布成功');
                else message.warn(res.message);
            })
        }
    }
}


export const useArticleDetail = () => {
    const articleDetail = ref<IArticle | null>(null)

    const getArticleDetail = (slug: string) => {
        getDetailBySulg(slug).then(res => {
            if (res.code === 200 && res.data){
                console.log('get res ' ,res);
                
                 articleDetail.value = res.data
                }
            else message.warn(`获取详细信息失败 ${res.data}`);
        })
    }

    return {
        articleDetail,
        getArticleDetail
    }
}

export const useArticleDetailById = () => {
    const articleDetail = ref<IArticle | null>(null)

    const getArticleDetail = (id: string) => {
        getDetailById(id).then(res => {
            if (res.code === 200 && res.data){
                 articleDetail.value = res.data
                }
            else message.warn(`获取详细信息失败 ${res.data}`);
        })
    }

    return {
        articleDetail,
        getArticleDetail
    }
}