<template>
    <div class="flex-start">
        <div class="comment-avatar">
            <a-avatar v-if="comment.avatar_url" :src="computeImageUrl(comment.avatar_url)" :size="40" />
        </div>
        <div class="comment-body">
            <div class="comment-meta flex-between">
                <span>{{ formatUserName(comment) }}</span>
                <span class="comment-time">{{ formatDate(comment.created_at) }}</span>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IComment } from '@/types/main'
import { Avatar } from 'ant-design-vue'
import { formatDate } from '@/utils/date'
import { useComputedUrl } from '@/hook/file/useFile'

const AAvatar = Avatar
const { computeImageUrl } = useComputedUrl()

const props = defineProps<{ comment: IComment }>()

const formatUserName = (comment: IComment) => {
    return comment.nick_name || comment.username || '匿名用户'
}
</script>

<style scoped lang="scss">
.flex-start {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.comment-avatar {
    width: 40px;
    flex: 0 0 40px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
}

.comment-body {
    flex: 1 1 auto;
    min-width: 0;
}

.comment-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    width: 100%;
}

.comment-content {
    white-space: pre-wrap;
    word-break: break-word;
}
</style>
