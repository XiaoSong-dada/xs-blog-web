<template>
    <div class="comment-thread">
        <div class="comment-item">
            <div class="flex-start">
                <div class="comment-avatar">
                    <a-avatar v-if="thread.comment.avatar_url" :src="computeImageUrl(thread.comment.avatar_url)"
                        :size="40" />
                </div>
                <div class="comment-body">
                    <div class="comment-meta flex-between">
                        <span>{{ formatUserName(thread.comment) }}</span>
                        <span class="comment-time">{{ formatDate(thread.comment.created_at) }}</span>
                    </div>
                    <div class="comment-content">{{ thread.comment.content }}</div>
                </div>
            </div>

            <div class="comment-action">
                <button class="comment-link" @click="toggleReplyInput">
                    {{ replyOpen ? '取消回复' : '回复' }}
                </button>
            </div>
        </div>

        <div v-if="replyOpen" class="reply-editor">
            <a-textarea v-model:value="replyContent" class="comment-textarea" placeholder="写下你的回复..."
                @press-enter="handleSubmitReply" />
            <div class="comment-editor-action">
                <button class="comment-btn" :disabled="submitting" @click="handleSubmitReply">
                    提交回复
                </button>
            </div>
        </div>

        <div v-if="thread.replies.length > 0" class="reply-list">
            <div v-for="reply in thread.replies" :key="reply.id" class="comment-item comment-item--reply">

                <div class="flex-start">
                    <div class="comment-avatar">
                        <a-avatar v-if="reply.avatar_url" :src="computeImageUrl(reply.avatar_url)" :size="40" />
                    </div>
                    <div class="comment-body">
                        <div class="comment-meta flex-between">
                            <span>{{ formatUserName(reply) }}</span>
                            <span class="comment-time">{{ formatDate(reply.created_at) }}</span>
                        </div>
                        <div class="comment-content">{{ reply.content }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IComment, ICommentThread } from '@/types/main'
import { Textarea, Avatar } from 'ant-design-vue';
import { formatDate } from '@/utils/date';
import { useComputedUrl } from '@/hook/file/useFile';
const ATextarea = Textarea;
const AAvatar = Avatar;

const { computeImageUrl } = useComputedUrl()
interface Props {
    thread: ICommentThread;
    submitting: boolean;
    onSubmitReply: (commentId: string, content: string) => Promise<boolean>;
}

const props = defineProps<Props>()

const replyOpen = ref(false)
const replyContent = ref('')

const formatUserName = (comment: IComment) => {
    return comment.nick_name || comment.username || '匿名用户'
}

const toggleReplyInput = () => {
    replyOpen.value = !replyOpen.value
}

const handleSubmitReply = async () => {
    const ok = await props.onSubmitReply(props.thread.comment.id, replyContent.value)
    if (ok) {
        replyContent.value = ''
        replyOpen.value = false
    }
}
</script>

<style scoped lang="scss">
.comment-thread {
    border: 1px solid $dark-color;
    border-radius: 8px;
    padding: 10px;
    box-sizing: border-box;
}

.comment-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

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

.comment-item--reply {
    padding: 8px;
    border: 1px solid $dark-color;
    border-radius: 6px;
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

.comment-action {
    display: flex;
    justify-content: flex-end;
}

.comment-link {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
}

.reply-editor {
    margin-top: 10px;
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

.reply-list {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
