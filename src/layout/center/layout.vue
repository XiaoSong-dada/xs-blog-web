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
import Sider from '@/layout/center/sider.vue'
import { onMounted, reactive } from 'vue';
import type { CenterMenuItem } from '@/types/main';
import { centerMenu } from '@/constants/center-menu';
const ALayout = Layout;
const ALayoutContent = Layout.Content;
const ALayoutSider = Layout.Sider;

const emit = defineEmits(['menu-select']);
const menuItemMap = reactive(new Map<string, string>());

// (item: ItemType) => { emit('menu-select', item.router) }
const onMenuClick = (item: CenterMenuItem) => {
    if (item.key && menuItemMap.has(item.key)) {
        emit('menu-select', menuItemMap.get(item.key))
    }
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
