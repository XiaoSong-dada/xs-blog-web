<template>
    <p class="meta">
        <span class="meta__item">
            <span class="meta__label">作者</span>
            <span class="meta__value">小宋</span>
        </span>

        <span class="meta__divider">·</span>

        <span class="meta__item">
            <span class="meta__label">发布</span>
            <time class="meta__value" :datetime="data.published_at ?? ''">
                {{ props.data.published_at ? formatDate(props.data.published_at, "yyyy/MM/dd") : "未发布" }}
            </time>
        </span>
    </p>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { IArticleMeta } from '@/types/main'
import { formatDate } from '@/utils/date'

const props = defineProps<{ data: IArticleMeta }>()
const data = ref<IArticleMeta>({})

</script>

<style scoped lang="scss">
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
</style>