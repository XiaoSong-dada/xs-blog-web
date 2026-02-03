<template>
    <div class="article-list" v-for="article in article_list" :key="article.id">
        <div>
            <p class="article-title">
                {{ article.title }}

            </p>
            <p class="tag">
                <a-tag>学习</a-tag>
                <a-tag>工作</a-tag>
            </p>
            <p>
                {{ omitString(article.content_md ?? '', 200) }}
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
                        {{ article.published_at ? formatDate(article.published_at , 'yyy/MM/dd') : "未发布" }}
                    </time>
                </span>
            </p>
            <div class="flex-start article-footer">
                <span class="meta-item">
                    <img src="@/assets/icon/collection.svg" alt="收藏" class="collection-img" />
                    <span>{{ article.view_count }}</span>
                </span>
                <span class="meta-item center-span">
                    <img src="@/assets/icon/like.svg" alt="点赞" />
                    <span>{{ article.view_count }}</span>
                </span>
                <span class="meta-item">
                    <img src="@/assets/icon/comment.svg" alt="评论" />
                    <span>{{ article.view_count }}</span>
                </span>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import type { IArticle } from '@/types/main';
import { formatDate } from '@/utils/date';
import { omitString } from '@/utils/utils';
import { List, Tag } from 'ant-design-vue';
import { ref, watch } from 'vue';
const ATag = Tag;

const prop = defineProps<{ data: IArticle[] }>();
const article_list = ref<IArticle[]>()

watch(
    () => prop.data,
    (data) => {
        article_list.value = data
    }
)
</script>

<style scoped lang="scss">
.article-list {
    border: 1px solid rgb(209, 209, 209);
    padding: 5px;
    border-radius: 10px;
    margin: 20px 0;
    background-color: #fff;

    p {
        margin: 0 0 10px 0;
    }

    .article-title {
        font-size: 18px;
    }

    .darkgren-color {
        color: $dark-color;
    }

    .mini-text {
        font-size: 14px;
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


    .center-span {
        $--border-style: 1px solid $dark-color;
        border-left: $--border-style;
        border-right: $--border-style;
        padding: 0 10px;
    }

    .article-footer {
        gap: 10px;

        .meta-item {
            display: inline-flex;
            align-items: center; // 
            gap: 4px;

            .collection-img {
                width: 20px;
                height: 20px;
            }

            img {
                width: 23px;
                height: 23px;
                display: block;
            }
        }
    }
}
</style>
