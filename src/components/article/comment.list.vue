<template>
    <div class="comment">
        <h3 class="comment-title">评论</h3>
        <div class="comment-editor">
            <a-textarea v-model:value="commentContent" class="comment-textarea" placeholder="写下你的评论..."
                @press-enter="handleSubmitComment" />
            <div class="comment-editor-action">
                <button class="comment-btn" :disabled="submitting" @click="handleSubmitComment">
                    发表评论
                </button>
            </div>
        </div>

        <div v-if="loading" class="comment-loading">评论加载中...</div>
        <div v-else-if="threads.length === 0" class="comment-empty">暂无评论，来抢沙发吧~</div>
        <div v-else class="comment-list">
            <comment-item v-for="thread in threads" :key="thread.comment.id" :thread="thread" :submitting="submitting"
                :on-submit-reply="onSubmitReply" />
        </div>

        <div v-if="hasMore" class="comment-more">
            <button class="comment-btn comment-btn--ghost" :disabled="loading" @click="onLoadMore">
                加载更多
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ICommentThread } from '@/types/main'
import CommentItem from './comment.item.vue'
import { Textarea } from 'ant-design-vue';


const ATextarea = Textarea;
interface Props {
    threads: ICommentThread[];
    loading: boolean;
    submitting: boolean;
    hasMore: boolean;
    onSubmitComment: (content: string) => Promise<boolean>;
    onSubmitReply: (commentId: string, content: string) => Promise<boolean>;
    onLoadMore: () => Promise<void> | void;
}

const props = defineProps<Props>()
const commentContent = ref('')

const handleSubmitComment = async () => {
    const ok = await props.onSubmitComment(commentContent.value)
    if (ok) commentContent.value = ''
}
</script>

<style scoped lang="scss">
.comment {
    border-top: 1px solid $dark-color;
    padding-top: 12px;
}

.comment-title {
    margin: 0 0 12px;
}

.comment-editor {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.comment-editor-action {
    display: flex;
    justify-content: flex-end;
}

.comment-textarea {
    min-height: 88px;
    resize: vertical;
    border: 1px solid $dark-color;
    border-radius: 6px;
    padding: 8px;
    box-sizing: border-box;
}

.comment-btn {
    border: 1px solid $dark-color;
    background: transparent;
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;
}

.comment-btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.comment-btn--ghost {
    width: 100%;
}

.comment-list {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.comment-loading,
.comment-empty,
.comment-more {
    margin-top: 12px;
}
</style>
