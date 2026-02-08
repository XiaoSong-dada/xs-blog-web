<template>
    <div class="article">
        <div class="list" @scroll="handleScroll" ref="containerRef">
            <article-search-list :data="searchList ?? []" v-if="isSearch" />
            <article-list v-else :data="data" @click-title="getDetail" />
        </div>
    </div>
</template>

<script setup lang="ts">
import ArticleList from '@/components/article/list.vue';
import ArticleSearchList from '@/components/article/search.list.vue';
import { useArticleList, useSearchList } from '@/hook/article/useArticle';
import type { IArticle } from '@/types/main';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
const containerRef = ref<HTMLDivElement | null>();
const isSearch = ref<boolean>(false);

const {
    params,
    data,
    total,
    loading,
    fetchList,
    resetParams,
    rowSelection,
    selectedRows
} = useArticleList(true);

const { searchParams, searchList, fetchSearchList } = useSearchList()


onMounted(async () => {
    // 判断是否是进行关键字搜索模式
    getData()
})

const getData = async () => {
    getSearchRouter();
    if (isSearch.value) await fetchSearchList();
    else await fetchList();
}


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

watch(
    () => route.query.kw,
    () => getData()
)


const handleScroll = () => {
    const container = containerRef.value

    if (container && container.scrollTop + container.clientHeight >= container.scrollHeight) {
        // loadMore()
        console.log('到底了');
    }
}


</script>

<style scoped lang="scss">
.article {
    margin: 0 auto;
    width: $content-width ;
}
</style>