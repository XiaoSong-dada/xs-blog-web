<template>
    <div class="article-list">
        <a-list v-for="article in article_list" :key="article.id">
            <template #header>
                {{ article.title }}
            </template>
            {{ omitString(article.content_md ?? '', 200) }}
            <template #footer>
                <span>
                    发布时间：
                    {{ article.published_at }}
                </span>
                <span>
                    浏览数量：
                    {{ article.view_count }}
                </span>
            </template>
        </a-list>
    </div>

</template>

<script setup lang="ts">
import type { IArticle } from '@/types/main';
import { omitString } from '@/utils/utils';
import { List } from 'ant-design-vue';
import { ref, watch } from 'vue';
const AList = List;
const prop = defineProps<{ data: IArticle[] }>();
const article_list = ref<IArticle[]>()

watch(
    () => prop.data,
    (data) => {
        article_list.value = data
    }
)
</script>

<style scoped lang="scss"></style>