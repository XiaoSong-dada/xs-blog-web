<template>
    <div class="bookmark">
        <a-spin :spinning="loading">
            <div v-if="!list.length" class="empty-wrap">
                <a-empty description="暂无收藏" />
            </div>
            <div v-else class="content-wrap">
                <div class="bookmark-list">
                    <a-card v-for="item in list" :key="item.id" class="bookmark-card" :hoverable="true">
                        <template #title>
                            <a class="title" @click="goDetail(item)">{{ item.title }}</a>
                        </template>
                        <div class="bookmark-content">
                            {{ omitString(item.content_md ?? '', 100) }}
                            <span v-if="(item.content_md || '').length > 100">...</span>
                        </div>
                    </a-card>
                </div>
                <div class="pagination-wrap">
                    <a-pagination :current="pagination.current" :page-size="pagination.pageSize"
                        :total="pagination.total" :show-size-changer="true" :show-total="pagination.showTotal"
                        @change="onPageChange" @showSizeChange="onPageChange" />
                </div>
            </div>
        </a-spin>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Card, Empty, Pagination, Spin } from 'ant-design-vue'
import { useBookmarkList } from '@/hook/article/useArticle'
import type { IArticle } from '@/types/main'
import { useRouter } from 'vue-router'
import { omitString } from '@/utils/utils'

const ACard = Card
const AEmpty = Empty
const APagination = Pagination
const ASpin = Spin

const router = useRouter()
const { params, data: list, total, loading, fetchList } = useBookmarkList()

const onPageChange = (page: number, pageSize: number) => {
    params.value.offset = page
    params.value.limit = pageSize
    fetchList()
}

const pagination = computed(() => ({
    current: params.value.offset || 1,
    pageSize: params.value.limit || 10,
    total: total.value,
    showTotal: () => `共${total.value} 条`
}))

const goDetail = (item: IArticle) => {
    router.push(`/article/${item.slug}`)
}

onMounted(() => {
    fetchList()
})
</script>

<style scoped lang="scss">
.bookmark {
    width: 100%;
    height: 100%;

    .content-wrap {
        display: flex;
        flex-direction: column;
        max-height: calc(100vh - 220px);
        min-height: 360px;
    }

    .empty-wrap {
        padding: 40px 0;
    }

    .bookmark-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, 230px);
        grid-auto-rows: minmax(200px, auto);
        gap: 16px;
        justify-content: flex-start;
        overflow: auto;
        flex: 1 1 auto;
        padding: 8px 0;
    }

    :deep(.ant-card-body) {
        padding: 0;
        height:100%;
    }

    .bookmark-card {
        width: 200px;
        min-height: 130px;
        display: flex;
        flex-direction: column;

        .title {
            cursor: pointer;
            color: var(--ant-primary-color);
            display: block;
            padding: 4px 8px;
            font-size: 13px;
            line-height: 1.1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .bookmark-content {
            margin-top: 6px;
            color: #666;
            padding: 0 8px 8px;
            flex: 1 1 auto;
            overflow: auto;
            font-size: 12px;
            line-height: 1.2;
            word-break: break-word;
            max-height: calc(100% - 28px);
        }
    }

    .pagination-wrap {
        margin-top: 12px;
        display: flex;
        justify-content: flex-end;
        flex-shrink: 0;
        padding-top: 8px;
    }
}
</style>