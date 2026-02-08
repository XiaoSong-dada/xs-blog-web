<template>
    <div class="article-detail-page overflow-scroll overflow-scroll--max flex-center">
        <div class="detail-layout">
            <aside class="detail-aside detail-aside--toc sticky-aside">
                <div class="card aside-padding">
                    <detail-header :data="article ?? null" />
                </div>
                <div class="card toc">
                    <vditor-toc ref="tocRef" :scroll-container="scrollContainer" :offset-top="8" />
                </div>
            </aside>
            <!-- 中间：内容 -->
            <main class="detail-main card flex-start">
                <div>
                    <vditor-view :markdown="articleDetail?.content_md ?? ''" @rendered="handleRendered" />
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import VditorView from "@/components/vditor/vditor.view.vue";
import VditorToc from "@/components/vditor/vditor.toc.vue";
import DetailHeader from "@/components/article/detail.header.vue";

import { useAddView, useArticleDetail } from "@/hook/article/useArticle";
import type { IArticle, IArticleDetailPropos } from "@/types/main";
const article = ref<IArticle>();

const props = defineProps<IArticleDetailPropos>();

const { articleDetail, getArticleDetail } = useArticleDetail();
const { addView } = useAddView();
// 目录组件实例
const tocRef = ref<InstanceType<typeof VditorToc> | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);

onMounted(async () => {
    scrollContainer.value = document.querySelector(".main-content") as HTMLElement | null;

    await getArticleDetail(props.slug, true);
    
});

// vditor-view 渲染完成后，把 root element 交给 toc 渲染
function handleRendered(el: HTMLElement) {
    tocRef.value?.render(el);
}


watch(
    () => articleDetail.value,
    (val) => {
        
        if (val) {
            addView(val.id);
            article.value = val
        }

    },
)
</script>

<style scoped lang="scss">
.article-detail-page {
    /* 统一可配置变量：集中管理尺寸，后续调整只改这里 */
    --gap: 20px;
    --page-padding: 5px;
    --header-h: 46px;

    --toc-w: 220px;
    --right-w: 200px;
    --toc-height: 400px;

    --sticky-top: calc(var(--header-h) + var(--page-padding));
    --sticky-max-h: calc(100vh - 80px);

    background-color: #F5F6F7;
    min-height: 100%;
    box-sizing: border-box;

    /* Layout：只关心布局，不关心颜色皮肤 */
    .detail-layout {
        display: flex;
        align-items: flex-start;

        width: min(1240px, 100%);
        margin: 0 auto;
        padding: var($page-padding);
        min-height: 100%;
        box-sizing: border-box;
        gap: var(--gap);
        /* 允许 sticky 元素可见 */
        overflow: visible;
    }

    /* 通用：卡片外观（以后可复用到其他页面） */
    .card {
        background: #fff;
        border-right: 1px solid $dark-color ;
        border-radius: 5px;
    }

    /* 通用：sticky 侧栏能力 */
    .sticky-aside {
        position: sticky;
        align-self: flex-start;
        max-height: var(--sticky-max-h);
        overflow: auto;
        flex: 1;
    }

    .aside-padding {
        padding: 10px;
    }

    .toc {
        min-height: var(--toc-height);
    }

    /* 通用：侧栏基础 */
    .detail-aside {
        display: flex;
        flex-direction: column;
        gap: 20px;
        flex: 0 0;
        padding: 5px
    }

    /* 左侧目录宽度 */
    .detail-aside--toc {
        flex-basis: var(--toc-w);
        min-height: var(--sticky-max-h);
    }

    /* 右侧信息宽度 */
    .detail-aside--right {
        flex-basis: var(--right-w);
        min-height: var(--sticky-max-h);
    }

    /* 主内容：自适应占满剩余空间 */
    .detail-main {
        flex: 1;
        min-width: 0;
        min-height: var(--sticky-max-h);
        align-items: flex-start;
        /* 关键：防止中间内容把 flex 撑爆导致横向溢出 */
        padding: 10px;
        margin-top: 5px;
        /* 你原来 content 的 margin-top/内边距，这里统一一下 */
        gap: var(--gap);
        box-sizing: border-box;
    }

    .detail-main>div {
        flex: 1 1 auto;
        min-width: 0;
    }

    .detail-aside--toc {
        :deep(.vditor-outline) {
            display: block;
        }
    }
}
</style>
