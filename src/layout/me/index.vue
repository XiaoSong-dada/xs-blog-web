<template>
  <a-layout class="me-layout">
    <a-layout-sider v-if="!shouldHideSider" theme="light">
      <left-menu :items="meMenu.map(item => buildMenuItem(item))" @menu-select="selected"/>
    </a-layout-sider>
    <a-layout-content class="me-layout-content" :class="{ 'me-layout-content--full': shouldHideSider }">
        <p class="me-layout-title">
            {{title}}
        </p>
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import LeftMenu from '@/layout/admin/sider.vue';
import { Layout } from 'ant-design-vue';
import { meMenu } from '@/constants/me.menu';
import { buildMenuItem } from '@/ui/menu/build-menu-item';
import { useRouter } from 'vue-router';
import { computed, inject, ref } from 'vue';
import { mobileLayoutMenuKey } from '@/layout/common/mobile.layout.menu';
const ALayout = Layout;
const ALayoutSider = Layout.Sider;
const ALayoutContent = Layout.Content;
const router = useRouter();
const title = ref<string>('');
const mobileLayoutMenu = inject(mobileLayoutMenuKey, null);

const shouldHideSider = computed(() => {
  return Boolean(mobileLayoutMenu?.isMobileMenuRoute.value);
});


const selected = (item: any) => {
  meMenu.forEach(menu => {
    if (menu.key === item.key) {
      router.push(`/me/${menu.route}`)
      title.value = menu.label
    }
  })
}
</script>

<style scoped lang="scss">
.me-layout {
  height: 100%;
  width: 100%;

  &-content {
    padding: 0 40px;
    background: #fff;

    &--full {
      width: 100%;
    }
  }

  &-title {
    margin: 0;
    margin-top: 5px;
    margin-bottom: 20px;
    font-size:20px;
    font-weight: 500;
  }

  @media (max-width: 992px) {
    &-content {
      padding: 0 12px;
    }
  }
 
}
</style>
