import type {
    IAritcleCreate,
    IAritcleUpdate,
    IArticle,
    IBookmarkQuery,
    IArticleQuery,
    IArticleSearchList,
    IArticleSearchQuery,
    ICommentQuery,
    ICommentThread,
} from "@/types/main";
import type { ArticlePayload } from '@/types/vditor';
import { ref, h, type VNode ,computed, reactive } from "vue";
import {
    getList, getPublishList,
    getPublishDetailBySulg,
    createArticle as create,
    updateArticle, publishArticle,
    getDetailBySulg, getDetailById,
    addView,
    getSearchList,
    getBookmarks,
    getArticleComments,
    createArticleComment,
    replyArticleComment,
    batchPublish as batch_publsih,
    deleteArticle as deleteArticleApi,
    batchImportArticleTags,
    updateArticleTags,
    toggleLike as toggleLikeApi,
    toggleBookmark as toggleBookmarkApi,
} from '@/api/article/article';
import { getTagList } from '@/api/tag/tag';
import { useTagList } from '@/hook/tag/useTag';
import { useBuildQueryParams } from '@/hook/useBuilding';
import { message, Modal } from "ant-design-vue";
import type { ColumnsType } from 'ant-design-vue/es/table';
import { AuthService } from "@/service/auth.service";
import { isNull } from "@/utils/verification";

