<template>
    <a-menu class="center-asider" :items="props.items" @select="menuSelect" />
</template>

<script setup lang="ts">
import { Menu } from 'ant-design-vue';
import type { ItemType } from 'ant-design-vue';
const props = defineProps<{
    // 这里可以根据需要定义 props
    items: ItemType[]
}>();
const AMenu = Menu;
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
