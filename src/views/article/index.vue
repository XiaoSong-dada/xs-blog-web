<template>
    <div class="article">
        <div class="list">
            <article-list :data="data" />
        </div>
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

<style scoped lang="scss">
.article {
    margin: 0 auto;
    width: $content-width  ;
}
</style>