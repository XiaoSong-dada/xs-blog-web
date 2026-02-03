<template>
    <div v-if="items.length" class="article-list">
        <article v-for="article in items" :key="article.id" class="card">
            <header class="card__header">
                <h3 class="card__title">{{ article.title }}</h3>

                <div class="card__tags">
                    <a-tag>学习</a-tag>
                    <a-tag>工作</a-tag>
                </div>
            </header>

            <p class="card__excerpt">
                {{ excerpt(article.content_md) }}
            </p>

            <p class="meta">
                <span class="meta__item">
                    <span class="meta__label">作者</span>
                    <span class="meta__value">小宋</span>
                </span>

                <span class="meta__divider">·</span>

                <span class="meta__item">
                    <span class="meta__label">发布</span>
                    <time class="meta__value" :datetime="article.published_at ?? ''">
                        {{ article.published_at ? formatDate(article.published_at, "yyyy/MM/dd") : "未发布" }}
                    </time>
                </span>
            </p>

            <footer class="footer">
                <span class="footer__item">
                    <img src="@/assets/icon/collection.svg" alt="收藏" />
                    <span>0</span>
                </span>

                <span class="footer__divider"></span>

                <span class="footer__item">
                    <img src="@/assets/icon/like.svg" alt="点赞" />
                    <span>0</span>
                </span>

                <span class="footer__divider"></span>

                <span class="footer__item">
                    <img src="@/assets/icon/comment.svg" alt="评论" />
                    <span>0</span>
                </span>

                <span class="footer__spacer"></span>

                <span class="footer__item">
                    <img src="@/assets/icon/view.svg" alt="浏览" />
                    <span>{{ article.view_count }}</span>
                </span>
            </footer>
        </article>
    </div>

    <div v-else class="empty">
        暂无文章
    </div>
</template>

<script setup lang="ts">
import type { IArticle } from "@/types/main";
import { formatDate } from "@/utils/date";
import { computed } from "vue";
import { Tag } from "ant-design-vue";
const ATag = Tag;
const props = defineProps<{ data: IArticle[] }>();

const items = computed(() => props.data ?? []);

/**
 * 简易“去 Markdown 标记”版本：先把常见符号去掉，做列表摘要足够用。
 * 以后你想要更强的效果，可以换成 markdown-it + strip 或者后端生成 excerpt。
 */
const stripMd = (md: string) =>
    md
        .replace(/```[\s\S]*?```/g, "") // code block
        .replace(/`[^`]*`/g, "")       // inline code
        .replace(/!\[[^\]]*]\([^)]*\)/g, "") // images
        .replace(/\[[^\]]*]\([^)]*\)/g, "$1") // links (keep text)
        .replace(/[#>*_~\-]+/g, " ")    // common marks
        .replace(/\s+/g, " ")
        .trim();

const excerpt = (md: string | null) => {
    const raw = stripMd(md ?? "");
    return raw.length > 200 ? raw.slice(0, 200) + "…" : raw;
};
</script>

<style scoped lang="scss">
.article-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.card {
    border: 1px solid $dark-color; // ✅ 你 variable.scss 里就有这个
    background: #fff;
    border-radius: 12px;
    padding: 12px 14px;

    &__header {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    &__title {
        margin: 0;
        font-size: 18px;
        line-height: 1.3;
    }

    &__tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    &__excerpt {
        margin: 10px 0 8px;
        color: #444;
        font-size: 14px;
        line-height: 1.6;
    }
}

.meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #666;
    margin: 0;

    &__item {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
    }

    &__label {
        color: #999;
    }

    &__value {
        color: #555;
    }

    &__divider {
        color: #bbb;
    }
}

.footer {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #666;

    &__item {
        display: inline-flex;
        align-items: center;
        gap: 4px;

        img {
            width: 23px;
            height: 23px;
            display: block;
        }
    }

    &__divider {
        width: 1px;
        height: 14px;
        background: $dark-color;
    }

    &__spacer {
        flex: 1;
    }

    .collection {
        width: 20px;
        width: 20px;
    }
}

.empty {
    padding: 24px;
    color: #888;
    text-align: center;
}
</style>
