<template>
    <a-layout class="center-layout cover-width-height">
        <a-layout-sider class="cover-width-height">
            <sider @menu-select="onMenuClick" />
        </a-layout-sider>
        <a-layout-content class="cover-width-height content">
            <router-view />
        </a-layout-content>
    </a-layout>
</template>

<script setup lang="ts">
import { Layout } from 'ant-design-vue';
import Sider from '@/layout/admin/sider.vue'
import { onMounted, reactive } from 'vue';
import type { CenterMenuItem } from '@/types/main';
import { centerMenu } from '@/constants/center-menu';
import { useRouter } from 'vue-router';
const ALayout = Layout;
const ALayoutContent = Layout.Content;
const ALayoutSider = Layout.Sider;

const menuItemMap = reactive(new Map<string, string>());
const router = useRouter()

// (item: ItemType) => { emit('menu-select', item.router) }
const onMenuClick = (item: CenterMenuItem) => {
    router.push(`/admin/${menuItemMap.get(item.key) ?? ''}`)
}
onMounted(() => {
    centerMenu.forEach(item => {
        menuItemMap.set(item.key, item.route)
    })
})
</script>

<style scoped lang="scss">
.center-layout {
    height: 100%;

    .content {
        padding: 5px;
    }
}
</style>
