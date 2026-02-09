<template>
    <a-list class="me-security-list" :data-source="data" item-layout="horizontal">
        <a-list-item v-for="item in data" :key="item.title" class="flex-between row">
            <span class="flex-center flex-column text">
                <span>
                    {{ item.title }}
                </span>
                <span class="default-color">
                    {{ item.description }}
                </span>
            </span>
            <span>
                <a-button type="link" class="default-color" @click="handleClick(item.action)">修改</a-button>
            </span>
        </a-list-item>
    </a-list>
</template>

<script setup lang="ts">
import { Button, List } from 'ant-design-vue';
const AButton = Button
const AList = List;
const AListItem = List.Item;
const emits = defineEmits<{
    (e: 'action', action: string): void;
}>();
const handleClick = (action: string) => {
    emits('action', action);
}

const data = [
    {'title':"账户密码",'description':"修改账户登录密码","action":"changePassword"},
];

</script>

<style scoped lang="scss">
.me-security-list {
    .row {
        border-bottom: 1px solid $dark-color;
    }
    .default-color {
        color: #999393;
    }
    .text {
        gap:10px
    }
}
</style>