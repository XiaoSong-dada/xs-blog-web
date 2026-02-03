<template>
    <a-layout class="admin-layout">
        <a-layout-sider class="cover-width-height">
            <sider @menu-select="onMenuClick" />
        </a-layout-sider>
        <a-layout-content class="admin-content">
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
.admin-layout {
  height: 100%;
  .admin-content {
    padding: $admin-content-padding;
    height: calc(100% - $header-h - $editor-content-padding);
  }
}
</style>