// TODO:以后再详细拆分用户获取与管理员获取的数据
const buildQueryParams = useBuildQueryParams
const createDefaultParams = (): IArticleQuery => ({
    title: "",
    content_md: "",
    slug: "",
    published_at: '',
    tag_id: undefined,
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
const columns: ColumnsType<IArticle> = [
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
        title: '标签',
        key: 'tags',
        width: '240px',
        dataIndex: 'tags'
    },
    {
        title: '内容',
        key: 'content_md',
        width: '150px',
        dataIndex: 'content_md'
    },
    {
        title: '浏览量',
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
        width: '310px',
        fixed: 'right'
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
    const selectedTagIds = ref<string[]>([]);

    const setTagIds = (tagIds: string[]) => {
        selectedTagIds.value = [...tagIds];
    }

    const createArticle = (article: ArticlePayload) => {
        // 获取用户id
        const user_id = AuthService.getUserInfo()?.user_id
        const article_create: IAritcleCreate = {
            ...article,
            tag_ids: selectedTagIds.value,
        }
        if (user_id) {
            article_create.author_id = user_id
        }
        create(article_create).then(res => {

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
            id: article_id.value,
            tag_ids: selectedTagIds.value,
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
        selectedTagIds,
        setTagIds,
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
        try {
            const detail = publish_flag ? await getPublishDetailBySulg(slug) : await getDetailBySulg(slug)
            
            if (detail.code === 200 && detail.data) {
                articleDetail.value = detail.data
            }
            else message.warn(`获取详细信息失败: ${detail.message}`);
        } catch {
            message.error('获取详细信息失败，请稍后重试')
        }
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

// Modal state constants (declared outside hook as requested)
const showTagModal = ref<boolean>(false);
const showPublishModal = ref<boolean>(false);
const showDeleteModal = ref<boolean>(false);

const tagModalParams = ref<{ selectedTagIds: string[] }>({ selectedTagIds: [] });
// 声明 RightColumn 与 LeftColumn 数组
const leftColumns: ColumnsType<any> = [
    {
        title: '文章标题',
        key: 'title',
        dataIndex: 'title'
    },
    {
        title: '文章标签',
        key: 'tags',
        dataIndex: 'tags'
    },
];

const rightColumns: ColumnsType<any> = [
    {
        title: '名称',
        key: 'name',
        dataIndex: 'name'
    },
    {
        title: '标记',
        key: 'slug',
        dataIndex: 'slug'
    },
];
// Hook to expose modal visibilities and modal-related params
export const useArticleBatchTagModals = () => {
    // modal-local state useful for batch tag UI
    const modalSearchTitle = ref<string>('');
    const leftData = ref<any[]>([]);
    const rightData = ref<any[]>([]);
    const selectedLeftRowKeys = ref<(string | number)[]>([]);
    const selectedRightRowKeys = ref<(string | number)[]>([]);
    const leftLoading = ref(false);
    const rightLoading = ref(false);
    const confirmLoading = ref(false);

    const fetchLeftList = async () => {
        leftLoading.value = true;
        try {
            const query = buildQueryParams<IArticleQuery>({
                title: modalSearchTitle.value.trim(),
                slug: '',
                content_md: '',
                published_at: '',
                tag_id: undefined,
                offset: leftPagination.current,
                limit: leftPagination.pageSize,
            });
            const res = await getList(query);
            leftData.value = res.data ?? [];
            leftPagination.total = res.total ?? leftData.value.length;
        } finally {
            leftLoading.value = false;
        }
    };

    const fetchRightList = async () => {
        rightLoading.value = true;
        try {
            const query = buildQueryParams({
                name: '',
                slug: '',
                offset: rightPagination.current,
                limit: rightPagination.pageSize,
            });
            const res = await getTagList(query);
            rightData.value = res.data ?? [];
            rightPagination.total = res.total ?? rightData.value.length;
        } finally {
            rightLoading.value = false;
        }
    };

    const initModalData = async () => {
        await Promise.all([fetchLeftList(), fetchRightList()]);
    };

    // modal basic actions
    const openTagModal = async (tagIds: string[] = []) => {
        tagModalParams.value.selectedTagIds = [...tagIds];
        modalSearchTitle.value = '';
        selectedLeftRowKeys.value = [];
        selectedRightRowKeys.value = [];
        leftPagination.current = 1;
        rightPagination.current = 1;
        showTagModal.value = true;
        await initModalData();
    }

    const closeTagModal = () => {
        showTagModal.value = false;
    }

    const openPublishModal = () => { showPublishModal.value = true };
    const closePublishModal = () => { showPublishModal.value = false };

    const openDeleteModal = () => { showDeleteModal.value = true };
    const closeDeleteModal = () => { showDeleteModal.value = false };

    const leftRowSelection = computed(() => ({
        selectedRowKeys: selectedLeftRowKeys.value,
        onChange: (keys: (string | number)[]) => { selectedLeftRowKeys.value = keys; }
    }));

    const rightRowSelection = computed(() => ({
        selectedRowKeys: selectedRightRowKeys.value,
        onChange: (keys: (string | number)[]) => { selectedRightRowKeys.value = keys; }
    }));

    const leftPagination = reactive({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        onChange: async (page: number, pageSize?: number) => {
            leftPagination.current = page;
            leftPagination.pageSize = pageSize || leftPagination.pageSize;
            await fetchLeftList();
        }
    });

    const rightPagination = reactive({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        onChange: async (page: number, pageSize?: number) => {
            rightPagination.current = page;
            rightPagination.pageSize = pageSize || rightPagination.pageSize;
            await fetchRightList();
        }
    });

    const onSearchModal = async () => {
        leftPagination.current = 1;
        await fetchLeftList();
    };

    const onResetModal = async () => {
        modalSearchTitle.value = '';
        leftPagination.current = 1;
        await fetchLeftList();
    };

    const onConfirmTagSetting = async () => {
        const articleIds = selectedLeftRowKeys.value.map((id) => String(id)).filter((id) => id.length > 0);
        const tagIds = selectedRightRowKeys.value.map((id) => String(id)).filter((id) => id.length > 0);

        if (articleIds.length === 0) {
            return message.warn('请选择文章');
        }
        if (tagIds.length === 0) {
            return message.warn('请选择标签');
        }

        confirmLoading.value = true;
        try {
            const res = await batchImportArticleTags(articleIds, tagIds);
            if (res.code === 200) {
                const inserted = res.data?.inserted ?? 0;
                const skipped = res.data?.skipped ?? 0;
                message.success(`批量设置成功，新增 ${inserted} 条，跳过 ${skipped} 条`);
                closeTagModal();
                return true;
            }
            message.warn(res.message);
        } catch {
            message.error('批量设置标签失败');
        } finally {
            confirmLoading.value = false;
        }
        return false;
    }
    


    return {
        // visibilities
        showTagModal,
        showPublishModal,
        showDeleteModal,
        // modal params
        tagModalParams,
        // modal-local state
        modalSearchTitle,
        leftData,
        rightData,
        leftLoading,
        rightLoading,
        confirmLoading,
        selectedLeftRowKeys,
        selectedRightRowKeys,
        leftRowSelection,
        rightRowSelection,
        leftPagination,
        rightPagination,
        // columns
        leftColumns,
        rightColumns,
        // actions
        openTagModal,
        closeTagModal,
        openPublishModal,
        closePublishModal,
        openDeleteModal,
        closeDeleteModal,
        onConfirmTagSetting,
        onSearchModal,
        onResetModal,
    }
}

const createSearchDefaultParams = (): IArticleSearchQuery => ({
    kw: ''
})

const createBookmarkDefaultParams = (): IBookmarkQuery => ({
    offset: 1,
    limit: 10,
})

const createCommentDefaultParams = (): ICommentQuery => ({
    offset: 0,
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

export const useArticleComment = (article_id: string | (() => string)) => {
    const getArticleId = () => {
        if (typeof article_id === 'function') return article_id()
        return article_id
    }

    const params = ref<ICommentQuery>(createCommentDefaultParams())
    const commentThreads = ref<ICommentThread[]>([])
    const total = ref(0)
    const loading = ref(false)
    const submitting = ref(false)

    const fetchComments = async (append: boolean = false) => {
        const currentArticleId = getArticleId()
        if (!currentArticleId) return
        loading.value = true
        try {
            const query = useBuildQueryParams<ICommentQuery>(params.value)
            const res = await getArticleComments(currentArticleId, query)
            const list = res.data ?? []
            total.value = res.total ?? 0

            
            if (append) commentThreads.value = [...commentThreads.value, ...list]
            else commentThreads.value = list
        } catch {
            message.error('获取评论失败，请稍后重试')
        } finally {
            loading.value = false
        }
    }

    const resetAndFetch = async () => {
        params.value = createCommentDefaultParams()
        await fetchComments(false)
    }

    const createComment = async (content: string) => {
        const currentArticleId = getArticleId()
        if (!currentArticleId) return false

        const userInfo = AuthService.getUserInfo();
        if (!userInfo) {
            message.warn('请先登录后再评论');
            return false
        }

        const trimmed = content.trim()
        if (!trimmed) {
            message.warn('评论内容不能为空')
            return false
        }

        if (submitting.value) return false
        submitting.value = true

        try {
            const res = await createArticleComment(currentArticleId, { content: trimmed })
            if (res.code === 201 || res.code === 200) {
                await resetAndFetch()
                message.success('评论成功')
                return true
            }
            message.warn(res.message)
            return false
        } catch {
            message.error('评论失败，请稍后重试')
            return false
        } finally {
            submitting.value = false
        }
    }

    const replyComment = async (comment_id: string, content: string) => {
        const currentArticleId = getArticleId()
        if (!currentArticleId) return false

        const userInfo = AuthService.getUserInfo();
        if (!userInfo) {
            message.warn('请先登录后再回复');
            return false
        }

        const trimmed = content.trim()
        if (!trimmed) {
            message.warn('回复内容不能为空')
            return false
        }

        if (submitting.value) return false
        submitting.value = true
        try {
            const res = await replyArticleComment(currentArticleId, comment_id, {
                content: trimmed,
            })
            if (res.code === 201 || res.code === 200) {
                await resetAndFetch()
                message.success('回复成功')
                return true
            }
            message.warn(res.message)
            return false
        } catch {
            message.error('回复失败，请稍后重试')
            return false
        } finally {
            submitting.value = false
        }
    }

    const loadMore = async () => {
        const nextOffset = (params.value.offset ?? 0) + (params.value.limit ?? 10)
        if (nextOffset >= total.value) return
        params.value.offset = nextOffset
        await fetchComments(true)
    }

    const hasMore = computed(() => {
        return commentThreads.value.length < total.value
    })

    return {
        params,
        commentThreads,
        total,
        loading,
        submitting,
        hasMore,
        fetchComments,
        resetAndFetch,
        createComment,
        replyComment,
        loadMore,
    }
}

// Hook: 编辑单篇文章的标签（穿梭框）
export const useEditorTag = () => {
    const showEditor = ref<boolean>(false);
    const loadingEditor = ref<boolean>(false);
    const transferData = ref<{ key: string; title: string; description?: string }[]>([]);
    const targetKeys = ref<string[]>([]); // 已选中的 tag id（显示在右侧）
    const currentArticleId = ref<string>('');

    const loadTags = async () => {
        loadingEditor.value = true;
        try {
            const { data, fetchList } = useTagList();
            // fetch full list (backend returns all even with pagination params)
            await fetchList({ offset: 1, limit: 1000 });
            const list = data.value ?? [];
            transferData.value = list.map((t: any) => ({ key: t.id, title: t.name, description: t.slug }));
        } finally {
            loadingEditor.value = false;
        }
    };

    const openEditor = async (articleId: string, currentTags: { id: string }[] = []) => {
        currentArticleId.value = articleId;
        targetKeys.value = currentTags.map((t) => t.id);
        await loadTags();
        showEditor.value = true;
    };

    const closeEditor = () => {
        showEditor.value = false;
        transferData.value = [];
        targetKeys.value = [];
        currentArticleId.value = '';
    };

    const confirmEditor = async () => {
        if (!currentArticleId.value) return message.warn('文章id不存在');
        try {
            const res = await updateArticleTags(currentArticleId.value, targetKeys.value);
            if (res.code === 200) {
                message.success('标签更新成功');
                closeEditor();
                return true;
            }
            message.warn(res.message);
        } catch (e) {
            message.error('更新失败');
        }
        return false;
    };

    return {
        showEditor,
        loadingEditor,
        transferData,
        targetKeys,
        currentArticleId,
        openEditor,
        closeEditor,
        confirmEditor,
    };
};
