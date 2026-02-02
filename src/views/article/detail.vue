<template>
    <div class="article-detail flex-center flex-warp">
        <div class="article-detail-content ">
            <detail-header v-model:data="articleDetail"/>
            <vditor-view :markdown="articleDetail?.content_md ?? ''" />
        </div>
    </div>
</template>

<script setup lang="ts">
import VditorView from '@/components/vditor/vditor.view.vue';
import { useArticleDetail } from '@/hook/article/useArticle';
import type { IArticleDetailPropos } from '@/types/main';
import { onMounted , ref, watch} from 'vue';
import DetailHeader from '@/components/article/detail.header.vue';

const props = defineProps<IArticleDetailPropos>();
const markdown = ref<string>();
const { articleDetail, getArticleDetail } = useArticleDetail();



onMounted(async () => {
    await getArticleDetail(props.slug)
})


watch(
    ()=>articleDetail.value,
    (md)=> (markdown.value = md?.content_md ??'')
)
</script>

<style scoped lang="scss">
.article-detail {
    height: 100%;
    .article-detail-header {
        height: 100px;
    }

    .article-detail-content {
        height: 100%;
    }
}
</style>