<template>
    <div class="article overflow-scroll overflow-scroll--max flex-center" @scroll="handleScroll" ref="containerRef">
        <div class="list">
            <article-search-list :data="searchList ?? []" v-if="isSearch" @click-title="getDetail" @click-like="onToggleSearchLike" @click-bookmark="onToggleSearchBookmark"/>
            <article-list v-else :data="data" @click-title="getDetail" @click-like="onToggleArticleLike" @click-bookmark="onToggleArticleBookmark" />
        </div>
    </div>
</template>

<script setup lang="ts">
import ArticleList from '@/components/article/list.vue';
import ArticleSearchList from '@/components/article/search.list.vue';
import { useArticleList, useSearchList } from '@/hook/article/useArticle';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { IArticle, IArticleSearchList } from '@/types/main';
const router = useRouter();
const route = useRoute();
const containerRef = ref<HTMLDivElement | null>();
const isSearch = ref<boolean>(false);
const isFetching = ref(false);
const {
    params,
    data,
    total,
    toggleLike: toggleArticleLike,
    toggleBookmark: toggleArticleBookmark,
    fetchList,
} = useArticleList(true);

const {
    searchParams,
    searchList,
    fetchSearchList,
    searchTotal,
    toggleLike: toggleSearchLike,
    toggleBookmark: toggleSearchBookmark,
} = useSearchList()
const DEFAULT_LIMIT = 10;


onMounted(async () => {
    // 判断是否是进行关键字搜索模式
    getData()
})

const getData = async (isLoadMore = false) => {
    if (isFetching.value) return; // ✅ 防重复并发
    isFetching.value = true;

    try {
        getSearchRouter();

        const isSearchMode = !!isSearch.value;

        const currentLimit =
            (isSearchMode
                ? searchParams.value.limit
                : params.value.limit) ?? DEFAULT_LIMIT;
        const currentTotal = isSearchMode ? searchTotal.value : total.value;

        // ✅ 是否还有更多
        const hasMore = currentLimit < currentTotal;

        if (isLoadMore) {
            if (!hasMore) return; // ✅ 没更多就不请求
            const nextLimit = currentLimit + 10;
            if (isSearchMode) searchParams.value.limit = nextLimit;
            else params.value.limit = nextLimit;
        } else {
            if (isSearchMode) searchParams.value.limit = 10;
            else params.value.limit = 10;
        }

        await (isSearchMode ? fetchSearchList() : fetchList());
    } finally {
        isFetching.value = false;
    }
};

const getSearchRouter = () => {
    const kw = route.query.kw as string || undefined

    if (kw) {
        searchParams.value.kw = kw
        isSearch.value = true
    }
    else {
        isSearch.value = false;
    }
}

const getDetail = (slug: string) => {
    router.push(`/article/${slug}`)
}

const onToggleArticleLike = (article: IArticle) => {
    toggleArticleLike(article)
}

const onToggleSearchLike = (article: IArticleSearchList) => {
    toggleSearchLike(article)
}

const onToggleArticleBookmark = (article: IArticle) => {
    toggleArticleBookmark(article)
}

const onToggleSearchBookmark = (article: IArticleSearchList) => {
    toggleSearchBookmark(article)
}

watch(
    () => route.query.kw,
    () => getData()
)

const THRESHOLD = 2;

const handleScroll = (() => {
    let ticking = false;

    return () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const el = containerRef.value as HTMLDivElement | null;
            if (!el) {
                ticking = false;
                return;
            }

            const reachedBottom =
                el.scrollTop + el.clientHeight >= el.scrollHeight - THRESHOLD;

            if (reachedBottom) {
                getData(true);
            }

            ticking = false;
        });
    };
})();
</script>

<style scoped lang="scss">
.article {
    width: 100%;
    height: 100%;

    .list {
        width: 800px;

    }
}
</style>