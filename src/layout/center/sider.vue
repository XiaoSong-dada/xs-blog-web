<template>
    <a-menu class="center-asider" :items="items" @select="menuSelect" />
</template>

<script setup lang="ts">
import { Menu } from 'ant-design-vue';
import type { ItemType } from 'ant-design-vue';
import { centerMenu } from '@/constants/center-menu';
import { buildMenuItem } from '@/ui/menu/build-menu-item';
const AMenu = Menu;
const items: ItemType[] = centerMenu.map((item) => buildMenuItem(item));
const emit = defineEmits(['menu-select'])

const menuSelect = (item: ItemType) => {
    emit('menu-select', item)
}

</script>

<style scoped lang="scss">
.center-asider {
    height: 100%;
}
</style>
