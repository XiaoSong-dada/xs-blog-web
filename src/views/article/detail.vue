<template>
    <div class="article-detail-page">
        <div class="detail-layout">
            <!-- 左侧：目录 -->
            <aside class="detail-aside detail-aside--toc card sticky-aside">
                <vditor-toc ref="tocRef" />
            </aside>

            <!-- 中间：内容 -->
            <main class="detail-main card">
                <detail-header v-model:data="articleDetail" />
                <vditor-view :markdown="articleDetail?.content_md ?? ''" @rendered="handleRendered" />
            </main>

            <!-- 右侧：作者/用户介绍 -->
            <aside class="detail-aside detail-aside--right card sticky-aside">
                <div>这是用户介绍</div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import VditorView from "@/components/vditor/vditor.view.vue";
import VditorToc from "@/components/vditor/vditor.toc.vue";
import DetailHeader from "@/components/article/detail.header.vue";

import { useArticleDetail } from "@/hook/article/useArticle";
import type { IArticleDetailPropos } from "@/types/main";

const props = defineProps<IArticleDetailPropos>();

const { articleDetail, getArticleDetail } = useArticleDetail();

// 目录组件实例
const tocRef = ref<InstanceType<typeof VditorToc> | null>(null);

onMounted(async () => {
    await getArticleDetail(props.slug , true);
});

// vditor-view 渲染完成后，把 root element 交给 toc 渲染
function handleRendered(el: HTMLElement) {
    tocRef.value?.render(el);
}
</script>

<style scoped lang="scss">
/**
 * =========================
 * Article Detail Page Styles
 * 工程化拆分思路：
 * 1) Page: 负责页面背景、整体高度等
 * 2) Layout: 负责三栏布局、宽度、间距、内边距
 * 3) Utilities: card / sticky / columns 宽度等通用样式
 * 4) 组件内部结构样式尽量放组件内（例如 vditor-outline 建议放到 VditorToc.vue 内）
 * =========================
 */

.article-detail-page {
  /* 统一可配置变量：集中管理尺寸，后续调整只改这里 */
  --header-h: var(--app-header-height, 56px);
  --gap: 20px;
  --page-padding: 5px;

  --toc-w: 220px;
  --right-w: 200px;

  --sticky-top: calc(var(--header-h) + var(--page-padding));
  --sticky-max-h: calc(100vh - var(--header-h) - 32px);

  background-color: #F5F6F7;
  min-height: calc(100vh - var(--header-h));
}

/* Layout：只关心布局，不关心颜色皮肤 */
.detail-layout {
    display: flex;
    align-items: flex-start;
    gap: var(--gap);

    width: min(1240px, 100%);
    margin: 0 auto;
    padding: var(--page-padding);

    /* 允许 sticky 元素可见 */
    overflow: visible;
}

/* 通用：卡片外观（以后可复用到其他页面） */
.card {
    background: #fff;
    border-radius: 8px;
}

/* 通用：sticky 侧栏能力 */
.sticky-aside {
    position: sticky;
    top: var(--sticky-top);
    align-self: flex-start;
    max-height: var(--sticky-max-h);
    overflow: auto;
}

/* 通用：侧栏基础 */
.detail-aside {
    flex: 0 0 auto;
}

/* 左侧目录宽度 */
.detail-aside--toc {
    flex-basis: var(--toc-w);
    min-height: var(--sticky-max-h) ;
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
    /* 关键：防止中间内容把 flex 撑爆导致横向溢出 */
    padding: 10px;
    margin-top: 5px;
    /* 你原来 content 的 margin-top/内边距，这里统一一下 */
    min-height: calc(100vh - var(--header-h) - (var(--page-padding) * 2));
}

/**
 * ⚠️ 建议：把这类 deep 样式挪到 VditorToc.vue 内部，
 * 因为它依赖子组件内部结构，页面不应该关心 .vditor-outline
 *
 * 如果你暂时不想改组件，就先保留：
 */
.detail-aside--toc {
    :deep(.vditor-outline) {
        display: block;
    }
}
</style>
