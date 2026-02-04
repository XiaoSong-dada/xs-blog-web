<template>
    <div class="detail-header">
        <p class="title">
            {{ detailData?.title }}
        </p>
        <article-meta :data="metaData"/>
    </div>
</template>

<script setup lang="ts">
import type { IArticle, IArticleMeta } from '@/types/main';
import { formatDate } from '@/utils/date';
import { onMounted, ref, watch } from 'vue'
import ArticleMeta from '@/components/article/meta.vue'

const props = defineProps<{ data: IArticle | null }>()
const detailData = ref<IArticle | null>(null);
const metaData = ref<IArticleMeta>({})

onMounted(async () => {
    if (props.data) {
        detailData.value = props.data;
        // 格式化数据
        detailData.value.created_at = formatDate(detailData.value?.created_at)
        console.log('do this ');

    }

})

watch(
    () => props.data,
    (val) => {
        if (!val) return;
        detailData.value = val;
        detailData.value.created_at = formatDate(detailData.value.created_at);
        metaData.value.published_at = formatDate(detailData.value.published_at as string);
    },
    { immediate: true }
);
</script>

<style scoped lang="scss">
.detail-header {
    height: 100px;
    p {
        padding: 0;
    }
    .title {
        font-size: 30px;
        font-weight: bold;
        margin: 0 0 20px 0;
    }
}
</style>