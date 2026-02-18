<template>
    <div class="link pt-5">
        <div class="content">
            <p class="title">友情链接</p>
            <friend-link-list :data="publishLinks" />
        </div>
    </div>
</template>

<script setup lang="ts">
import FriendLinkList from '@/components/link/FriendLinkList.vue';
import { usePublishLinkList } from '@/hook/link/useFriendLink';
import { onMounted } from 'vue';

const { publishLinks, getPublishList } = usePublishLinkList()

onMounted(() => {
    getPublishList();
})
</script>

<style scoped lang="scss">
.link {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;

    .content {
        width: min(90vw, 800px);
        height: 90%;
        background-color: #fff;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 10px;
        padding: 16px;

        .title {
            text-align: center;
            margin: 0 0 12px 0;
        }
    }
}
</style>