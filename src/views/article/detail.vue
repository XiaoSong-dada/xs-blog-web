<template>
    <div :class="['article-detail-page overflow-scroll overflow-scroll--max flex-center pt-5', { scrolled: isScrolled }]">
        <div class="detail-layout">
            <aside class="detail-aside detail-aside--toc sticky-aside">
                <div class="card aside-padding">
                    <detail-header :data="article ?? null" />
                </div>
                <div class="card toc">
                    <vditor-toc ref="tocRef" :scroll-container="scrollContainer" :offset-top="8" />
                </div>
            </aside>
            <main class="detail-main card flex-start flex-column">
                <div class="vditor-content">
                    <vditor-view :markdown="articleDetail?.content_md ?? ''" @rendered="handleRendered" />
                </div>
                <comment-list
                    class="comment"
                    :threads="commentThreads"
                    :loading="loading"
                    :submitting="submitting"
                    :has-more="hasMore"
                    :on-submit-comment="createComment"
                    :on-submit-reply="replyComment"
                    :on-load-more="loadMore"
                />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";

import VditorView from "@/components/vditor/vditor.view.vue";
import VditorToc from "@/components/vditor/vditor.toc.vue";
import DetailHeader from "@/components/article/detail.header.vue";
import CommentList from "@/components/article/comment.list.vue";

import { useAddView, useArticleComment, useArticleDetail } from "@/hook/article/useArticle";
import type { IArticle, IArticleDetailPropos } from "@/types/main";

const article = ref<IArticle>();
const props = defineProps<IArticleDetailPropos>();

const { articleDetail, getArticleDetail } = useArticleDetail();
const { addView } = useAddView();
const {
    commentThreads,
    loading,
    submitting,
    hasMore,
    fetchComments,
    createComment,
    replyComment,
    loadMore,
} = useArticleComment(() => article.value?.id ?? "");

const tocRef = ref<InstanceType<typeof VditorToc> | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);
const isScrolled = ref(false);

onMounted(async () => {
    scrollContainer.value = document.querySelector(".article-detail-page") as HTMLElement | null;
    await getArticleDetail(props.slug, true);
});

const onScroll = () => {
    if (!scrollContainer.value) return
    isScrolled.value = scrollContainer.value.scrollTop > 0
}

onMounted(() => {
    if (scrollContainer.value) {
        scrollContainer.value.addEventListener('scroll', onScroll, { passive: true })
    }
})

onUnmounted(() => {
    if (scrollContainer.value) {
        scrollContainer.value.removeEventListener('scroll', onScroll)
    }
})

function handleRendered(el: HTMLElement) {
    tocRef.value?.render(el);
}

watch(
    () => articleDetail.value,
    async (val) => {
        if (val) {
            addView(val.id);
            article.value = val;
            await fetchComments(false);
        }
    },
);
</script>
<style scoped lang="scss">
    .article-detail-page {
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

    .detail-layout {
        display: flex;
        align-items: flex-start;

        width: min(1240px, 100%);
        margin: 0 auto;
        padding: var($page-padding);
        min-height: 100%;
        box-sizing: border-box;
        gap: var(--gap);
        overflow: visible;
    }

    .vditor-content {
        width: 100%;
    }

    .card {
        background: #fff;
        border-right: 1px solid $dark-color;
        border-radius: 5px;
    }

    .sticky-aside {
        position: fixed;
        top: $sticky-top;
        align-self: flex-start;
        max-height: var(--sticky-max-h);
        overflow: auto;
        width: var(--toc-w);
        z-index: 10;
        transition: top 0.18s ease;
    }

    /* when scrolled, remove the extra header padding distance */
    &.scrolled {
        .sticky-aside {
            top: var(--header-h);
        }
    }

    .aside-padding {
        padding: 10px;
    }

    .toc {
        min-height: var(--toc-height);
        flex: 1 1 auto;
        overflow: auto;
    }

    .detail-aside {
        display: flex;
        flex-direction: column;
        gap: 20px;
        flex: 0 0;
        padding: 5px;
    }

    .detail-aside--toc {
        flex-basis: var(--toc-w);
        min-height: var(--sticky-max-h);
    }

    @media (min-width: 1240px) {
        .detail-aside--toc {
            left: calc((100% - 1240px) / 2);
        }

        .detail-main {
            margin-left: calc(var(--toc-w) + var(--gap));
        }
    }

    @media (max-width: 1239px) {
        .detail-aside--toc {
            left: 10px;
            width: calc(var(--toc-w) - 20px);
        }
    }

    .detail-aside--right {
        flex-basis: var(--right-w);
        min-height: var(--sticky-max-h);
    }

    .detail-main {
        flex: 1;
        min-width: 0;
        min-height: var(--sticky-max-h);
        align-items: flex-start;
        padding: 10px;
        margin-top: 5px;
        gap: var(--gap);
        box-sizing: border-box;
    }

    .detail-main > div {
        flex: 1 1 auto;
        min-width: 0;
    }

    .detail-aside--toc {
        :deep(.vditor-outline) {
            display: block;
        }
    }

    .comment {
        width: 100%;
        padding-bottom: 20px;
    }
}
</style>
