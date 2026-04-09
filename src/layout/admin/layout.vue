<template>
    <a-layout class="admin-layout">
        <a-layout-sider v-if="!shouldHideSider" class="cover-width-height">
            <sider @menu-select="onMenuClick" :items="centerMenu.map(item => buildMenuItem(item))" />
        </a-layout-sider>
        <a-layout-content class="admin-content" :class="{ 'admin-content--full': shouldHideSider }">
            <router-view />
        </a-layout-content>
    </a-layout>
</template>

<script setup lang="ts">
import { Layout } from 'ant-design-vue';
import Sider from '@/layout/admin/sider.vue'
import { computed, inject, onMounted, reactive } from 'vue';
import type { CenterMenuItem } from '@/types/main';
import { centerMenu } from '@/constants/center-menu';
import { useRouter } from 'vue-router';
import { buildMenuItem } from '@/ui/menu/build-menu-item';
import { mobileLayoutMenuKey } from '@/layout/common/mobile.layout.menu';
const ALayout = Layout;
const ALayoutContent = Layout.Content;
const ALayoutSider = Layout.Sider;

const menuItemMap = reactive(new Map<string, string>());
const router = useRouter()
const mobileLayoutMenu = inject(mobileLayoutMenuKey, null);

const shouldHideSider = computed(() => {
    return Boolean(mobileLayoutMenu?.isMobileMenuRoute.value);
});

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

        &--full {
            width: 100%;
            height: 100%;
        }
    }

    @media (max-width: 992px) {
        .admin-content {
            padding: 12px;
            height: 100%;
        }
  }
}
</style>
