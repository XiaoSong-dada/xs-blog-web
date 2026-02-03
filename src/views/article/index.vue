<template>
    <div>
        <article-list :data="data" />
        这是文章内容
    </div>
</template>

<script setup lang="ts">
import ArticleList from '@/components/article/list.vue';
import { useArticleList } from '@/hook/article/useArticle';
import type { IArticle } from '@/types/main';
import { onMounted, ref, watch } from 'vue';

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
const article_list = ref<IArticle[] | null>()


onMounted(async () => {
    await fetchList()
    console.log(data);
})

watch(
    () => data.value,
    (data) => article_list.value = data
)
</script>

<style scoped></style>