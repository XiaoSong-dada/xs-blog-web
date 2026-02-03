<template>
    <a-layout class="admin-layout">
        <a-layout-content class="admin-content">
            <router-view />
        </a-layout-content>
    </a-layout>
</template>

<script setup lang="ts">
import { Layout } from 'ant-design-vue';
import { onMounted, reactive } from 'vue';
import { centerMenu } from '@/constants/center-menu';
const ALayout = Layout;
const ALayoutContent = Layout.Content;

const emit = defineEmits(['menu-select']);
const menuItemMap = reactive(new Map<string, string>());

onMounted(() => {
    centerMenu.forEach(item => {
        menuItemMap.set(item.key, item.route)
    })
})
</script>

<style scoped lang="scss">

.admin-layout{
    .admin-content {
        padding: $editor-content-padding;
    }
}
</style>
