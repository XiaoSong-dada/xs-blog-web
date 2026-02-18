import type {
    IAritcleCreate,
    IAritcleUpdate,
    IArticle,
    IBookmarkQuery,
    IArticleQuery,
    IArticleSearchList,
    IArticleSearchQuery
} from "@/types/main";
import type { ArticlePayload } from '@/types/vditor';
import { ref, h, type VNode ,computed} from "vue";
import {
    getList, getPublishList,
    getPublishDetailBySulg,
    createArticle as create,
    updateArticle, publishArticle,
    getDetailBySulg, getDetailById,
    addView,
    getSearchList,
    getBookmarks,
    batchPublish as batch_publsih,
    deleteArticle as deleteArticleApi,
    toggleLike as toggleLikeApi,
    toggleBookmark as toggleBookmarkApi,
} from '@/api/article/article';
import { useBuildQueryParams } from '@/hook/useBuilding';
import { message, Modal } from "ant-design-vue";
import { AuthService } from "@/service/auth.service";
import { isNull } from "@/utils/verification";

// TODO:以后再详细拆分用户获取与管理员获取的数据
const buildQueryParams = useBuildQueryParams
const createDefaultParams = (): IArticleQuery => ({
    title: "",
    content_md: "",
    slug: "",
    published_at: '',
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
const selectedRowKeys = ref<(string | number)[]>([])
const rowSelection = computed(() => ({
  checkStrictly: true,
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: (string | number)[], rows: IArticle[]) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  },
}))
const columns = [
    {
        title: '序号',
        key: 'index',
        dataIndex: 'index',
        width: '80px'
    },
    {
        title: '标识',
        key: 'slug',
        width: '200px',
        dataIndex: 'slug'
    },
    {
        title: '标题',
        key: 'title',
        width: '200px',
        dataIndex: 'title'
    },
    {
        title: '内容',
        key: 'content_md',
        with: '150px',
        dataIndex: 'content_md'
    },
    {
        title: '浏览',
        key: 'view_count',
        width: '150px',
        dataIndex: 'view_count'
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

export const useArticleList = (publish_flag: boolean = false) => {
    const params = ref<IArticleQuery>(createDefaultParams());
    const data = ref<IArticle[]>([]);
    const total = ref(0);
    const loading = ref(false);
    const likeLoadingMap = ref<Record<string, boolean>>({});
    const bookmarkLoadingMap = ref<Record<string, boolean>>({});

    const toggleLike = async (article: IArticle) => {
        const userInfo = AuthService.getUserInfo();
        if (!userInfo) {
            message.warn('请先登录后再点赞');
            return;
        }

        const articleId = article.id;
        if (likeLoadingMap.value[articleId]) return;

        const prevLiked = !!article.liked;
        const prevCount = article.like_count ?? 0;

        article.liked = !prevLiked;
        article.like_count = Math.max(0, prevCount + (prevLiked ? -1 : 1));
        likeLoadingMap.value[articleId] = true;

        try {
            const res = await toggleLikeApi(articleId);
            article.liked = !!res.data?.liked;
            article.like_count = res.data?.like_count ?? article.like_count;
        } catch {
            article.liked = prevLiked;
            article.like_count = prevCount;
            message.error('点赞失败，请稍后重试');
        } finally {
            likeLoadingMap.value[articleId] = false;
        }
    }

    const toggleBookmark = async (article: IArticle) => {
        const userInfo = AuthService.getUserInfo();
        if (!userInfo) {
            message.warn('请先登录后再收藏');
            return;
        }

        const articleId = article.id;
        if (bookmarkLoadingMap.value[articleId]) return;

        const prevBookmarked = !!article.bookmarked;
        const prevCount = article.bookmark_count ?? 0;

        article.bookmarked = !prevBookmarked;
        article.bookmark_count = Math.max(0, prevCount + (prevBookmarked ? -1 : 1));
        bookmarkLoadingMap.value[articleId] = true;

        try {
            const res = await toggleBookmarkApi(articleId);
            article.bookmarked = !!res.data?.bookmarked;
            article.bookmark_count = res.data?.bookmark_count ?? article.bookmark_count;
        } catch {
            article.bookmarked = prevBookmarked;
            article.bookmark_count = prevCount;
            message.error('收藏失败，请稍后重试');
        } finally {
            bookmarkLoadingMap.value[articleId] = false;
        }
    }

    const fetchList = async (overrides: Partial<IArticleQuery> = {}) => {
        loading.value = true
        try {
            const query = { ...params.value, ...overrides }
            const bulid = buildQueryParams<IArticleQuery>(query)
            const res = publish_flag ? await getPublishList(bulid) : await getList(bulid)
            const resTotal = (res as { total?: number }).total
            const normalized = normalizeArticleList(res.data, resTotal)
            data.value = normalized.list
            total.value = normalized.total
        } finally {
            loading.value = false
        }
    }

    const resetParams = () => {
        params.value = createDefaultParams()
    }

    const batchPublish = () => {

        if ((!selectedRows.value) || selectedRows.value.length === 0) return message.info("请选择一行文章!");

        const id: string[] = []
        const message_array: VNode[] = [];
        message_array.push(h('p', `是否确认发布文章`));
        selectedRows.value?.forEach(item => {
            message_array.push(h('p', `文章标题:《${item.title}》`));
            id.push(item.id);
        })
        const modal = Modal.confirm(
            {
                title: "发布确认",
                content: h('div', {}, [
                    ...message_array
                ]),
                okText:'确认',
                onOk: () => {
                    batch_publsih(id).then(res => {
                        if (res.code == 200) {
                            message.success('批量发布成功');
                            fetchList();
                        }
                        else message.error('批量发布失败' + res.message);
                    })
                },
                cancelText:"取消",
                onCancel: ()=>{
                    modal.destroy();
                }
            }
        )
    }

    const deleteArticle = (article_id:string) => {
        deleteArticleApi(article_id).then(res => {
            if (res.code === 200) {
                message.success('删除成功');
                fetchList();
            } else {
                message.error('删除失败: ' + res.message);
            }
        })
    }

    return {
        params,
        data,
        total,
        loading,
        toggleLike,
        toggleBookmark,
        fetchList,
        resetParams,
        rowSelection,
        selectedRows,
        columns,
        batchPublish,
        deleteArticle
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

    const getArticleDetail = async (slug: string, publish_flag: boolean = false) => {
        const detail = publish_flag ? await getPublishDetailBySulg(slug) : await getDetailBySulg(slug)
        if (detail.code === 200 && detail.data) {
            articleDetail.value = detail.data
        }
        else message.warn(`获取详细信息失败: ${detail.message}`);
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
            if (res.code === 200 && res.data) {
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

export const useAddView = () => {
    return {
        addView: (id: string) => {
            // 直接增加
            addView(id)
        }
    }
}

const createSearchDefaultParams = (): IArticleSearchQuery => ({
    kw: ''
})

const createBookmarkDefaultParams = (): IBookmarkQuery => ({
    offset: 1,
    limit: 10,
})

export const useBookmarkList = () => {
    const params = ref<IBookmarkQuery>(createBookmarkDefaultParams())
    const data = ref<IArticle[]>([])
    const total = ref(0)
    const loading = ref(false)

    const fetchList = async (overrides: Partial<IBookmarkQuery> = {}) => {
        loading.value = true
        try {
            const query = { ...params.value, ...overrides }
            const build = useBuildQueryParams<IBookmarkQuery>(query)
            const res = await getBookmarks(build)
            
            const resTotal = (res as { total?: number }).total
            const normalized = normalizeArticleList(res.data, resTotal)
            data.value = normalized.list
            total.value = normalized.total
        } finally {
            loading.value = false
        }
    }

    const resetParams = () => {
        params.value = createBookmarkDefaultParams()
    }

    return {
        params,
        data,
        total,
        loading,
        fetchList,
        resetParams,
    }
}

export const useSearchList = () => {
    const searchParams = ref<IArticleSearchQuery>(createSearchDefaultParams());
    const searchList = ref<IArticleSearchList[]>();
    const searchTotal = ref(0);
    const loading = ref(false);
    const likeLoadingMap = ref<Record<string, boolean>>({});
    const bookmarkLoadingMap = ref<Record<string, boolean>>({});

    const toggleLike = async (article: IArticleSearchList) => {
        const userInfo = AuthService.getUserInfo();
        if (!userInfo) {
            message.warn('请先登录后再点赞');
            return;
        }

        const articleId = article.id;
        if (likeLoadingMap.value[articleId]) return;

        const prevLiked = !!article.liked;
        const prevCount = article.like_count ?? 0;

        article.liked = !prevLiked;
        article.like_count = Math.max(0, prevCount + (prevLiked ? -1 : 1));
        likeLoadingMap.value[articleId] = true;

        try {
            const res = await toggleLikeApi(articleId);
            article.liked = !!res.data?.liked;
            article.like_count = res.data?.like_count ?? article.like_count;
        } catch {
            article.liked = prevLiked;
            article.like_count = prevCount;
            message.error('点赞失败，请稍后重试');
        } finally {
            likeLoadingMap.value[articleId] = false;
        }
    }

    const toggleBookmark = async (article: IArticleSearchList) => {
        const userInfo = AuthService.getUserInfo();
        if (!userInfo) {
            message.warn('请先登录后再收藏');
            return;
        }

        const articleId = article.id;
        if (bookmarkLoadingMap.value[articleId]) return;

        const prevBookmarked = !!article.bookmarked;
        const prevCount = article.bookmark_count ?? 0;

        article.bookmarked = !prevBookmarked;
        article.bookmark_count = Math.max(0, prevCount + (prevBookmarked ? -1 : 1));
        bookmarkLoadingMap.value[articleId] = true;

        try {
            const res = await toggleBookmarkApi(articleId);
            article.bookmarked = !!res.data?.bookmarked;
            article.bookmark_count = res.data?.bookmark_count ?? article.bookmark_count;
        } catch {
            article.bookmarked = prevBookmarked;
            article.bookmark_count = prevCount;
            message.error('收藏失败，请稍后重试');
        } finally {
            bookmarkLoadingMap.value[articleId] = false;
        }
    }

    const fetchSearchList = async (overrides: Partial<IArticleSearchQuery> = {}) => {
        loading.value = true
        try {
            const query = { ...searchParams.value, ...overrides }
            const bulid = buildQueryParams<IArticleSearchQuery>(query)
            const res = await getSearchList(bulid)
            searchList.value = res.data
            searchTotal.value = res.total ?? 0
        } finally {
            loading.value = false
        }
    }

    const resetParams = () => {
        searchParams.value = createDefaultParams()
    }

    return {
        searchParams,
        searchList,
        searchTotal,
        loading,
        toggleLike,
        toggleBookmark,
        fetchSearchList,
        resetParams,
        rowSelection,
        selectedRows
    }
}