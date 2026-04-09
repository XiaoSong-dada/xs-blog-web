<template>
    <a-drawer
        v-if="mobileLayoutMenu?.isMobileMenuRoute.value"
        class="mobile-side-drawer"
        placement="left"
        :width="260"
        :z-index="1100"
        :open="mobileLayoutMenu?.isMobileMenuOpen.value ?? false"
        :closable="false"
        :mask-closable="true"
        :get-container="false"
        :body-style="{ padding: 0 }"
        @close="mobileLayoutMenu?.closeMenu()"
    >
        <left-menu :items="currentMenuItems" @menu-select="onMenuSelect" />
    </a-drawer>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { Drawer } from 'ant-design-vue';
import LeftMenu from '@/layout/admin/sider.vue';
import { centerMenu } from '@/constants/center-menu';
import { meMenu } from '@/constants/me.menu';
import { buildMenuItem } from '@/ui/menu/build-menu-item';
import { useRoute, useRouter } from 'vue-router';
import { mobileLayoutMenuKey } from '@/layout/common/mobile.layout.menu';

const ADrawer = Drawer;
const route = useRoute();
const router = useRouter();
const mobileLayoutMenu = inject(mobileLayoutMenuKey, null);

const isMeRoute = computed(() => route.path.startsWith('/me'));

const currentMenuSource = computed(() => {
    if (isMeRoute.value) return meMenu;
    return centerMenu;
});

const currentMenuItems = computed(() => {
    return currentMenuSource.value.map(item => buildMenuItem(item));
});

const routePrefix = computed(() => {
    if (isMeRoute.value) return '/me';
    return '/admin';
});

const onMenuSelect = (item: { key: string | number }) => {
    const menu = currentMenuSource.value.find(option => option.key === item.key);
    if (!menu) return;

    router.push(`${routePrefix.value}/${menu.route}`);
    mobileLayoutMenu?.closeMenu();
};
</script>

<style scoped lang="scss">
.mobile-side-drawer {
    :deep(.ant-drawer-mask) {
        top: $header-h;
        height: calc(100% - #{$header-h});
        background: rgba(0, 0, 0, 0.38);
    }

    :deep(.ant-drawer-content-wrapper) {
        top: $header-h;
        height: calc(100% - #{$header-h});
    }

    :deep(.center-asider) {
        border-right: none;
    }
}
</style>
